import { CommandListener } from "./command-manager";

export default class HelpMessage extends CommandListener {
    constructor(commandManager){
        super();

        this.commandManager = commandManager;

        this.commandManager.on('?', this.onCommand.bind(this));
        this.commandManager.on('help', this.onCommand.bind(this));
    }

    get Description(){
        return '? 도움말 보쉴';
    }

    get Aliases(){
        return ['?', 'help'];
    }

    onCommand(args, user, bot, source){
        var commandInfoList = this.commandManager.CommandInfoList;

        var infoMessage = '```\n {\n';

        for (let command of commandInfoList){
            let commands = command.Aliases.join(', ');
            let description = command.Description;

            infoMessage += `    "${commands}": "${description}",\n`;
        }

        infoMessage += '}\n```';

        source.send('Storybot 명령어 목록').then(() => {
            source.send(infoMessage);
        });
    }
}