import ExpressionPiece from "./expression-piece";

export default class Identifier extends ExpressionPiece {
    constructor(){
        super("IDENTIFIER");
    }

    contains(chr){
        return !isNaN(Number.parseInt(chr)) || chr == '.';
    }
}