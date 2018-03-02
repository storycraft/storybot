import Game from '../../game';

import { MessageTemplate, MessageAttachment } from 'storybot-core';

import ChessBoard from './chess-board';
import BoardRenderer from './board-renderer';

import BoardMathHelper from './board-math-helper';

export default class ChessGame extends Game {
    constructor(playChannel){
        super(playChannel);

        this.gameboard = new ChessBoard(this);
        this.boardRenderer = new BoardRenderer(this.gameboard);

        this.currentTurn = 1;

        this.winner = null;

        this.statusMessage = '';

        this.gameCommandBind = this.onGameCommand.bind(this);
        this.moveCommandBind = this.onMoveCommand.bind(this);

        this.lastBoardMessage = null;
        this.lastStatMessage = null;
    }

    get BlackPlayer(){
        return this.PlayerList[0];
    }

    get WhitePlayer(){
        return this.PlayerList[1];
    }

    get Winner(){
        return this.winner;
    }

    set BlackPlayer(user){
        this.PlayerList[0] = user;
    }

    set WhitePlayer(user){
        this.PlayerList[1] = user;
    }

    get CurrentTurn(){
        return this.currentTurn;
    }

    get CurrentPlayer(){
        return this.PlayerList[this.CurrentTurn];
    }

    get StatusMessage(){
        return this.statusMessage;
    }

    start(gameManager){
        if (this.PlayerList.length != 2)
            throw new Error('플레이어 수는 2명이어야 합니다');

        super.start(gameManager);

        this.statusMessage = `\`${this.BlackPlayer.Name}\`와 \`${this.WhitePlayer.Name}\`의 체스가 시작 되었습니다`;

        this.gameManager.Main.CommandManager.on('game', this.gameCommandBind);
        this.gameManager.Main.CommandManager.on('move', this.moveCommandBind);

        this.sendInfoMessages();
    }

    setNextTurn(){
        return this.currentTurn = (this.currentTurn == 1 ? 0/*Black*/ : 1/*White*/);
    }

    onMoveCommand(args, user, bot, source){
        if (source != this.PlayChannel || !this.PlayerList.includes(user))
            return;

        if (this.CurrentPlayer != user){
            return;
        }
        else if (args.length != 2){
            source.send('사용법: *move <말의 위치> <이동 할 위치>\nEx) *move a1 a3');
            return;
        }

        try{
            var firstX = args[0][0].toLowerCase().charCodeAt(0) - 97/*소문자 a 키 코드 입력된 문자에서 a 키 코드 값을 빼서 위치를 구함*/
            var firstY = Number.parseInt(args[0][1]) - 1;//배열은 0부터 시작하니 1씩 빼줍시다
            
            var secX = args[1][0].toLowerCase().charCodeAt(0) - 97;
            var secY = Number.parseInt(args[1][1]) - 1;

            if (firstX > 7 || firstY > 7 || secX > 7 || secY > 7 || firstX < 0 || firstY < 0 || secX < 0 || secY < 0){
                source.send('숫자의 범위가 잘못 되었습니다 허용 범위 (a ~ h)(1 ~ 8)');
                return;
            }

            var piece = this.gameboard.getPieceAt(BoardMathHelper.getCombinedLocation(firstX, firstY));

            if (!piece || this.CurrentTurn == 0 && this.gameboard.WhitePieces.includes(piece) || this.CurrentTurn == 1 && this.gameboard.BlackPieces.includes(piece)){
                source.send(`해당 위치\`${args[0]}\`에 움직일 수 있는 말이 없습니다`);
                return;
            }

            var combinedMovePos = BoardMathHelper.getCombinedLocation(secX, secY);
            if (piece.canMoveTo(combinedMovePos)){
                this.gameboard.movePieceTo(piece, combinedMovePos);

                if (!this.gameboard.IsGameOver){
                    this.setNextTurn();

                    this.statusMessage = `\`${this.CurrentPlayer.Name}\`의 차례입니다`;

                    this.removeLastMessages();
                    this.sendInfoMessages();
                }
                else{
                    if (this.gameboard.WhiteKingDead)
                        this.winner = this.BlackPlayer;
                    else if (this.gameboard.BlackKingDied)
                        this.winner = this.WhitePlayer;
                    
                    this.stop();
                }
            }
            else{
                source.send('해당 피스는 거기로 움직일 수 없습니다');
            }

        } catch(e){
            source.send(`올바른 형식으로 입력해 주세요\nEx) *move a1 a3\n${e}`);
        }
    }

    onGameCommand(args, user, bot, source){
        if (source != this.PlayChannel || !this.PlayerList.includes(user))
            return;

        if (args.length < 1)
            args.push('');

        switch(args[0]){

            case 'disclaim':
                source.send(`\`${user.Name}\`이(가) 기권을 선언했습니다`);

                if (user == this.WhitePlayer){
                    this.winner = this.BlackPlayer;
                }
                else if (user == this.BlackPlayer){
                    this.winner = this.WhitePlayer;
                }
                
                this.stop();
                break;

            default:
                source.send('사용 가능한 명령어 (플레이어만 사용 가능)\n disclaim: 기권 선언');
                break;
        }
    }

    async sendInfoMessages(){
        try{
            await this.boardRenderer.init();
        
            var messageTemplate = new MessageTemplate(this.statusMessage, [ new MessageAttachment('chess-board.png', await this.boardRenderer.render()) ]);

            var messageList = await this.PlayChannel.send(messageTemplate);

            this.lastBoardMessage = messageList[0];
            this.lastStatMessage = messageList[1];

            await this.PlayChannel.send(`[B] ${this.BlackPlayer.Name} vs [W] ${this.WhitePlayer.Name}`);
        } catch (e){
            await this.PlayChannel.send(`작업 진행중 오류가 발생했습니다\n${e}`);
        }
    }

    async removeLastMessages(){
        var tasks = [];

        if (this.lastBoardMessage && this.lastBoardMessage.Deletable)
            tasks.push(this.lastBoardMessage.delete());

        if (this.lastStatMessage && this.lastStatMessage.Deletable)
            tasks.push(this.lastStatMessage.delete());

        await Promise.all(tasks);
    }

    stop(){
        super.stop();

        this.gameManager.Main.CommandManager.removeListener('game', this.gameCommandBind);
        this.gameManager.Main.CommandManager.removeListener('move', this.moveCommandBind);

        if (this.winner){
            this.statusMessage = `게임이 종료 되었습니다 \`${this.winner.Name}\`이(가) 승리했습니다`;
        }
        else{
            this.statusMessage = `게임이 중단 되었습니다 \`${this.BlackPlayer.Name}\`과 \`${this.WhitePlayer.Name}\`이 비겼습니다`;
        }

        this.sendInfoMessages();
    }
}