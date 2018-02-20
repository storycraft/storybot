'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require('events');

const COMMAND_PREFIX = '!';

class CommandManager extends _events.EventEmitter {
    constructor(main) {
        super();

        this.main = main;

        this.Bot.on('message', this.onCommand.bind(this));
    }

    get Main() {
        return this.main;
    }

    get Bot() {
        return this.Main.Bot;
    }

    onCommand(msg) {
        if (!msg.Message.startsWith(COMMAND_PREFIX)) return;

        var tokens = msg.Message.split(' ');

        var command = tokens[0].substring(1);
        var args = tokens.slice(1);

        if (command == '') return;

        //WTF best idea ever
        this.emit(command, args, msg.User, this.Bot, msg.Source);
    }
}
exports.default = CommandManager;