"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _process = require("process");

var _process2 = _interopRequireDefault(_process);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    //디스코드 봇 설정
    "discord": {
        "enabled": true,

        "clientId": "412451088252272642",
        "clientSecret": _process2.default.env.DISCORD_USER_SECRET,

        "userToken": _process2.default.env.DISCORD_USER_TOKEN
    },

    //라인 챗 봇 설정
    "line": {
        "enabled": false,

        "channelId": "",
        "channelSecret": "",

        "channelAccessToken": 0
    },

    //페이스북 메신져 설정
    "facebook": {
        "enabled": false,

        "email": "",
        "password": ""
    },

    //Socket 설정
    "socket": {
        "enabled": true,
        "path": "/storybot-socket",
        "port": _process2.default.env.PORT
    },

    "command-prefix": "*",

    //데이터 저장을 위한 firebase 설정
    "firebase-enabled": true,
    "firebase": {
        "apiKey": _process2.default.env.FIREBASE_API,
        "authDomain": "storybot-59085.firebaseapp.com",
        "databaseURL": "https://storybot-59085.firebaseio.com",
        "projectId": "storybot-59085",
        "storageBucket": "storybot-59085.appspot.com",
        "messagingSenderId": "554068044426"
    }
};