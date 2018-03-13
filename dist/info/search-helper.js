'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

var _requestHelper = require('../network/request-helper');

var _requestHelper2 = _interopRequireDefault(_requestHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SEARCH_HELPER = 'http://lmgtfy.com';

class SearchHelper extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.main.CommandManager.on('search', this.onCommand.bind(this));
        this.main.CommandManager.on('검색', this.onCommand.bind(this));
    }

    get Description() {
        return '제발 검색좀 먼저 하세요 | *search <키워드>';
    }

    get Aliases() {
        return ['search', '검색'];
    }

    onCommand(args, user, bot, source) {
        if (args.length < 1) {
            source.send('무엇');
            return;
        }

        var keyword = args.join(' ');

        source.send(`${SEARCH_HELPER}/?q=${encodeURI(keyword)}`);
    }
}
exports.default = SearchHelper;