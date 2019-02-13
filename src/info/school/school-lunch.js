import { CommandListener } from 'storybot-core';

export default class SchoolLunch extends CommandListener {
    constructor(main){
        super();
        this.main = main;
    }

    get Description(){
        return '맛 없는 급식 | *lunch <학교명>';
    }

    get Aliases(){
        return ['lunch'];
    }

    static async getDailyLunch(schoolCode){
        //SchoolInfoParser.MenuParser
    }

    onCommand(args, user, bot, source){
        
    }
}