import { CommandListener } from 'storybot-core';
import PixivApi from 'pixiv-api-client';
import apiAuth from '../resources/api-auth';

export default class RandomPixiv extends CommandListener {
    constructor(main){
        super();
        this.main = main;
        
        this.api = new PixivApi();
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

        this.api.searchIllustPopularPreview(args.join(' '), {'search_target': 'exact_match_for_tags'}).then((json) => {
            let illusts = json.illusts;
            let illust = illusts[Math.floor(Math.random() * (illusts.length - 1))];

            source.send(`${illust.title} by \`${illust.user.name} (${illust.user.account})\`\nhttps://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`);
        });
    }

    async init(){
        if (this.Loaded)
            return;

        await this.api.login(apiAuth.pixiv['username'], apiAuth.pixiv['password'], true);
        this.loaded = true;
    }
}