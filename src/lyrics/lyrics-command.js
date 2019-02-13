import { CommandListener } from 'storybot-core';
import AlsongLyricsParser from './alsong-lyrics-parser';

export default class LyricsCommand extends CommandListener {
    constructor(main){
        super();

        this.main = main;
    }

    get Description(){
        return '머라고 말하는거야 | *lrc "<제목>" "<아티스트>"';
    }

    get Aliases(){
        return ['lyrics', 'lrc'];
    }

    onCommand(args, user, bot, source){
        var reTokenized = args.join(' ').split('"');

        if (reTokenized.length != 5){
            source.send('사용법: *lrc "<제목>" "<아티스트>"');
            return;
        }

        var title = reTokenized[1];
        var artist = reTokenized[3];

        AlsongLyricsParser.getFromTitleArtist(title, artist).then((result) => {
            var listText = '다음 가사 목록 중에서 골라주세요';

            var i = 1;
            for (let lyric of result){
                listText += `\n${i++} : ${lyric['strArtistName'][0]} - ${lyric['strTitle'][0]} | 자막 제작자 : ${lyric['strRegisterName'][0]}`;

                if (i >= 10)
                    break;
            }

            source.send(listText).then((listMsg) => {
                user.once('message', (msg) => {
                    if (msg.Source != source){
                        source.send('선택이 취소 되었습니다');
                        return;
                    }
    
                    try {
                        var selected = Number.parseInt(msg.Text);
    
                        if (selected >= result.length)
                            throw new Error('Unknown index');
    
                        var selectedLyric = result[selected - 1];

                        this.sendLyric(msg.Source, selectedLyric['strLyric'][0]);
    
                    } catch(e){
                        source.send('선택이 취소 되었습니다');
                    }
                });
            });
            
        }).catch((e) => {
            source.send(`가사를 가져오는 중 오류가 발생했습니다\n\`${e}\``);
        });
    }

    async sendLyric(source, rawLyric){
        var lyric = rawLyric.replace(/<br>/gi, '\n');

        var length = Math.ceil(lyric.length / 2000);

        for (let i = 0; i <= length; i++){
            var start = i * 2000;
            source.send(lyric.slice(start,start + 2000));
        }
    }
}