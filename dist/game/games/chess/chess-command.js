'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

var _chessGame = require('./chess-game');

var _chessGame2 = _interopRequireDefault(_chessGame);

var _randomGenerator = require('../../../util/random-generator');

var _randomGenerator2 = _interopRequireDefault(_randomGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ChessCommand extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.queueMap = new Map();
        this.queueUser = [];

        this.main.CommandManager.on('체스', this.onCommand.bind(this));
        this.main.CommandManager.on('chess', this.onCommand.bind(this));
    }

    get Description() {
        return '체스 두실 | 사용법 : *chess';
    }

    get Aliases() {
        return ['체스', 'chess'];
    }

    onCommand(args, user, bot, source) {
        if (this.main.GameManager.isPlayingGame(user)) {
            source.send('하고 있는 게임 끝내고 다시 입력해 주세요');
            return;
        }

        if (args.length == 1) {
            var queueCode = args[0];

            if (this.queueMap.has(source) && this.queueMap.get(source)[queueCode]) {
                var waitingUser = this.queueMap.get(source)[queueCode].user;

                /*if (waitingUser == user){
                    source.send(`왜 자기 큐에 자기가 들어가려고 해요`);
                    return;
                }*/

                //큐에서 제거
                this.removeQueue(source, waitingUser);

                let game = new _chessGame2.default(source);

                game.WhitePlayer = waitingUser;
                game.BlackPlayer = user;

                this.main.GameManager.addGame(game);
            } else {
                source.send(`대기 큐 ${queueCode} 를 찾을 수 없습니다`);
                return;
            }
        } else {
            if (this.isInQueue(user)) {
                source.send(`이미 큐 하나 만들어 놓고 뭘 더 만들어요`);
                return;
            }

            let queueCode = this.addQueue(source, user);

            source.send(`대기 큐 \`${queueCode}\`이 생성되었습니다\n1 분내에 아무도 안 받을 경우 제거 됩니다\n참여 명령어: \`*chess ${queueCode}\``);
        }
    }

    isInQueue(user) {
        return this.queueUser.includes(user);
    }

    addQueue(channel, user) {
        if (this.queueUser.includes(user)) return;

        if (!this.queueMap.has(channel)) this.queueMap.set(channel, {});

        var channelQueue = this.queueMap.get(channel);

        var queueCode = _randomGenerator2.default.generate();

        channelQueue[queueCode] = {
            'user': user,
            'timestamp': new Date()
        };

        this.queueUser.push(user);

        return queueCode;
    }

    removeQueue(channel, user) {
        if (!this.queueUser.includes(user) || !this.queueMap.has(channel)) return;

        var channelQueue = this.queueMap.get(channel);

        for (let key in channelQueue) {
            if (channelQueue[key]['user'] == user) {
                channelQueue[key] = null;
                break;
            }
        }

        this.queueUser.splice(this.queueUser.indexOf(user));
    }
}
exports.default = ChessCommand;