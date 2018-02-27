'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

class LyricsCommand extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.main.CommandManager.on('lyrics', this.onCommand.bind(this));
        this.main.CommandManager.on('lrc', this.onCommand.bind(this));
    }

    get Description() {
        return '머라고 말하는거야 | 사용법: *lrc <타이틀> [아티스트]';
    }

    get Aliases() {
        return ['lyrics', 'lrc'];
    }

    onCommand(args, user, bot, source) {}
}
exports.default = LyricsCommand;