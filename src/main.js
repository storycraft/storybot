import Storybot from 'storybot-core';

import CommandManager from './command/command-manager.js';
import botSettings from './resources/bot-settings';
import DiveTemperature from './command/dive-temperature.js';

export default class Main {
    constructor(){
        this.bot = new Storybot();

        this.commandManager = new CommandManager(this);

        //테스트 명령어
        this.bot.on('message', (msg) => {
            console.log('> ' + msg.Source.Name + ' ' + msg.User.Name + ' ' + msg.Message);

            if (msg.Message == '스토링')
                msg.reply('스토리에요!');
        });
    }

    get Bot(){
        return this.bot;
    }

    get CommandManager(){
        return this.commandManager;
    }

    async start(){
        await this.Bot.initialize(botSettings);

        this.addCommands();

        console.log('Storybot이 시작 되었습니다');
    }
}

let main = new Main();
main.start();