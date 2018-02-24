//계산용 util
export default class BoardMathHelper {

    static getCombinedLocation(x, y){
        return x << 3 | y;
    }

    static fromCombinedLocation(xy){
        return [xy >> 3, xy & 7];
    }

    static distance(loc1, loc2){
        let from = BoardMathHelper.fromCombinedLocation(loc1);
        let to = BoardMathHelper.fromCombinedLocation(loc2);

        return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
    }
}