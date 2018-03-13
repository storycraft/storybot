'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactionPlugin = require('./reaction-plugin');

var _reactionPlugin2 = _interopRequireDefault(_reactionPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Storing extends _reactionPlugin2.default {
    constructor(manager) {
        super(manager);
    }

    onMessage(msg) {
        if (msg.Text == '스토링') {
            msg.reply('네, 스토리 에요!');
        } else if (msg.Text == '헷') {
            msg.reply('헷');
        }
    }
}
exports.default = Storing;