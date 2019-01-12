'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _storybotCore = require('storybot-core');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _randomGenerator = require('../util/random-generator');

var _randomGenerator2 = _interopRequireDefault(_randomGenerator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProgramRunner extends _storybotCore.CommandListener {
    constructor(main) {
        super();

        this.main = main;
        this.basePath = `${this.BotPath}/${this.CodeType}-source`;

        this.first = true;
    }

    get Description() {
        return '';
    }

    get Aliases() {
        return [];
    }

    get CodeType() {
        return 'code';
    }

    get BotPath() {
        return `${_os2.default.tmpdir()}/storybot`;
    }

    get SourcePath() {
        return this.basePath;
    }

    async writeTempFile(fileName, code) {
        var basePath = this.SourcePath;
        var sourcePath = `${basePath}/${_randomGenerator2.default.generate()}`;
        var path = `${sourcePath}/${fileName}`;

        if (!_fs2.default.existsSync(this.BotPath)) {
            _fs2.default.mkdirSync(this.BotPath, 484);
        }

        if (!_fs2.default.existsSync(basePath)) {
            _fs2.default.mkdirSync(basePath, 484);
        }

        if (!_fs2.default.existsSync(sourcePath)) {
            _fs2.default.mkdirSync(sourcePath, 484);
        }

        await new Promise((resolve, reject) => _fs2.default.writeFile(path, code, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        }));

        return sourcePath;
    }

    async run(source, channel) {}

    onCommand(args, user, bot, channel) {}
}
exports.default = ProgramRunner;