let defaultGameConfig = {

    libs:{
        wordFindScript:'assets/libs/wordfind.js'        
    },

    images:{
        preloaderLoading:'assets/images/loading.png',
        preloaderLogo:'assets/images/logo.png',
        tile:'assets/images/tile.png',
        playAudio:'assets/images/play_audio.png'
    },

    letters:['ʔ','a','Á','á','Ą','ą','Ą́','ą́','b','ch','ch’','d','ddh','dh','dl','dz','e','É','é','Ę','ę','Ę́','ę́','g','gh','h','i','Í','í','Į','į','Į́','į́','j','k','k’','l','Ł','ł','m','n','o','Ó','ó','Ǫ','ǫ','Ǫ́','ǫ́','r','s','sh','t','t’','ts','ts’','tth','tth’','tł','tł’','u','Ú','ú','Ų','ų','Ų́','ų́','w','x','y','z',' ','į','ą','c','’','į́'],

    words:[
        {
            word:"łuk’é",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"chíze",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"asd oaskd o",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"dįnį deneyu",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"dįnį",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"nąntł’er",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"xait’ázį́",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        },  
        {
            word:"dekai",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"ek’egwi",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"yaghe",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"eghéasdzé",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"jíedeniyéri",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }, 
        {
            word:"bagheasdtél",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        },  
        {
            word:"tthábes",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        },  
        {
            word:"łus",
            english:"english",
            audio:'assets/sounds/sample.mp3',
            image:'assets/images/bear.jpg'
        }
    ]

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