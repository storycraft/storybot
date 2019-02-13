import waaai from 'waaai';
import { CommandListener } from 'storybot-core';

export default class UrlShortener extends CommandListener {
    constructor(main){
        super();

        this.main = main;
    }

    get Description(){
        return 'url이 너무 긴가요? | *sturl <줄이려는 주소>';
    }

    get Aliases(){
        return ['sturl', 'waaai'];
    }

    onCommand(args, user, bot, source){
        if (args.length < 1){
            source.send('사용법: *sturl <줄이려는 주소>');
            return;
        }
        
        var url = args.join('%20');

        waaai.link({url: url}).then((url) => {
            source.send(url);
        })
        .catch((e) => {
            source.send('음, 주소를 잘 입력 하신게 맞나요?\n서버 오류일 수 도 있으니 다시 시도해 보세요');
        });
    }
}