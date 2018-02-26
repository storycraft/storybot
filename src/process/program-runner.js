import { CommandListener } from 'storybot-core';

export default class ProgramRunner extends CommandListener { 
    constructor(main){
        super();

        this.main = main;

        this.first = true;
    }

    get Description(){
        return '';
    }

    get Aliases(){
        return [];
    }
    
    async run(source, channel){

    }

    onCommand(args, user, bot, channel){

    }
}