import ReactionPlugin from "./reaction-plugin";

export default class ReactionXd extends ReactionPlugin {
    constructor(manager){
        super(manager);
    }

    onMessage(msg, chatDecoded){
        if (msg.isMentioned(this.manager.Main.Bot)){
            msg.reply('네, 스토리 에요!');
        }
        else if (msg.Text == '헷'){
            msg.reply('헷');
        }
        else if (msg.Text.startsWith('ㅁㄴ')){
            let length = msg.Text.length;
            let count = 0;
            for (let i = 0; i < length; i+=2) {
                let c = msg.Text[i];
                let nextC = msg.Text[i + 1];

                if (c == 'ㅁ' && nextC == 'ㄴ')
                    count++;
                else
                    return;
            }

            var asdfMsg = '';
            while(count--) {
                asdfMsg += 'ㅇㄹ';
            }

            msg.reply(asdfMsg);
        }
    }
}