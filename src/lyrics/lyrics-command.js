import { CommandListener } from 'storybot-core';

export default class LyricsCommand extends CommandListener {
    constructor(main){
        super();

        this.main = main;

        this.main.CommandManager.on('lyrics', this.onCommand.bind(this));
        this.main.CommandManager.on('lrc', this.onCommand.bind(this));
    }

    get Description(){
        return '머라고 말하는거야 | 사용법: *lrc <제목>';
    }

    get Aliases(){
        return ['lyrics', 'lrc'];
    }

    onCommand(args, user, bot, source){
        if (args.length < 1){
            source.send('사용법: *lrc <제목>');
            return;
        }

        if (args.length)
    }
}