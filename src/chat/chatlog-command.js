import { CommandListener } from "storybot-core";

export default class ChatlogCommand extends CommandListener {
    constructor(main){
        super();
        this.main = main;

        this.channelMap = new Map();

        this.main.CommandManager.on('chatlogs', this.onCommand.bind(this));

        this.main.Bot.on('message', this.collectMessage.bind(this));
    }

    get Description(){
        return '최근 채팅 로그를 보고 싶나요? | *chatlogs [채팅 수 (기본 = 10)]';
    }

    get Aliases(){
        return ['chatlogs'];
    }

    collectMessage(message) {
        if (this.channelMap.has(message.Source)) {
            var list = this.channelMap.get(message.Source);

            list.push(message);

            this.channelMap.set(message.Source, list.slice(-100));
        }
        else {
            this.channelMap.set(message.Source, [ message ]);
        }
    }

    getChatlogs(channel, count = 10) {
        if (!this.channelMap.has(channel))
            return [];

        let list = [];
        let messageList = this.channelMap.get(channel);
        let listLength = messageList.length;

        count = Math.min(listLength, count);

        for (let i = 0; i < count; i++) {
            let message = messageList[listLength - count + i];
            list.push(message.Timestamp.toGMTString() + ' | ' + message.User.Name + ' : ' + message.Text);
        }

        return list;
    }

    onCommand(args, user, bot, source){
        let count = 10;
        if (args.length > 0){
            try {
                count = parseInt(args[0]);
            } catch (e) {
                source.send('자연수로 써주세요 .-.');
                return;
            }
        }

        let logs = this.getChatlogs(source, count);

        source.send(`최근 채팅 ${logs.length} 개 목록`);
        source.send(logs.join('\n'));
    }
}