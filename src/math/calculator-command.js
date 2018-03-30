import { CommandListener } from "storybot-core";

export default class CalculatorCommand extends CommandListener {
    constructor(main){
        super();
        this.main = main;

        this.main.CommandManager.on('calc', this.onCommand.bind(this));
    }

    get Description(){
        return '계산기 쓰실 **미완성 기능** | *calc <계산식>';
    }

    get Aliases(){
        return ['calc'];
    }

    onCommand(args, user, bot, source){
        source.send('미완성 기능이라고 했을텐데 말이죠');
    }
}