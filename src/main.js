import { StoryBot } from 'storybot-core';

import HelpMessage from "./info/help-message";
import DiveTemperature from "./info/dive-temperature";
import WeatherForecast from "./info/weather-forecast";

import botSettings from './resources/bot-settings';
import StoryReact from './react/story-react';
import NamuSearcher from './info/namu-searcher';

export default class Main {
    constructor(){
        this.bot = new StoryBot();

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
    }

    initReact(){
        new StoryReact(this);
    }
}

let main = new Main();
main.start();