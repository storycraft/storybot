'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactionPlugin = require('./reaction-plugin');

var _reactionPlugin2 = _interopRequireDefault(_reactionPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ReactionXd extends _reactionPlugin2.default {
    constructor(manager) {
        super(manager);
    }

    onMessage(msg, chatDecoded) {
        if (msg.isMentioned(this.manager.Main.Bot)) {
            msg.reply('네, 스토리 에요!');
        } else if (msg.Text == '헷') {
            msg.reply('헷');
        } else if (msg.Text.startsWith('ㅁㄴ')) {
            let length = msg.Text.length;
            let count = 0;
            for (let i = 0; i < length; i += 2) {
                let c = msg.Text[i];
                let nextC = msg.Text[i + 1];

                if (c == 'ㅁ' && nextC == 'ㄴ') count++;else return;
            }

            var asdfMsg = '';
            while (count--) {
                asdfMsg += 'ㅇㄹ';
            }

            msg.reply(asdfMsg);
        }
    }
}
exports.default = ReactionXd;