import ExpressionLexer from './expression-lexer';
import ExpressionAnalyzer from './expression-analyzer';
import TokenNode from './token-node';

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

        this.parseInternal();
    }

    parseInternal(){
        var currentNode;
        this.Lexer.forEach((token) => {
            if (token.Type.Name == 'OPERATOR'){
                let newNode = new TokenNode();
                newNode.Token = token;
                currentNode = newNode;
            }

            if (token.Type.Name == 'LEFT_BRACKET'){

            }


        });
    }
}