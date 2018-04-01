import { CommandListener } from 'storybot-core';

export default class HelpMessage extends CommandListener {
    constructor(main){
        super();

        this.main = main;

        this.main.CommandManager.on('?', this.onCommand.bind(this));
        this.main.CommandManager.on('help', this.onCommand.bind(this));
        this.main.CommandManager.on('도움말', this.onCommand.bind(this));
    }

    get Description(){
        return '? 도움말 보쉴';
    }

    get Aliases(){
        return ['?', 'help', '도움말'];
    }

    onCommand(args, user, bot, source){
        var commandInfoList = this.main.CommandManager.CommandInfoList;

        var infoMessage = '```json\n{\n';

        for (let command of commandInfoList){
            let commands = command.Aliases.join(', ');
            let description = command.Description;

            infoMessage += `    "${commands}": "${description}",\n`;
        }

        infoMessage += '}\n```';

        source.send('Storybot이 가능한 짓 거리 목록\n 커맨드 접두사: ' + this.main.CommandManager.CommandPrefix).then(() => {
            source.send(infoMessage);
        });
    }
}