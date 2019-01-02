import { CommandListener } from "storybot-core";
import RandomGenerator from "../util/random-generator";

export default class ChannelConnecter extends CommandListener {
    constructor(main){
        super();
        this.main = main;

        this.channelMap = new Map();

        this.queueMap = new Map();
        this.queueUser = [];
        this.queueTimerMap = new Map();

        this.main.CommandManager.on('connect', this.onCommand.bind(this));

        this.main.Bot.on('message', this.onMessage.bind(this));
    }

    get Description(){
        return '다른 채팅 채널과 연결 하기 | *connect [remove / 키]';
    }

    get Aliases(){
        return ['chatlogs'];
    }

    hasConnected(channel) {
        return this.channelMap.has(channel.IdentityId);
    }

    getConnected(channel) {
        return this.channelMap.get(channel.IdentityId);
    }

    connect(from, to) {
        this.channelMap.set(from.IdentityId, to);
    }

    removeConnected(channel) {
        return this.channelMap.delete(from.IdentityId);
    }

    onCommand(args, user, bot, source){
        if (args.length < 1) {
            if (this.isInQueue(user)){
                source.send(`이미 생성 된 키가 존재합니다 해당 키가 제거된 후 다시 입력해주세요`);
                return;
            }
            
            let queueCode = this.addQueue(source, user, () => {
                source.send(`키 \`${queueCode}\`가 제거 되었습니다`);
            }, 60000);

            source.send(`키 \`${queueCode}\`가 생성되었습니다\n키는 1분동안만 유효합니다\n연결할 채널에서 명령어를 사용해 이을 수 있습니다\n이전 연결된 채널과는 분리됩니다\n연결 명령어: \`*connect ${queueCode}\``);
        }
        else {
            let key = args[0];

            if (key == 'remove') {
                if (this.hasConnected(source)) {
                    var connected = this.getConnected(source);
                    this.removeConnected(source);

                    connected.send(`채널 ${source.Name} 과의 연동이 분리되었습니다`);
                    source.send(`채널 ${connected.Name} 과의 연동이 분리되었습니다`);
                }
                else {
                    source.send('아무 채널과도 연결되어있지 않습니다');
                }

                return;
            }

            if (this.queueMap.has(key)){
                var queue = this.queueMap.get(key);
                var from = queue.channel;

                if (from == source){
                    source.send(`같은 채널은 이을 수 없습니다`);
                    return;
                }

                this.removeQueue(key);

                this.connect(from, source);

                source.send(`채널 ${from.Name} 이 연결되었습니다`);
                from.send(`채널 ${source.Name} 에 연결했습니다`);
            }
            else {
                source.send(`키 \`${key}\` 를 찾을수 없습니다`);
            }
        }
    }

    onMessage(message) {
        if (this.hasConnected(message.Source)) {
            if (message.Text != '')
                this.getConnected(message.Source).send(`${message.User.Name}: ${message.Text}`);
        }
    }

    isInQueue(user) {
        return this.queueUser.includes(user);
    }

    addQueue(channel, user, onRemove, timeout) {
        if (this.queueUser.includes(user))
            return;

        var queueCode = RandomGenerator.generate();

        var queue = {
            'user': user,
            'channel': channel,
            'timestamp': new Date()
        };

        this.queueMap.set(queueCode, queue);
        
        this.queueUser.push(user);

        this.queueTimerMap.set(queue, setTimeout(() => {
            this.removeQueue(queueCode);

            if (typeof(onRemove) == 'function')
                onRemove();
        }, timeout || 60000));

        return queueCode;
    }

    removeQueue(queueCode){
        if (!this.queueMap.has(queueCode))
            return;

        let queue = this.queueMap.get(queueCode);

        this.queueMap.delete(queueCode);

        this.queueUser.splice(this.queueUser.indexOf(queue.user), 1);

        clearTimeout(this.queueTimerMap.get(queue));
        this.queueTimerMap.delete(queue);
    }

}