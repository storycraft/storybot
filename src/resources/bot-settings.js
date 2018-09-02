import process from 'process';

export default {
    //디스코드 봇 설정
    "discord": {
        "enabled": true,

        "clientId": "412451088252272642",
        "clientSecret": "B3am4vMVkbANR5dNa2Y6uYVIdaIuGOdz",

        "userToken": "NDEyNDUxMDg4MjUyMjcyNjQy.DWKeTQ.aBS0L4a4gH5MRMP7OSYeF9aCuwk"
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
        "password": "",
    },

    //Web 설정
    "web": {
        "enabled": true,
        "port": process.env.PORT,
    },

    "command-prefix": "*",
    
    //데이터 저장을 위한 firebase 설정
    "firebase-enabled": true,
    "firebase": {
        "apiKey": "AIzaSyBFd9oKdm5nFjygPc8YyUX6N3XrFPlj1tc",
        "authDomain": "storybot-59085.firebaseapp.com",
        "databaseURL": "https://storybot-59085.firebaseio.com",
        "projectId": "storybot-59085",
        "storageBucket": "storybot-59085.appspot.com",
        "messagingSenderId": "554068044426"
    }
}