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
    letters:['ʔ','a','Á','á','Ą','ą','Ą́','ą́','b','ch','ch’','d','ddh','dh','dl','dz','e','É','é','Ę','ę','Ę́','ę́','g','gh','h','i','Í','í','Į','į','Į́','į́','j','k','k’','l','Ł','ł','m','n','o','Ó','ó','Ǫ','ǫ','Ǫ́','ǫ́','r','s','sh','t','t’','ts','ts’','tth','tth’','tł','tł’','u','Ú','ú','Ų','ų','Ų́','ų́','w','x','y','z',' ','į','ą','c','’','į́'],

    words:["łuk’é", "chíze", "ke", "dįnį deneyu", "dįnį", "nąntł’er", "xait’ázį́", "dekai", "ek’egwi", "yaghe", "eghézé", "jíedeniyéri", "baghetél", "tthábes", "łus"]

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