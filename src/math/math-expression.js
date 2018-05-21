export default class MathExpression {
    constructor(operatorToken, leftToken, rightToken){
        this.operatorToken = operatorToken;
        this.leftToken = leftToken;
        this.rightToken = rightToken;
    }

    get OperatorToken(){
        return this.operatorToken;
    }

    get LeftToken(){
        return this.leftToken;
    }

    get RightToken(){
        return this.rightToken;
    }

    toString(){
        return this.leftToken + ' ' + this.operatorToken + ' ' + this.rightToken;
    }
}