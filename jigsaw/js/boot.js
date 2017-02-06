class Boot {

    init()
    {
        this.game.stage.backgroundColor = "#FFFFFF";
    }

    preload(){
        this.game.load.image('loading',  'assets/preloader/loading.png');
        this.game.load.image('brand',    'assets/preloader/logo.png');
    }

    create(){
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.state.start("Preload");
    }
}

export default Boot;
