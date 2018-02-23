"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require("storybot-core");

var _helpMessage = require("./info/help-message");

var _helpMessage2 = _interopRequireDefault(_helpMessage);

var _diveTemperature = require("./info/dive-temperature");

var _diveTemperature2 = _interopRequireDefault(_diveTemperature);

var _weatherForecast = require("./info/weather-forecast");

var _weatherForecast2 = _interopRequireDefault(_weatherForecast);

var _botSettings = require("./resources/bot-settings");

var _botSettings2 = _interopRequireDefault(_botSettings);

var _storyReact = require("./react/story-react");

var _storyReact2 = _interopRequireDefault(_storyReact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Main {
    constructor() {
        this.bot = new _storybotCore.StoryBot();

        //테스트 명령어
        this.bot.on('message', msg => {
            console.log('> ' + msg.Source.Name + ' ' + msg.User.Name + ' ' + msg.Message);

            if (msg.Message == '스토링') msg.reply('네, 스토리에요!');
        });
    }

    get Bot() {
        return this.bot;
    }

    get CommandManager() {
        return this.Bot.CommandManager;
    }

    async start() {
        this.initCommand();
        this.initReact();

        await this.Bot.initialize(_botSettings2.default);

        console.log('Storybot이 시작 되었습니다');
    }

    initCommand() {
        var commandManager = this.CommandManager;

        commandManager.addCommandInfo(new _helpMessage2.default(this));

        commandManager.addCommandInfo(new _diveTemperature2.default(this));
        commandManager.addCommandInfo(new _weatherForecast2.default(this));
    }

    initReact() {
        new _storyReact2.default(this);
    }
}

exports.default = Main;
let main = new Main();
main.start();