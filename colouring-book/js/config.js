
let defaultGameConfig = {

    libs:{
        bitmapDataFloodFill:'libs/BitmapDataFloodFill.js',
        blob:'libs/Blob.js',
        canvasToBlob:'libs/CanvasToBlob.js',
        fileSaver:'libs/FileSaver.js'
    },

    images:{
        preloaderLoading:'assets/preloader/loading.png',
        preloaderLogo:'assets/preloader/logo.png',
        swatch:'assets/game/swatch.png',
        selected:'assets/game/selected.png',
        print:'assets/game/print.png',
        save:'assets/game/save.png',
        picture1:'assets/game/picture1.png',
        picture2:'assets/game/picture2.png',
        picture3:'assets/game/picture3.png',
        picture4:'assets/game/picture4.png',
        thumb1:'assets/game/thumb1.png',
        thumb2:'assets/game/thumb2.png',
        thumb3:'assets/game/thumb3.png',
        thumb4:'assets/game/thumb4.png'
    }

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