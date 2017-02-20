let defaultGameConfig = {

    libs:{
        bitmapJigsawScript:'assets/libs/BitmapDataJigsawCut.js'        
    },

    images:{
        preloaderLoading:'assets/images/loading.png',
        preloaderLogo:'assets/images/logo.png',
        backgroundImage:'assets/images/wood.jpg',
        youWin:'assets/images/well-done.png',
        thumb1:'assets/images/thumb1.png',
        thumb2:'assets/images/thumb2.png',
        thumb3:'assets/images/thumb3.png',
        thumb4:'assets/images/thumb4.png',
        cornerTopLeft:'assets/images/corner1a.png',
        cornerTopRight:'assets/images/corner1b.png',
        cornerBottomLeft:'assets/images/corner1c.png',
        cornerBottomRight:'assets/images/corner1d.png',
        picture1:'assets/images/picture1.jpg',
        picture2:'assets/images/picture2.jpg',
        picture3:'assets/images/picture3.jpg',
        picture4:'assets/images/picture4.jpg'
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