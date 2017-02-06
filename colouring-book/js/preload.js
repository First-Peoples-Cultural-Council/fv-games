
class Preload {

    /**
     * Initialize Preloader
     */
    init()
    {
        this.loadingBar = this.game.make.sprite(this.game.world.centerX , 500, "loading");
        this.logo       = this.game.make.sprite(this.game.world.centerX, 250, 'brand');
        this.status     = this.game.make.text(this.game.world.centerX, 450, 'Loading...', {fill: 'black'});
        this.centerAnchors([this.logo, this.status, this.loadingBar]);
    }

    /**
     * Set Anchor to middle
     */
    centerAnchors(objects)
    {
        objects.forEach((obj)=>{
            obj.anchor.setTo(0.5,0.5);
        });
    }

    /**
     * Preload
     */
    preload()
    {

        this.game.add.existing(this.logo).scale.setTo(0.5);
        this.game.add.existing(this.loadingBar);
        this.game.add.existing(this.status);
        this.game.load.setPreloadSprite(this.loadingBar);

        //  First we load in the extra libs this game needs, there are 4 in total.
        //  If you've got your own build process, i.e. a Grunt or Gulp script, that
        //  packages your games together, then I would suggest rolling these 4 files into
        //  that instead, rather than loading them at run-time like here.

        this.load.path = 'libs/';

        this.load.script('BitmapDataFloodFill');
        this.load.script('FileSaver');
        this.load.script('Blob');
        this.load.script('CanvasToBlob');

        //  Load in the assets. There is a color swatch, some icons and a paper texture.
        //  This is all just the template UI. The pictures and thumbnails are the things
        //  that are actually colored in.

        this.load.path = 'assets/game/';

        this.load.images(['swatch', 'selected', 'paper', 'print', 'save']);
        this.load.images(['picture1', 'picture2', 'picture3', 'picture4']);
        this.load.images(['thumb1', 'thumb2', 'thumb3', 'thumb4']);

    }

    /**
     * Fade to next state
     */
    fade (nextState)
    {
        this.nextState = nextState;

        const fadeBackground = this.game.add.graphics(0, 0);
        fadeBackground.beginFill(0xFFFFFF, 1);
        fadeBackground.drawRect(0, 0, this.game.width, this.game.height);
        fadeBackground.alpha = 0;
        fadeBackground.endFill();

        const backgroundTween = this.game.add.tween(fadeBackground);
        backgroundTween.to({ alpha: 1 }, 500, null);
        backgroundTween.onComplete.add(this.changeState, this);
        backgroundTween.start();
    }


    changeState()
    {
        this.game.state.start(this.nextState);
    }

    create()
    {
        this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            this.fade("GameTitle");
        }, this);
    }


}

export default Preload;
