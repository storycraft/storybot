import { CommandListener } from "storybot-core";
import ExpressionParser from "./expression-parser";

export default class CalculatorCommand extends CommandListener {
    constructor(main){
        super();
        this.main = main;

        this.main.CommandManager.on('calc', this.onCommand.bind(this));
    }

    get Description(){
        return '계산기 쓰실 | *calc <계산식>';
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
            source.send('필요한 변수 값: ' + parser.Analyzer.VariableList.join(', '));
            source.send(" = " + parser.calculate());
        } catch(e){
            source.send('식 파싱중 오류가 발생했습니다.\n' + e);
        }
    }
}