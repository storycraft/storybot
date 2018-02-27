'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const REQUEST_OPTION = {
    hostname: 'lyrics.alsong.co.kr',
    port: 80,
    path: '/alsongwebservice/service1.asmx',
    method: 'POST',
    headers: {
        'Content-Type': 'application/soap+xml'
    }
};

const DEFAULT_REQUEST_DATA = `<?xml version="1.0" encoding="UTF-8"?>
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://www.w3.org/2003/05/soap-envelope" xmlns:SOAP-ENC="http://www.w3.org/2003/05/soap-encoding" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:ns2="ALSongWebServer/Service1Soap" xmlns:ns1="ALSongWebServer" xmlns:ns3="ALSongWebServer/Service1Soap12">
<SOAP-ENV:Body><ns1:GetResembleLyric2>
<ns1:stQuery>
<ns1:strTitle>"{title}"</ns1:strTitle>
<ns1:strArtistName>"{artistName}"</ns1:strArtistName>
<ns1:nCurPage>0</ns1:nCurPage>
</ns1:stQuery></ns1:GetResembleLyric2></SOAP-ENV:Body></SOAP-ENV:Envelope>`;

class AlsongLyricsParser {
    static async getFromTitleArtist(title, artist) {
        var response = await _storybotCore.RequestHelper.request(REQUEST_OPTION, DEFAULT_REQUEST_DATA.replace('{title}', title).replace('{artistName}', artist));

        return await new Promise((resolve, reject) => _xml2js2.default.parseString(response, (err, result) => {
            if (err) reject(err);
            resolve(JSON.parse(result));
        }));
    }
}
exports.default = AlsongLyricsParser;