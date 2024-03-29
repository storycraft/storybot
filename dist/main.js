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

var _javaRunner = require("./process/java-runner");

var _javaRunner2 = _interopRequireDefault(_javaRunner);

var _lyricsCommand = require("./lyrics/lyrics-command");

var _lyricsCommand2 = _interopRequireDefault(_lyricsCommand);

var _balanceCommand = require("./balance/balance-command");

var _balanceCommand2 = _interopRequireDefault(_balanceCommand);

var _reactManager = require("./react/react-manager");

var _reactManager2 = _interopRequireDefault(_reactManager);

var _urlShortener = require("./url_shortener/url-shortener");

var _urlShortener2 = _interopRequireDefault(_urlShortener);

var _calculatorCommand = require("./math/calculator-command");

var _calculatorCommand2 = _interopRequireDefault(_calculatorCommand);

var _pingCommand = require("./info/ping-command");

var _pingCommand2 = _interopRequireDefault(_pingCommand);

var _schoolLunch = require("./info/school/school-lunch");

var _schoolLunch2 = _interopRequireDefault(_schoolLunch);

var _storyChooser = require("./ai/trick/story-chooser");

var _storyChooser2 = _interopRequireDefault(_storyChooser);

var _chatlogCommand = require("./chat/chatlog-command");

var _chatlogCommand2 = _interopRequireDefault(_chatlogCommand);

var _botInfoCommand = require("./info/bot-info-command");

var _botInfoCommand2 = _interopRequireDefault(_botInfoCommand);

var _sayCommand = require("./chat/say-command");

var _sayCommand2 = _interopRequireDefault(_sayCommand);

var _channelConnecter = require("./channel/channel-connecter");

var _channelConnecter2 = _interopRequireDefault(_channelConnecter);

var _pythonRunner = require("./process/python-runner");

var _pythonRunner2 = _interopRequireDefault(_pythonRunner);

var _rollCommand = require("./misc/roll-command");

var _rollCommand2 = _interopRequireDefault(_rollCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Main {
        constructor() {
                this.bot = new _storybotCore.StoryBot();

                this.gameManager = new _gameManager2.default(this);
                this.balanceManager = new _balanceManager2.default(this);

                this.processManager = new _processManager2.default(this);

                this.reactManager = new _reactManager2.default(this);
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

        get ReactManager() {
                return this.reactManager;
        }

        async start() {
                this.initCommand();

                await this.Bot.initialize(_botSettings2.default);

                this.Bot.SocketClient.registerClientId('4c3fa3fe-d5cb-41ba-be81-2919f9001d3c', 'test');
                this.Bot.SocketClient.registerClientId('89db505b-c064-4595-aea4-d24a72426cfc', 'kakao');
                this.Bot.SocketClient.registerClientId('7ff28c64-cce6-4ac8-8592-e3f9d7828c79', 'minecraft-server');

                this.Bot.DiscordClient.setUserName('Storybot');
                this.Bot.DiscordClient.setActivity('some Anime', { type: 'WATCHING' });

                console.log('Storybot이 시작 되었습니다');
        }

        initCommand() {
                var commandManager = this.CommandManager;

                commandManager.addCommandInfo(new _helpMessage2.default(this));

                //commandManager.addCommandInfo(new BalanceCommand(this));

                commandManager.addCommandInfo(new _pingCommand2.default(this));

                commandManager.addCommandInfo(new _diveTemperature2.default(this));
                commandManager.addCommandInfo(new _weatherForecast2.default(this));

                commandManager.addCommandInfo(new _sayCommand2.default(this));

                commandManager.addCommandInfo(new _botInfoCommand2.default(this));

                commandManager.addCommandInfo(new _channelConnecter2.default(this));

                commandManager.addCommandInfo(new _namuSearcher2.default(this));
                commandManager.addCommandInfo(new _searchHelper2.default(this));

                //commandManager.addCommandInfo(new ChessCommand(this));

                //commandManager.addCommandInfo(new LyricsCommand(this));
                commandManager.addCommandInfo(new _chatlogCommand2.default(this));

                //commandManager.addCommandInfo(new SchoolLunch(this));

                commandManager.addCommandInfo(this.ProcessManager);

                commandManager.addCommandInfo(new _ecmaRunner2.default(this));
                commandManager.addCommandInfo(new _javaRunner2.default(this));
                commandManager.addCommandInfo(new _pythonRunner2.default(this));

                commandManager.addCommandInfo(new _rollCommand2.default(this));
                commandManager.addCommandInfo(new _storyChooser2.default(this));

                commandManager.addCommandInfo(new _urlShortener2.default(this));
                commandManager.addCommandInfo(new _calculatorCommand2.default(this));
        }
}

exports.default = Main;
let main = new Main();
main.start();