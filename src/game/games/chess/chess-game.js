import Game from '../../game';

import fs from 'fs';
import { MessageTemplate, MessageAttachment } from 'storybot-core';

import ChessBoard from './chess-board';
import BoardRenderer from './board-renderer';

import BoardMathHelper from './board-math-helper';

export default class ChessGame extends Game {
    constructor(playChannel){
        super(playChannel);

        this.gameboard = new ChessBoard(this);
        this.boardRenderer = new BoardRenderer(this.gameboard);

        this.currentTurn = 0;

        this.statusMessage = '';

        this.commandBind = this.onMoveCommand.bind(this);
    }

    get BlackPlayer(){
        return this.PlayerList[0];
    }

    get WhitePlayer(){
        return this.PlayerList[1];
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

    setNextTurn(){
        return this.currentTurn = (this.currentTurn ? 0/*Black*/ : 1/*White*/);
    }

    get CurrentPlayer(){
        return this.PlayerList[this.CurrentTurn];
    }

    get StatusMessage(){
        return this.statusMessage;
    }

    get FirebaseDbRef(){
        if (this.gameManager)
            return this.gameManager.FirebaseGameDb.child('chess');
        
        return null;
    }

    async getPlayerStat(player){
        var firebaseDbRef = this.FirebaseDbRef;

        var data = {
            'win': 0,
            'lose': 0,
            'draw': 0
        }

        if (firebaseDbRef){
            var snapshotData = await FirebaseDbRef.child(player.Id).once('value');

            if (snapshotData.exists()){
                data['win'] = snapshotData.child('win').val();
                data['lose'] = snapshotData.child('lose').val();
                data['draw'] = snapshotData.child('draw').val();
            }
        }

        return data;
    }

    async updatePlayerStat(player, win, lose, draw){
        FirebaseDbRef.child(player.Id).set({
            'win': win,
            'lose': lose,
            'draw': draw
        });
    }

    start(gameManager){
        if (this.PlayerList.length != 2)
            throw new Error('플레이어 수는 2명이어야 합니다');

        super.start(gameManager);

        this.statusMessage = `\`${this.BlackPlayer.Name}\`와 \`${this.WhitePlayer.Name}\`의 체스가 시작 되었습니다`;

        this.gameManager.Main.CommandManager.on('move', this.commandBind);

        this.sendInfoMessages();
    }

    onMoveCommand(args, user, bot, source){
        if (source != this.PlayChannel || !this.PlayerList.includes(user))
            return;

        if (this.CurrentPlayer != user){
            source.send('님 차례 아닌데요?');
            return;
        }
        else if (args.length != 2){
            source.send('사용법: *move <말의 위치> <이동 할 위치>\nEx) *move a1 a3');
            return;
        }

        try{
            var firstX = Math.abs(args[0][0].toLowerCase().charCodeAt(0) - 97/*소문자 a 키 코드*/);//입력된 문자에서 a 키 코드 값을 빼서 위치를 구함
            var firstY = Number.parseInt(args[0][1]) - 1;//배열은 0부터 시작하니 1씩 빼줍시다
            
            var secX = Math.abs(args[1][0].toLowerCase().charCodeAt(0) - 97);
            var secY = Number.parseInt(args[1][1]) - 1;

            if (firstX > 7 || firstY > 7 || secX > 7 || secY > 7)
                throw new Error('숫자의 범위가 잘못 되었습니다 허용 범위 (1 ~ 8)');

            var piece = this.gameboard.getPieceAt(BoardMathHelper.getCombinedLocation(firstX, firstY));

            if (!piece){
                source.send('거기 아무 말도 없는데요');
                return;
            }

            if (this.CurrentTurn == 0 && this.gameboard.WhitePieces.includes(piece)
                || this.CurrentTurn == 1 && this.gameboard.BlackPieces.includes(piece)){
                    source.send('그거 님 체스 말 아니자나요 ㅡㅡ');
                    return;
                }

            var combinedMovePos = BoardMathHelper.getCombinedLocation(secX, secY);
            if (piece.canMoveTo(this.gameboard, combinedMovePos)){
                this.gameboard.movePieceTo(piece, combinedMovePos);

                this.setNextTurn();

                this.statusMessage = `\`${user.Name}\`의 차례입니다`;
                this.sendInfoMessages();
            }
            else{
                source.send('그 말은 거기로 못 움직임');
            }

        } catch(e){
            source.send('올바른 형식으로 입력해 주세요\nEx) *move a1 a3');
            return;
        }
    }

    async sendInfoMessages(){
        try{
            await this.boardRenderer.init();
        
            var messageTemplate = new MessageTemplate(this.statusMessage, [ new MessageAttachment('chess-board.png', await this.boardRenderer.render()) ]);

            this.PlayChannel.send(messageTemplate);
        } catch (e){
            this.PlayChannel.send(`작업 진행중 오류가 발생했습니다\n${e}`);
        }
    }

    stop(){
        super.stop();

        this.gameManager.Main.CommandManager.removeListener('move', this.commandBind);

        var winner = null;
        if (this.gameboard.BlackKingDied && !this.gameboard.WhiteKingDead){
            winner = this.WhitePlayer;
        }
        else if (this.gameboard.WhiteKingDead && !this.gameboard.BlackKingDied){
            winner = this.BlackPlayer;
        }

        if (winner){
            this.statusMessage = `게임이 종료 되었습니다 \`${winner.Name}\`이(가) 승리했습니다`;
        }
        else{
            this.statusMessage = `게임이 중단 되었습니다 \`${this.BlackPlayer.Name}\`과 \`${this.WhitePlayer.Name}\`이 비겼습니다`;
        }
    }
}