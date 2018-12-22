import { CommandListener } from 'storybot-core';

export default class SayCommand extends CommandListener {
    constructor(main){
        super();

        this.main = main;

        this.main.CommandManager.on('say', this.onCommand.bind(this));
    }

    get Description(){
        return '~ | *say <메세지>';
    }

    get Aliases(){
        return ['say'];
    }

    onCommand(args, user, bot, source){
        if (args.length < 1) {
            source.send('ㅁㄴ?');
            return;
        }
        
        source.send(args.join(' '));
    }
}