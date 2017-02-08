let defaultGameConfig = {

    libs:{
        wordFindScript:'libs/wordfind.js'        
    },

    images:{
        preloaderLoading:'assets/preloader/loading.png',
        preloaderLogo:'assets/preloader/logo.png',
        azoFontImage:'assets/game/azo.png',
        azoFontXml:'assets/game/azo.xml',  
        letters:'assets/game/'
    },

    words:['atari', 'firstvoices', 'canada', 'vancouver', 'spectrum', 'charlie',
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