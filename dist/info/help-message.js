'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

class HelpMessage extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;
    }

    get Description() {
        return '? 도움말 보쉴';
    }

    get Aliases() {
        return ['?', 'help', '도움말'];
    }

    onCommand(args, user, bot, source) {
        var commandInfoList = this.main.CommandManager.CommandInfoList;

        var prefixMessage = 'Storybot이 가능한 짓 거리 목록\n 커맨드 접두사: ' + this.main.CommandManager.CommandPrefix + '\n\n```';
        var suffixMessage = '\n```';
        var infoMessage = '';

        for (let command of commandInfoList) {
            let commands = command.Aliases.join(', ');
            let description = command.Description;

            infoMessage += `${commands} > ${description}\n`;
        }

        source.send(prefixMessage + infoMessage + suffixMessage);
    }
}
exports.default = HelpMessage;