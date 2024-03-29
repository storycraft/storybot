'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

var _pixivAppApi = require('pixiv-app-api');

var _pixivAppApi2 = _interopRequireDefault(_pixivAppApi);

var _apiAuth = require('../resources/api-auth');

var _apiAuth2 = _interopRequireDefault(_apiAuth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RandomPixiv extends _storybotCore.CommandListener {
    constructor(main) {
        super();
        this.main = main;

        this.api = null;
        this.loaded = false;

        //적절한 커맨드
        this.main.CommandManager.on('pixiv', this.onCommand.bind(this));
        this.init();
    }

    get Description() {
        return 'owo | *pixiv [키워드] [키워드] [키워드]...';
    }

    get Aliases() {
        return ['pixiv'];
    }

    get Loaded() {
        return this.loaded;
    }

    onCommand(args, user, bot, source) {
        if (!this.Loaded) {
            source.send('로그인하는 중이니 잠시만 기다려주세요');
            return;
        } else if (args.length < 1) {
            source.send('키워드는 적어도 1개 이상 주세요 .-.');
            return;
        }

        this.api.searchIllust(args.join(' '), { 'search_target': 'exact_match_for_tags' }).then(json => {
            let illusts = json.illusts;

            if (illusts.length < 1) {
                source.send('적당한 일러스트가 없네요');
                return;
            }

            let illust = illusts[Math.floor(Math.random() * (illusts.length - 1))];

            source.send(`${illust.title} by \`${illust.user.name} (${illust.user.account})\`\nhttps://www.pixiv.net/member_illust.php?mode=medium&illust_id=${illust.id}`);
        });
    }

    init() {
        if (this.Loaded) return;

        this.api = new _pixivAppApi2.default(_apiAuth2.default.pixiv['username'], _apiAuth2.default.pixiv['password'], true);
        this.loaded = true;
    }
}
exports.default = RandomPixiv;