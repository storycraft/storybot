import { StoryBot } from 'storybot-core';

import HelpMessage from "./info/help-message";
import DiveTemperature from "./info/dive-temperature";
import WeatherForecast from "./info/weather-forecast";
import NamuSearcher from './info/namu-searcher';

import GameManager from './game/game-manager';

import botSettings from './resources/bot-settings';

import StoryReact from './react/story-react';
import ChessCommand from './game/games/chess-command';
import SearchHelper from './info/search-helper';

export default class Main {
    constructor(){
        this.bot = new StoryBot();

        this.gameManager = new GameManager(this);

        //테스트 명령어
        this.bot.on('message', (msg) => {
            console.log('> ' + msg.Source.Name + ' ' + msg.User.Name + ' ' + msg.Message);

            if (msg.Message == '스토링')
                msg.reply('네, 스토리에요!');
        });
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

    async start(){
        this.initCommand();
        this.initReact();

        await this.Bot.initialize(botSettings);

        console.log('Storybot이 시작 되었습니다');
    }

    initCommand(){
        var commandManager = this.CommandManager;

        commandManager.addCommandInfo(new HelpMessage(this));

        commandManager.addCommandInfo(new DiveTemperature(this));
        commandManager.addCommandInfo(new WeatherForecast(this));

        commandManager.addCommandInfo(new NamuSearcher(this));
        commandManager.addCommandInfo(new SearchHelper(this));

        commandManager.addCommandInfo(new ChessCommand(this));
    }

    initReact(){
        new StoryReact(this);
    }
}

let main = new Main();
main.start();