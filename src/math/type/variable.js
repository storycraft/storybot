import ExpressionPiece from "./expression-piece";

export default class Variable extends ExpressionPiece {
    constructor(){
        super("VARIABLE");
    }

    get IsSinglePiece(){
        return true;
    }

    contains(chr, next){
        if (next && this.contains(next))
            return false;
        
        let code = chr.charCodeAt(0);
        return code > 64 && code < 123;
    }
}