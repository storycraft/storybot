import ReactionPlugin from "./reaction-plugin";

export default class DiveHelper extends ReactionPlugin {
    constructor(manager){
        super(manager);
    }

    onMessage(msg, chatDecoded){
        if (chatDecoded.findMatchSentence([new RegExp('(비트코인|btc|이더리움|eth|리플|xrp|라이트코인|ltc)', 'i'), '시세', '얼마']))
            msg.reply('*가즈아');
    }
}