import { CommandListener, RequestHelper } from 'storybot-core';

/* 
 * High level AI selects for you 
 */
export default class StoryChooser extends CommandListener {
    constructor(main){
        super();
        this.main = main;
    }

    get Description(){
        return '스토리봇이 대신 골라줘요 | *choose <word> <word>';
    }

    get Aliases(){
        return ['choose'];
    }

    onCommand(args, user, bot, source){
        if (args.length < 1) {
            source.send('뭘 고르라는 거야');
            return;
        }
        
        let selected = args[Math.floor(Math.min(Math.random() * args.length, args.length - 1))];
        source.send(`-> \`${selected}\``);
    }
}