import { CommandListener } from "storybot-core";

export default class RollCommand extends CommandListener {

    constructor(main){
        super();
        this.main = main;
    }

    get Description(){
        return '*roll <최대 숫자>';
    }

    get Aliases(){
        return ['roll'];
    }

    onCommand(args, user, bot, source){
        var number = NaN;

        if (args.length > 0) { 
            number = Number.parseInt(args[0]);
        }

        if (isNaN(number)) {
            number = 100;
        }

        source.send(`${user.Name} -> \`${Math.round(-0.5 + (Math.random() * (number + 0.5)))}\``);
    }

}