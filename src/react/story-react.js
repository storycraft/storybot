const AUTO_REPLY_LIST = [
    '뭐',
    '왜'
] 

export default class StoryReact {
    constructor(main){
        this.main = main;

        this.main.Bot.on('message', this.onMessage.bind(this));

        this.statisticMap = new Map();
    }

    onMessage(message){
        if (!message.isMentioned(this.main.Bot))
            return;

        message.reply(AUTO_REPLY_LIST[Math.round(Math.random() * AUTO_REPLY_LIST.length)]);
    }
}