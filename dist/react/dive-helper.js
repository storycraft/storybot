'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _reactionPlugin = require('./reaction-plugin');

var _reactionPlugin2 = _interopRequireDefault(_reactionPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class DiveHelper extends _reactionPlugin2.default {
    constructor(manager) {
        super(manager);
    }

    onMessage(msg, chatDecoded) {
        if (chatDecoded.findMatchSentence([new RegExp('(비트코인|btc|이더리움|eth|리플|xrp|라이트코인|ltc)', 'i'), '시세', '얼마'])) msg.reply('*가즈아');
    }
}
exports.default = DiveHelper;