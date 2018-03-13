'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class ChatDecoder {
    constructor() {}

    static decode(chat) {
        return new Chat(chat);
    }
}

exports.default = ChatDecoder;
class Chat {
    constructor(plainText) {
        this.chat = plainText;

        this.sentences = null;
    }

    get Chat() {
        return this.chat;
    }

    get Sentences() {
        if (this.sentences) return this.sentences;

        var sentences = this.chat.split(Sentence.Pattern); //문장 기호로 분리

        this.sentences = [];

        for (let sentence of sentences) this.sentences.push(new Sentence(sentence));

        return this.sentences;
    }

    findMatchSentence(patterns) {
        for (let sentence of this.Sentences) {
            if (sentence.matchPattern(patterns)) return sentence;
        }

        return null;
    }
}

class Sentence {
    constructor(sentence, endCharacter) {
        this.sentence = sentence;
        this.endCharacter = endCharacter;

        this.words = null;
    }

    get Sentence() {
        return this.sentence;
    }

    get EndCharacter() {
        return this.endCharacter;
    }

    static get Pattern() {
        return new RegExp(/(\.|\?|!)/);
    }

    get Words() {
        if (this.words) return this.words;

        var words = this.Sentence.split(Word.Pattern);

        var list = [];
        for (let word of words) list.push(new Word(word));

        return this.words = list;
    }

    matchPattern(patterns) {
        let length = patterns.length;
        let count = this.Words.length - length;

        if (count < 0) return;

        for (let i = 0; i <= count; i++) {
            var match = 0;

            for (let a = 0; a < length; a++) {
                if (!this.Words[i + a].match(patterns[a])) break;

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
        return !!this.Word.match(pattern);
    }
}