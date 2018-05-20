import ExpressionPiece from "./expression-piece";

export default class Operator extends ExpressionPiece {
    constructor(){
        super("OPERATOR");
    }

    isSinglePiece(){
        return true;
    }

    contains(chr){
        return chr == "+" || chr == "-" || chr == "*" || chr == "/" || chr == "^";
    }
}