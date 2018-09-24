'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

class SchoolLunch extends _storybotCore.CommandListener {
    constructor(main) {
        super();
        this.main = main;

        //적절한 커맨드
        this.main.CommandManager.on('lunch', this.onCommand.bind(this));
    }

    get Description() {
        return '맛 없는 급식 | *lunch <학교명>';
    }

    get Aliases() {
        return ['lunch'];
    }

    static async getDailyLunch(schoolCode) {
        //SchoolInfoParser.MenuParser
    }

    onCommand(args, user, bot, source) {}
}
exports.default = SchoolLunch;