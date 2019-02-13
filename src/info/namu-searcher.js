import { CommandListener, RequestHelper } from 'storybot-core';

const KEYWORD_SEARCHER = 'https://namu.wiki/complete';

const SEARCH_RESULT = 'https://namu.wiki/search';
const DOCUMENT = 'https://namu.wiki/w';

export default class NamuSearcher extends CommandListener {
    constructor(main){
        super();

        this.main = main;
    }

    get Description(){
        return '나무위키 꺼라 | *namu <키워드>';
    }

    get Aliases(){
        return ['namu', '나무위키'];
    }

    async getKeywords(str){
        let data = await RequestHelper.get(`${KEYWORD_SEARCHER}/${encodeURI(str)}`);

        return JSON.parse(data);
    }

    onCommand(args, user, bot, source){
        if (args.length < 1){
            source.send('뭐 검색하라는거죠');
            return;
        }

        var keyword = args.join(' ');

        this.getKeywords(keyword).then((list) => {
            //키워드가 있을 경우
            if (list.length > 0){
                source.send(`나무위키 \`${list[0]}\` 문서\n${DOCUMENT}/${encodeURI(list[0])}`);
            }
            else{
                source.send(`적절한 문서를 못 찾겠으니 직접 들어가서 찾으세요\n${SEARCH_RESULT}/${encodeURI(keyword)}`);
            }

        }).catch((e) => {
            source.send(`나무위키가 점검중이거나 서버 접속이 실패했습니다\n\`${e}\``);
        })
    }
}