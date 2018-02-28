'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

var _alsongLyricsParser = require('./alsong-lyrics-parser');

var _alsongLyricsParser2 = _interopRequireDefault(_alsongLyricsParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LyricsCommand extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.main.CommandManager.on('lyrics', this.onCommand.bind(this));
        this.main.CommandManager.on('lrc', this.onCommand.bind(this));
    }

    get Description() {
        return '머라고 말하는거야 | 사용법: *lrc "<제목>" "<아티스트>"';
    }

    get Aliases() {
        return ['lyrics', 'lrc'];
    }

    onCommand(args, user, bot, source) {
        var reTokenized = args.join(' ').split('"');

        if (reTokenized.length != 5) {
            source.send('사용법: *lrc "<제목>" "<아티스트>"');
            return;
        }

        var title = reTokenized[1];
        var artist = reTokenized[3];

        _alsongLyricsParser2.default.getFromTitleArtist(title, artist).then(result => {
            var listText = '다음 가사 목록 중에서 골라주세요';

            var i = 1;
            for (let lyric of result) {
                listText += `\n${i++} : ${lyric['strArtistName'][0]} - ${lyric['strTitle'][0]} | 자막 제작자 : ${lyric['strRegisterName'][0]}`;

                if (i >= 10) break;
            }

            source.send(listText).then(listMsg => {
                user.once('message', msg => {
                    if (msg.Source != source) {
                        source.send('선택이 취소 되었습니다');
                        return;
                    }

                    try {
                        var selected = Number.parseInt(msg.Text);

                        if (selected >= result.length) throw new Error('Unknown index');

                        var selectedLyric = result[selected - 1];

                        this.sendLyric(msg.Source, selectedLyric['strLyric'][0]);
                    } catch (e) {
                        source.send('선택이 취소 되었습니다');
                    }
                });
            });
        }).catch(e => {
            source.send(`가사를 가져오는 중 오류가 발생했습니다\n\`${e}\``);
        });
    }

    async sendLyric(source, rawLyric) {
        var length = Math.ceil(rawLyric.length / 2000);

        var lyric = rawLyric.replace(/<br>/gi, '\n');

        for (let i = 0; i <= length; i++) {
            await source.send(lyric.slice(i * 2000, 2000));
        }
    }
}
exports.default = LyricsCommand;