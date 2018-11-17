import { StoryBot } from 'storybot-core';

import HelpMessage from "./info/help-message";
import DiveTemperature from "./info/dive-temperature";
import WeatherForecast from "./info/weather-forecast";
import NamuSearcher from './info/namu-searcher';

import GameManager from './game/game-manager';

import botSettings from './resources/bot-settings';

import ChessCommand from './game/games/chess/chess-command';
import SearchHelper from './info/search-helper';
import BalanceManager from './balance/balance-manager';
import EcmaRunner from './process/ecma-runner';
import ProcessManager from './process/process-manager';
import JavaRunner from './process/java-runner';
import LyricsCommand from './lyrics/lyrics-command';
import BalanceCommand from './balance/balance-command';
import ReactManager from './react/react-manager';
import UrlShortener from './url_shortener/url-shortener';
import CalculatorCommand from './math/calculator-command';
import PingCommand from './info/ping-command';
import SchoolLunch from './info/school/school-lunch';
import StoryChooser from './ai/trick/story-chooser';
import ChatlogCommand from './chat/chatlog-command';

export default class Main {
    constructor(){
        this.bot = new StoryBot();

        this.gameManager = new GameManager(this);
        this.balanceManager = new BalanceManager(this);

        this.processManager = new ProcessManager(this);

        this.reactManager = new ReactManager(this);
    }

    get Bot(){
        return this.bot;
    }

    get CommandManager(){
        return this.Bot.CommandManager;
    }

    get FirebaseManager(){
        return this.Bot.FirebaseManager;
    }

    get GameManager(){
        return this.gameManager;
    }

    get BalanceManager(){
        return this.balanceManager;
    }

    get ProcessManager(){
        return this.processManager;
    }

    get ReactManager(){
        return this.reactManager;
    }

    async start(){
        this.initCommand();

        await this.Bot.initialize(botSettings);
        
        this.Bot.SocketClient.registerClientId('4c3fa3fe-d5cb-41ba-be81-2919f9001d3c' , 'test');
        this.Bot.SocketClient.registerClientId('89db505b-c064-4595-aea4-d24a72426cfc' , 'kakao');

        this.Bot.DiscordClient.setUserName('Storybot');
        this.Bot.DiscordClient.setActivity('some Anime', { type: 'WATCHING' });

        console.log('Storybot이 시작 되었습니다');
    }

    initCommand(){
        var commandManager = this.CommandManager;

        commandManager.addCommandInfo(new HelpMessage(this));

        commandManager.addCommandInfo(new BalanceCommand(this));

        commandManager.addCommandInfo(new PingCommand(this));

        commandManager.addCommandInfo(new DiveTemperature(this));
        commandManager.addCommandInfo(new WeatherForecast(this));

        commandManager.addCommandInfo(new NamuSearcher(this));
        commandManager.addCommandInfo(new SearchHelper(this));

        commandManager.addCommandInfo(new ChessCommand(this));

        commandManager.addCommandInfo(new LyricsCommand(this));
        commandManager.addCommandInfo(new ChatlogCommand(this));

        //commandManager.addCommandInfo(new SchoolLunch(this));

        commandManager.addCommandInfo(this.ProcessManager);
        commandManager.addCommandInfo(new EcmaRunner(this));
        commandManager.addCommandInfo(new JavaRunner(this));
        commandManager.addCommandInfo(new StoryChooser(this));

        commandManager.addCommandInfo(new UrlShortener(this));
        commandManager.addCommandInfo(new CalculatorCommand(this));
    }
}

let main = new Main();
main.start();