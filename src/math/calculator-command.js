import { CommandListener } from "storybot-core";
import ExpressionParser from "./expression-parser";

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
        let expression = args.join("");

        if (expression == ""){
            source.send('사용법: *calc <계산식>');
            return;
        }

        let parser = new ExpressionParser();
        try {
            parser.parse(expression);
            source.send("파싱 된 raw 식: " + parser.Lexer.toString());
            source.send(" = " + parser.Answer);
        } catch(e){
            source.send('식 파싱중 오류가 발생했습니다.\n' + e);
        }
    }
}