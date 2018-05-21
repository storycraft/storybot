import Identifier from "./type/identifier";
import Variable from "./type/variable";
import Operator from "./type/operator";
import LeftBracket from "./type/left-bracket";
import RightBracket from "./type/right-bracket";
import MathFunction from "./type/math-function";
import FunctionComma from "./type/function-comma";

import MathToken from "./math-token";

export default class ExpressionLexer {
    constructor(){
        this.currentPiece = null;
        this.currentToken = null;
        this.tokenList = [];
    }

    add(position, token){
        if (this.Size <= position)
            throw new Error(`max size is ${this.Size} but adding to ${position}`);

        var nextToken = this.tokenList[position];
        var lastToken = this.tokenList[position - 1];

        this.tokenList.splice(position, 0, token);
    }

    remove(position){
        if (this.Size <= position)
            throw new Error(`max size is ${this.Size} but remove at ${position}`);

        this.tokenList.splice(position, 1);

        var nextToken = this.tokenList[position];
        var lastToken = this.tokenList[position - 1];
    }

    push(token){
        this.currentToken = token;
        this.tokenList.push(token);
    }

    get Size(){
        return this.tokenList.length;
    }

    get LastToken(){
        return this.currentToken;
    }

    parse(strExpression){
        var length = strExpression.length;
        for (let i = 0; i < length; i++){
            let chr = strExpression[i];
            let last = strExpression[i - 1];
            let next = strExpression[i + 1];

            var pieceFound = false;
            for (var piece of ExpressionLexer.PieceList){
                if (piece.contains(chr, next, last)){
                    if (!pieceFound)
                        pieceFound = true;

                    if (this.currentPiece == piece && !this.currentPiece.IsSinglePiece){
                        this.currentToken.Value += chr;
                    }
                    else{
                        this.push(new MathToken(piece, chr));
                        this.currentPiece = piece;
                    }

                    break;
                }
            }

            if (!pieceFound){
                throw new Error(`Error to parse ${chr} at ${this.Size}`);
            }
        }
    }

    forEach(func){
        this.tokenList.forEach(func);
    }
    
    toString(){
        if (!this.currentToken)
            return "";

        var str = "";
        for(let token of this.tokenList){
            str += token + ", ";
        }

        return str;
    }

    static get PieceList(){
        return ExpressionLexer.pieces;
    }
}

ExpressionLexer.pieces = [
    new Identifier(),
    new MathFunction(),
    new FunctionComma(),
    new Operator(),
    new Variable(),
    new LeftBracket(),
    new RightBracket()
];