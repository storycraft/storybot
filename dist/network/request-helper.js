'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RequestHelper {
        static async get(requestUrl) {
                var method = requestUrl.startsWith('https') ? _https2.default : _http2.default;

                var res = await new Promise((resolve, reject) => method.get(requestUrl, resolve));

                var data = '';
                res.on('data', chunk => data += chunk);

                await new Promise((resolve, reject) => res.on('end', resolve));

                return data;
        }
}
exports.default = RequestHelper;