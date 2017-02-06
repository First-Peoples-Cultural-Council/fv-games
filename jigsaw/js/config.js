let gameConfig = {

    libs:{
        bitmapJigsawScript:'libs/BitmapDataJigsawCut.js'        
    },

    images:{
        preloaderLoading:'assets/preloader/loading.png',
        preloaderLogo:'assets/preloader/logo.png',
        backgroundImage:'assets/game/wood.jpg',
        youWin:'assets/game/well-done.png',
        thumb1:'assets/game/thumb1.png',
        thumb2:'assets/game/thumb2.png',
        thumb3:'assets/game/thumb3.png',
        thumb4:'assets/game/thumb4.png',
        cornerTopLeft:'assets/game/corner1a.png',
        cornerTopRight:'assets/game/corner1b.png',
        cornerBottomLeft:'assets/game/corner1c.png',
        cornerBottomRight:'assets/game/corner1d.png',
        picture1:'assets/game/picture1.jpg',
        picture2:'assets/game/picture2.jpg',
        picture3:'assets/game/picture3.jpg',
        picture4:'assets/game/picture4.jpg'
    }

};

export default {

    setConfig:(config) => {
        gameConfig = {...config};
    },

    getConfig:() => {
        return gameConfig;
    }
}