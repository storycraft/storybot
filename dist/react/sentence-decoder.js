'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class SentenceDecoder {
    constructor(main) {}

    static decode(text) {
        var sentences = text.split(Sentence.Pattern); //문장 기호로 분리

        var list = [];

        for (let sentence of sentences) list.push(new Sentence(sentence));

        return list;
    }
}

exports.default = SentenceDecoder;
class Sentence {
    constructor(sentence) {
        this.sentence = sentence;

        var words = sentence.split(Word.Pattern);

        this.words = [];
        for (let word of words) list.push(new Word(word));
    }

    get Sentence() {
        return this.sentence;
    }

    static get Pattern() {
        return new RegExp(/(\.|\?|!)/);
    }

    get Words() {
        return this.words;
    }

    matchPattern(...patterns) {
        let length = patterns.length;
        let count = this.Words.length - length;
        for (let i = 0; i < count; i++) {
            var match = 0;

            for (let a = 0; a < length; a++) {
                if (!this.words[i + a].match(patterns[a])) break;

                match++;
            }

            if (match == length) return true;
        }

        return false;
    }
}

class Word {
    constructor(word) {
        this.word = word;
    }

    get Word() {
        return this.word;
    }

    static get Pattern() {
        return ' ';
    }

    match(pattern) {
        return pattern.test(this.Word);
    }
}