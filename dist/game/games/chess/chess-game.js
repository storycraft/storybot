'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _game = require('../../game');

var _game2 = _interopRequireDefault(_game);

var _storybotCore = require('storybot-core');

var _chessBoard = require('./chess-board');

var _chessBoard2 = _interopRequireDefault(_chessBoard);

var _boardRenderer = require('./board-renderer');

var _boardRenderer2 = _interopRequireDefault(_boardRenderer);

var _boardMathHelper = require('./board-math-helper');

var _boardMathHelper2 = _interopRequireDefault(_boardMathHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChessGame extends _game2.default {
    constructor(playChannel) {
        super(playChannel);

        this.gameboard = new _chessBoard2.default(this);
        this.boardRenderer = new _boardRenderer2.default(this.gameboard);

        this.currentTurn = 0;

        this.winner = null;

        this.statusMessage = '';

        this.gameCommandBind = this.onGameCommand.bind(this);
        this.moveCommandBind = this.onMoveCommand.bind(this);
    }

    get BlackPlayer() {
        return this.PlayerList[0];
    }

    get WhitePlayer() {
        return this.PlayerList[1];
    }

    get Winner() {
        return this.winner;
    }

    set BlackPlayer(user) {
        this.PlayerList[0] = user;
    }

    set WhitePlayer(user) {
        this.PlayerList[1] = user;
    }

    get CurrentTurn() {
        return this.currentTurn;
    }

    get CurrentPlayer() {
        return this.PlayerList[this.CurrentTurn];
    }

    get StatusMessage() {
        return this.statusMessage;
    }

    get FirebaseDbRef() {
        if (this.gameManager) return this.gameManager.FirebaseGameDb.child('chess');

        return null;
    }

    async getPlayerStat(player) {
        var firebaseDbRef = this.FirebaseDbRef;

        var data = {
            'win': 0,
            'lose': 0,
            'draw': 0
        };

        if (firebaseDbRef) {
            var snapshotData = await FirebaseDbRef.child(player.Id).once('value');

            if (snapshotData.exists()) {
                data['win'] = snapshotData.child('win').val();
                data['lose'] = snapshotData.child('lose').val();
                data['draw'] = snapshotData.child('draw').val();
            }
        }

        return data;
    }

    async updatePlayerStat(player, win, lose, draw) {
        FirebaseDbRef.child(player.Id).set({
            'win': win,
            'lose': lose,
            'draw': draw
        });
    }

    start(gameManager) {
        if (this.PlayerList.length != 2) throw new Error('플레이어 수는 2명이어야 합니다');

        super.start(gameManager);

        this.statusMessage = `\`${this.BlackPlayer.Name}\`와 \`${this.WhitePlayer.Name}\`의 체스가 시작 되었습니다`;

        this.gameManager.Main.CommandManager.on('game', this.gameCommandBind);
        this.gameManager.Main.CommandManager.on('move', this.moveCommandBind);

        this.sendInfoMessages();
    }

    setNextTurn() {
        return this.currentTurn = this.currentTurn == 1 ? 0 /*Black*/ : 1 /*White*/;
    }

    onMoveCommand(args, user, bot, source) {
        if (source != this.PlayChannel || !this.PlayerList.includes(user)) return;

        if (this.CurrentPlayer != user) {
            source.send('님 차례 아닌데요?');
            return;
        } else if (args.length != 2) {
            source.send('사용법: *move <말의 위치> <이동 할 위치>\nEx) *move a1 a3');
            return;
        }

        try {
            var firstX = args[0][0].toLowerCase().charCodeAt(0) - 97; /*소문자 a 키 코드 입력된 문자에서 a 키 코드 값을 빼서 위치를 구함*/
            var firstY = Number.parseInt(args[0][1]) - 1; //배열은 0부터 시작하니 1씩 빼줍시다

            var secX = args[1][0].toLowerCase().charCodeAt(0) - 97;
            var secY = Number.parseInt(args[1][1]) - 1;

            if (firstX > 7 || firstY > 7 || secX > 7 || secY > 7 || firstX < 0 || firstY < 0 || secX < 0 || secY < 0) throw new Error('숫자의 범위가 잘못 되었습니다 허용 범위 (1 ~ 8)');

            var piece = this.gameboard.getPieceAt(_boardMathHelper2.default.getCombinedLocation(firstX, firstY));

            if (!piece) {
                source.send('거기 아무 말도 없는데요');
                return;
            }

            if (this.CurrentTurn == 0 && this.gameboard.WhitePieces.includes(piece) || this.CurrentTurn == 1 && this.gameboard.BlackPieces.includes(piece)) {
                source.send('그거 님 체스 말 아니자나요 ㅡㅡ');
                return;
            }

            var combinedMovePos = _boardMathHelper2.default.getCombinedLocation(secX, secY);
            if (piece.canMoveTo(combinedMovePos)) {
                this.gameboard.movePieceTo(piece, combinedMovePos);

                if (!this.gameboard.IsGameOver) {
                    this.setNextTurn();

                    this.statusMessage = `\`${this.CurrentPlayer.Name}\`의 차례입니다`;

                    this.sendInfoMessages();
                } else {
                    if (this.gameboard.WhiteKingDead) this.winner = this.BlackPlayer;else if (this.gameboard.BlackKingDied) this.winner = this.WhitePlayer;

                    this.stop();
                }
            } else {
                source.send('그 말은 거기로 움직일 수 없습니다');
            }
        } catch (e) {
            source.send('올바른 형식으로 입력해 주세요\nEx) *move a1 a3');
            return;
        }
    }

    onGameCommand(args, user, bot, source) {
        if (source != this.PlayChannel || !this.PlayerList.includes(user)) return;

        if (args.length < 1) args.push('');

        switch (args[0]) {

            case 'disclaim':
                source.send(`\`${user.Name}\`이(가) 기권을 선언했습니다`);

                if (user == this.WhitePlayer) {
                    this.winner = this.BlackPlayer;
                } else if (user == this.BlackPlayer) {
                    this.winner = this.WhitePlayer;
                }

                this.stop();
                break;

            default:
                source.send('사용 가능한 명령어 (플레이어만 사용 가능)\n disclaim: 기권 선언');
                break;
        }
    }

    async sendInfoMessages() {
        try {
            await this.boardRenderer.init();

            var messageTemplate = new _storybotCore.MessageTemplate(this.statusMessage, [new _storybotCore.MessageAttachment('chess-board.png', (await this.boardRenderer.render()))]);

            await this.PlayChannel.send(messageTemplate);
            await this.PlayChannel.send(`[B] ${this.BlackPlayer.Name} vs [W] ${this.WhitePlayer.Name}`);
        } catch (e) {
            await this.PlayChannel.send(`작업 진행중 오류가 발생했습니다\n${e}`);
        }
    }

    stop() {
        super.stop();

        this.gameManager.Main.CommandManager.removeListener('game', this.gameCommandBind);
        this.gameManager.Main.CommandManager.removeListener('move', this.moveCommandBind);

        if (this.winner) {
            this.statusMessage = `게임이 종료 되었습니다 \`${this.winner.Name}\`이(가) 승리했습니다`;
        } else {
            this.statusMessage = `게임이 중단 되었습니다 \`${this.BlackPlayer.Name}\`과 \`${this.WhitePlayer.Name}\`이 비겼습니다`;
        }

        this.sendInfoMessages();
    }
}
exports.default = ChessGame;