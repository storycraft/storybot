import ExpressionLexer from './expression-lexer';
import ExpressionAnalyzer from './expression-analyzer';

export default class ExpressionParser {
    constructor(){
        this.lexer = new ExpressionLexer();
        this.analyzer = new ExpressionAnalyzer();
    }

    get Lexer(){
        return this.lexer;
    }

    get Analyzer(){
        return this.analyzer;
    }

    parse(str){
        this.Lexer.parse(str);
        this.analyzer.analysis(this.Lexer);
    }
}