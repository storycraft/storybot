'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

class ProgramRunner extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.first = true;
    }

    get Description() {
        return '';
    }

    get Aliases() {
        return [];
    }

    async run(source, channel) {}

    onCommand(args, user, bot, channel) {}
}
exports.default = ProgramRunner;