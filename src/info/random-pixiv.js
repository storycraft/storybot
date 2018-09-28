import { CommandListener } from 'storybot-core';
import PixivAppApi from 'pixiv-app-api';
import apiAuth from '../resources/api-auth';

export default class RandomPixiv extends CommandListener {
    constructor(main){
        super();
        this.main = main;
        
        this.api = null;
        this.loaded = false;

        //적절한 커맨드
        this.main.CommandManager.on('pixiv', this.onCommand.bind(this));
        this.init();
    }

    get Description(){
        return 'owo | *pixiv [키워드] [키워드] [키워드]...';
    }

    get Aliases(){
        return ['pixiv'];
    }

    get Loaded() {
        return this.loaded;
    }

    onCommand(args, user, bot, source){
        if (!this.Loaded) {
            source.send('로그인하는 중이니 잠시만 기다려주세요');
            return;
        }
        else if (args.length < 1) {
            source.send('키워드는 적어도 1개 이상 주세요 .-.');
            return;
        }

        this.api.searchIllust(args.join(' '), {'search_target': 'exact_match_for_tags'}).then((json) => {
            let illusts = json.illusts;

            if (illusts.length < 1) {
                source.send('적당한 일러스트가 없네요');
                return;
            }

            let illust = illusts[Math.floor(Math.random() * (illusts.length - 1))];

            source.send(`${illust.title} by \`${illust.user.name} (${illust.user.account})\`\nhttps://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`);
        });
    }

    init(){
        if (this.Loaded)
            return;

        this.api = new PixivAppApi(apiAuth.pixiv['username'], apiAuth.pixiv['password'], true);
        this.loaded = true;
    }
}