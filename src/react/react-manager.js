import EventEmitter from 'events';

export default class ReactManager extends EventEmitter {
    constructor(main){
        this.main = main;

        this.main.Bot.on('message', this.onMessage.bind(this));
    }

    decodeSentence(text){
        var sentences = text.split(/(\.|\?|!)/);//문장 기호로 분리
        
        return sentences;
    }

    decodeWord(sentence){
        var words = sentence.split(' ');
        
        return words;
    }

    onMessage(msg){
        var wordMap = {};
        var sentences = this.decodeSentence(msg.Text);

        for (let sentence of sentences){
            wordMap[sentence] = this.decodeWord(sentence);
        }

        super.emit('message', msg.User, msg.Client, wordMap);
    }
}