import http from 'http';

export default class RequestHelper {
    static async get(requestUrl){
        var res = await new Promise((resolve, reject) => http.get(requestUrl,resolve));
        if (res.statusCode != 200)
                return '';

        var data = '';
        res.on('data', (chunk) => data += chunk);

        await new Promise((resolve, reject) => res.on('end', resolve));
        return data;
    }
}