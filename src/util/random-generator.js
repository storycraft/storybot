export default class RandomGenerator {
    static generate(){
        return Math.random().toString(36).substr(2, 9);
    }
}