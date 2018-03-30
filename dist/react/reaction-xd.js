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
        if (msg.Text == '스토링') {
            msg.reply('네, 스토리 에요!');
        } else if (msg.Text == '헷') {
            msg.reply('헷');
        } else if (msg.Text == 'ㅁㄴ') {
            msg.reply('ㅇㄹ');
        } else {}
    }
}
exports.default = ReactionXd;