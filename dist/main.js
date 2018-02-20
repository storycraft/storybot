'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

var _storybotCore2 = _interopRequireDefault(_storybotCore);

var _commandManager = require('./command/command-manager.js');

var _commandManager2 = _interopRequireDefault(_commandManager);

var _botSettings = require('./resources/bot-settings');

var _botSettings2 = _interopRequireDefault(_botSettings);

var _diveTemperature = require('./command/dive-temperature/dive-temperature.js');

var _diveTemperature2 = _interopRequireDefault(_diveTemperature);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Main {
    constructor() {
        this.bot = new _storybotCore2.default();

        this.commandManager = new _commandManager2.default(this);

        //테스트 명령어
        this.bot.on('message', msg => {
            console.log('> ' + msg.Source.Name + ' ' + msg.User.Name + ' ' + msg.Message);

            if (msg.Message == '스토링') msg.reply('스토리에요!');
        });
    }

    get Bot() {
        return this.bot;
    }

    get CommandManager() {
        return this.commandManager;
    }

    async start() {
        await this.Bot.initialize(_botSettings2.default);

        this.addCommands();

        console.log('Storybot이 시작 되었습니다');
    }

    addCommands() {
        new _diveTemperature2.default(this);
    }
}

exports.default = Main;
let main = new Main();
main.start();