import ExpressionPiece from "./expression-piece";

export default class Variable extends ExpressionPiece {
    constructor(){
        super("VARIABLE");
    }

    get IsSinglePiece(){
        return true;
    }

    contains(chr, next, last){
        if (next && this.contains(next) || last && this.contains(last))
            return false;
        
        let code = chr.charCodeAt(0);
        return code > 64 && code < 91 || code > 96 && code < 123;
    }
}