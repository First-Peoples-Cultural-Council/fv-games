let defaultGameConfig = {

    libs:{
        wordFindScript:'assets/libs/wordfind.js'        
    },

    images:{
        preloaderLoading:'assets/images/loading.png',
        preloaderLogo:'assets/images/logo.png',
        azoFontImage:'assets/images/azo.png',
        azoFontXml:'assets/images/azo.xml',  
        letters:'assets/images/'
    },
    letters:["a","b",'c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','q','x','y','z'],

    words:["charlie",'bodman']

};

let gameConfig = {};

export default {

    setConfig:(config) => {
        gameConfig = Object.assign({}, defaultGameConfig, config, gameConfig);
    },

    getConfig:() => {
        return gameConfig;
    }
}