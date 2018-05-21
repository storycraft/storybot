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
        else if (msg.Text == 'ㅁㄴ'){
            msg.reply('ㅇㄹ');
        }
        else{

        }
    }
}