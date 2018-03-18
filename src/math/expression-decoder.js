export default class ExperessionDecoder {
    static decode(str){

    }

    static splitBracket(str){
        var list = [];

        var write = false;
        var temp = '';

        var bracketStart = str.split('(');
        var bracketEnd = str.split(')');

        if (bracketStart.length != bracketEnd.length)
            throw new Error('Invalid Expression');

    }
}