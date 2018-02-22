'use strict';

Object.defineProperty(exports, "__esModule", {
        value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class RequestHelper {
        static async get(requestUrl) {
                var res = await new Promise((resolve, reject) => _http2.default.get(requestUrl, resolve));
                if (res.statusCode != 200) return '';

                var data = '';
                res.on('data', chunk => data += chunk);

                await new Promise((resolve, reject) => res.on('end', resolve));
                return data;
        }
}
exports.default = RequestHelper;