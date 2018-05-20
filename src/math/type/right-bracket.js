import ExpressionPiece from "./expression-piece";

export default class RightBracket extends ExpressionPiece {
    constructor(){
        super("RIGHT_BRACKET");
    }

    get IsSinglePiece(){
        return true;
    }

    contains(chr){
        return chr == ")";
    }
}