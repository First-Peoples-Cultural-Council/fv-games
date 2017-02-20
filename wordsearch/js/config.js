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
    letters:'abcdefghijklmnopqrstuvwxyzᐊᔨᓇᓀᐤ',

    words:['atari', 'ᐊᔨᓇᓀᐤ', 'canada', 'vancouver', 'spectrum', 'charlie',
                    'forest', 'fire', 'earth', 'coleco', 'retro', 'superfamicom',
                    'nes', 'sonic', 'mario', 'masterchief', 'msx', 'gameboy', 'jaguar']

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