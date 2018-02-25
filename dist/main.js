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

var _namuSearcher = require("./info/namu-searcher");

var _namuSearcher2 = _interopRequireDefault(_namuSearcher);

var _gameManager = require("./game/game-manager");

var _gameManager2 = _interopRequireDefault(_gameManager);

var _botSettings = require("./resources/bot-settings");

var _botSettings2 = _interopRequireDefault(_botSettings);

var _storyReact = require("./react/story-react");

var _storyReact2 = _interopRequireDefault(_storyReact);

var _chessCommand = require("./game/games/chess/chess-command");

var _chessCommand2 = _interopRequireDefault(_chessCommand);

var _searchHelper = require("./info/search-helper");

var _searchHelper2 = _interopRequireDefault(_searchHelper);

var _balanceManager = require("./balance/balance-manager");

var _balanceManager2 = _interopRequireDefault(_balanceManager);

var _ecmaRunner = require("./process/ecma-runner");

var _ecmaRunner2 = _interopRequireDefault(_ecmaRunner);

var _processManager = require("./process/process-manager");

var _processManager2 = _interopRequireDefault(_processManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Main {
    constructor() {
        this.bot = new _storybotCore.StoryBot();

        this.gameManager = new _gameManager2.default(this);
        this.balanceManager = new _balanceManager2.default(this);

        this.processManager = new _processManager2.default(this);

        //테스트 명령어
        this.bot.on('message', msg => {
            console.log('> ' + msg.Source.Name + ' ' + msg.User.Name + ' ' + msg.Text);

            if (msg.Text == '스토링') msg.reply('네, 스토리에요!');
        });
    }

    get Bot() {
        return this.bot;
    }

    get CommandManager() {
        return this.Bot.CommandManager;
    }

    get FirebaseManager() {
        return this.Bot.FirebaseManager;
    }

    get GameManager() {
        return this.gameManager;
    }

    get BalanceManager() {
        return this.balanceManager;
    }

    get ProcessManager() {
        return this.processManager;
    }

    async start() {
        this.initCommand();
        this.initReact();

        await this.Bot.initialize(_botSettings2.default);
        await this.balanceManager.init();

        console.log('Storybot이 시작 되었습니다');
    }

    initCommand() {
        var commandManager = this.CommandManager;

        commandManager.addCommandInfo(new _helpMessage2.default(this));

        commandManager.addCommandInfo(new _diveTemperature2.default(this));
        commandManager.addCommandInfo(new _weatherForecast2.default(this));

        commandManager.addCommandInfo(new _namuSearcher2.default(this));
        commandManager.addCommandInfo(new _searchHelper2.default(this));

        commandManager.addCommandInfo(new _chessCommand2.default(this));

        commandManager.addCommandInfo(this.ProcessManager);
        commandManager.addCommandInfo(new _ecmaRunner2.default(this));
    }

    initReact() {
        new _storyReact2.default(this);
    }
}

exports.default = Main;
let main = new Main();
main.start();