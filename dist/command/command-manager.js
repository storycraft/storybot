"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _events = require("events");

var _helpMessage = require("../info/help-message");

var _helpMessage2 = _interopRequireDefault(_helpMessage);

var _diveTemperature = require("../info/dive-temperature");

var _diveTemperature2 = _interopRequireDefault(_diveTemperature);

var _weatherForecast = require("../info/weather-forecast");

var _weatherForecast2 = _interopRequireDefault(_weatherForecast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const COMMAND_PREFIX = '*';

class CommandManager extends _events.EventEmitter {
    constructor(main) {
        super();

        this.main = main;

        this.commandInfoList = [];

        this.Bot.on('message', this.onCommand.bind(this));

        this.initCommands();
    }

    get Main() {
        return this.main;
    }

    get Bot() {
        return this.Main.Bot;
    }

    get CommandInfoList() {
        return this.commandInfoList;
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

    addCommandInfo(command) {
        this.CommandInfoList.push(command);
    }

    removeCommandInfo(command) {
        this.CommandInfoList.splice(this.CommandInfoList.indexOf(command), 1);
    }

    initCommands() {
        this.addCommandInfo(new _helpMessage2.default(this));

        this.addCommandInfo(new _diveTemperature2.default(this));
        this.addCommandInfo(new _weatherForecast2.default(this));
    }
}
exports.default = CommandManager;