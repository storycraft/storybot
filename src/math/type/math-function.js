import ExpressionPiece from "./expression-piece";

export default class MathFunction extends ExpressionPiece {
    constructor(){
        super("MATH_FUNCTION");
    }

    contains(chr, next, last){
        if (next && !this.contains(next) && last && !this.contains(last))
            return false;

        let code = chr.charCodeAt(0);
        return code > 64 && code < 123;
    }
}