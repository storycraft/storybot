import { CommandListener } from 'storybot-core';
import RequestHelper from '../network/request-helper';

const SEARCH_HELPER = 'http://lmgtfy.com';

export default class SearchHelper extends CommandListener {
    constructor(main){
        super();

        this.main = main;
    }

    get Description(){
        return '제발 검색좀 먼저 하세요 | *search <키워드>';
    }

    get Aliases(){
        return ['search', '검색'];
    }

    onCommand(args, user, bot, source){
        if (args.length < 1){
            source.send('무엇');
            return;
        }

        var keyword = args.join(' ');

        source.send(`${SEARCH_HELPER}/?q=${encodeURI(keyword)}`);
    }
}