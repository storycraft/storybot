import { CommandListener } from "storybot-core";

export default class CalculatorCommand extends CommandListener {
    constructor(main){
        this.main = main;

        this.main.CommandManager.on('calc', this.onCommand.bind(this));
    }

    get Description(){
        return '계산기 쓰실 | *calc <계산식>';
    }

    get Aliases(){
        return ['calc'];
    }
}