"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storing = require("./storing");

var _storing2 = _interopRequireDefault(_storing);

var _storybotCore = require("storybot-core");

var _chatDecoder = require("./chat-decoder");

var _chatDecoder2 = _interopRequireDefault(_chatDecoder);

var _reactionXd = require("./reaction-xd");

var _reactionXd2 = _interopRequireDefault(_reactionXd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ReactManager {
    constructor(main) {
        this.main = main;

        this.reacts = [];

        this.init();

        this.Main.Bot.on('message', this.onMessage.bind(this));
    }

    get Main() {
        return this.main;
    }

    get Reacts() {
        return this.reacts;
    }

    addReact(reactionPlugin) {
        this.reacts.push(reactionPlugin);
    }

    init() {
        this.addReact(new _reactionXd2.default(this));
    }

    onMessage(msg) {
        if (msg.User instanceof _storybotCore.ClientUser) return;

        this.reacts.forEach(reactionPlugin => reactionPlugin.onMessage(msg, _chatDecoder2.default.decode(msg.Text)));
    }
}
exports.default = ReactManager;