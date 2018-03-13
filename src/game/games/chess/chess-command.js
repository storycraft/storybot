import { CommandListener } from 'storybot-core';

import ChessGame from './chess-game';
import RandomGenerator from '../../../util/random-generator';

export default class ChessCommand extends CommandListener {
    constructor(main){
        super();

        this.main = main;

        this.queueMap = new Map();
        this.queueUser = [];
        this.queueTimerMap = new Map();

        this.main.CommandManager.on('체스', this.onCommand.bind(this));
        this.main.CommandManager.on('chess', this.onCommand.bind(this));
    }

    get Description(){
        return '체스 두실 | *chess';
    }

    get Aliases(){
        return ['체스', 'chess'];
    }

    onCommand(args, user, bot, source){
        if(this.main.GameManager.isPlayingGame(user)){
            source.send('이미 다른 게임을 플레이 중입니다');
            return;
        }

        if (args.length == 1){
            var queueCode = args[0];

            if (this.queueMap.has(source) && this.queueMap.get(source)[queueCode]){
                var queue = this.queueMap.get(source)[queueCode];
                var waitingUser = queue.user;

                /*if (waitingUser == user){
                    source.send(`왜 자기 큐에 자기가 들어가려고 해요`);
                    return;
                }*/

                //큐에서 제거
                this.removeQueue(source, queue);

                let game = new ChessGame(source);

                game.WhitePlayer = user;
                game.BlackPlayer = waitingUser;

                source.send('사용 가능한 커맨드\n*move <위치> <위치2> : 해당 위치의 피스를 위치2로 이동합시다\n*game <args> : 게임 관련 커맨드');

                this.main.GameManager.addGame(game);
            }
            else{
                source.send(`대기 큐 ${queueCode} 를 찾을 수 없습니다`);
                return;
            }
        }
        else{
            if (this.isInQueue(user)){
                source.send(`이미 생성 된 큐가 존재합니다 큐가 제거된 후 다시 입력해주세요`);
                return;
            }
            
            let queueCode = this.addQueue(source, user, () => {
                source.send(`대기 큐 \`${queueCode}\`가 제거 되었습니다`);
            }, 60000);

            source.send(`대기 큐 \`${queueCode}\`가 생성되었습니다\n1 분내에 아무도 안 받을 경우 제거 됩니다\n참여 명령어: \`*chess ${queueCode}\``);
        }
    }

    isInQueue(user){
        return this.queueUser.includes(user);
    }

    addQueue(channel, user, onRemove, timeout){
        if (this.queueUser.includes(user))
            return;

        if (!this.queueMap.has(channel))
            this.queueMap.set(channel, {});

        var channelQueue = this.queueMap.get(channel);

        var queueCode = RandomGenerator.generate();

        var queue = channelQueue[queueCode] = {
            'user': user,
            'timestamp': new Date()
        };
        
        this.queueUser.push(user);

        this.queueTimerMap.set(queue, setTimeout(() => {
            this.removeQueue(channel, queue);

            if (typeof(onRemove) == 'function')
                onRemove();
        }, timeout || 60000));

        return queueCode;
    }

    removeQueue(channel, queue){
        if (!this.queueMap.has(channel))
            return;

        var channelQueue = this.queueMap.get(channel);

        for (let key in channelQueue){
            if (channelQueue[key] == queue){
                channelQueue[key] = null;
                break;
            }
        }

        this.queueUser.splice(this.queueUser.indexOf(queue.user), 1);

        clearTimeout(this.queueTimerMap.get(queue));
        this.queueTimerMap.delete(queue);
    }
}