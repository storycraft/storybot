import ExpressionPiece from "./expression-piece";

export default class LeftBracket extends ExpressionPiece {
    constructor(){
        super("LEFT_BRACKET");
    }

    get IsSinglePiece(){
        return true;
    }

    contains(chr){
        return chr == "(";
    }
}