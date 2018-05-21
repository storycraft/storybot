import ExpressionPiece from "./expression-piece";

export default class FunctionComma extends ExpressionPiece {
    constructor(){
        super("FUNCTION_COMMA");
    }

    contains(chr){
        return chr == ',';
    }
}