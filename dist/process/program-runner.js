'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _process = require('./process');

var _process2 = _interopRequireDefault(_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _storybotCore = require('storybot-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProgramRunner extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;

        this.first = true;
    }

    get Description() {
        return '';
    }

    get Aliases() {
        return [];
    }

    get Language() {
        return '';
    }

    get SourceExt() {
        return '';
    }

    async run(source, channel) {}

    async writeTempFile(code) {
        if (!_fs2.default.existsSync('./code')) {
            _fs2.default.mkdirSync('./code', 484 /*0744*/);
        }

        if (!_fs2.default.existsSync(`./code/${this.Language}`)) {
            _fs2.default.mkdirSync(`./code/${this.Language}`, 484);
        }

        var fileName = 'Source-' + Math.floor(Math.random() * 100000) + '-' + new Date().getTime();
        var path = `./code/${this.Language}/` + fileName + '.' + this.SourceExt;

        await new Promise((resolve, reject) => _fs2.default.writeFile(path, code, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }));

        return path;
    }

    onCommand(args, user, bot, channel) {}
}
exports.default = ProgramRunner;