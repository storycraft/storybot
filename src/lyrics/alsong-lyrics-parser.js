import { RequestHelper } from 'storybot-core';

import xml2js from 'xml2js';
import util from 'util';

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

export default class AlsongLyricsParser {
    static async getFromTitleArtist(title, artist = ''){
        var requestData = DEFAULT_REQUEST_DATA.replace('{title}', title).replace('{artistName}', artist);
        var response = await RequestHelper.request(REQUEST_OPTION, requestData);

        return await new Promise((resolve, reject) => xml2js.parseString(response, (err, result) => {
            if (err)
                reject(err);
                
            resolve(result['soap:Envelope']['soap:Body'][0/*idk why it need*/]['GetResembleLyric2Response'][0]['GetResembleLyric2Result'][0]['ST_GET_RESEMBLELYRIC2_RETURN']);
        }));
    }
}