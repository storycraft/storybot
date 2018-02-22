import http from 'http';
import https from 'https';

export default class RequestHelper {
    static async get(requestUrl){
        var method = requestUrl.startsWith('https') ? https : http;
        
        var res = await new Promise((resolve, reject) => method.get(requestUrl,resolve));

        var data = '';
        res.on('data', (chunk) => data += chunk);

        await new Promise((resolve, reject) => res.on('end', resolve));

        return data;
    }
}