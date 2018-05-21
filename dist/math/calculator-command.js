"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require("storybot-core");

var _expressionParser = require("./expression-parser");

var _expressionParser2 = _interopRequireDefault(_expressionParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CalculatorCommand extends _storybotCore.CommandListener {
    constructor(main) {
        super();
        this.main = main;

        this.main.CommandManager.on('calc', this.onCommand.bind(this));
    }

    get Description() {
        return '계산기 쓰실 **미완성 기능** | *calc <계산식>';
    }

    get Aliases() {
        return ['calc'];
    }

    onCommand(args, user, bot, source) {
        let expression = args.join("");

        if (expression == "") {
            source.send('사용법: *calc <계산식>');
            return;
        }

        let parser = new _expressionParser2.default();
        try {
            parser.parse(expression);
            source.send("파싱 된 식: " + parser.Converter.toString());
            source.send('필요한 변수 값: ' + parser.Analyzer.VariableList.join(', '));
            source.send(" = " + parser.calculate());
        } catch (e) {
            source.send('식 파싱중 오류가 발생했습니다.\n' + e);
        }
    }
}
exports.default = CalculatorCommand;