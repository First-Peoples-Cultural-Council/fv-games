
class Preload {

    init()
    {
        this.loadingBar = this.game.make.sprite(this.game.world.centerX , 500, "loading");
        this.logo       = this.game.make.sprite(this.game.world.centerX, 250, 'brand');
        this.status     = this.game.make.text(this.game.world.centerX, 450, 'Loading...', {fill: 'black'});

        this.centerObjects([this.logo, this.status, this.loadingBar]);

        this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    }

    centerObjects(objects)
    {
        objects.forEach((obj)=>{
            obj.anchor.setTo(0.5,0.5);
        });
    }

    preload()
    {
        this.game.add.existing(this.logo).scale.setTo(0.5);
        this.game.add.existing(this.loadingBar);
        this.game.add.existing(this.status);
        this.game.load.setPreloadSprite(this.loadingBar);


        this.load.script('wordfind', 'libs/wordfind.js');
        this.load.path = 'assets/game/';
        this.load.bitmapFont('azo');

        var _this = this;

        this.letters.forEach(function(letter) {
            _this.load.spritesheet(letter.toLowerCase(), letter + '.png', 100, 100);
        });



    }

    fade (nextState)
    {
        this.nextState = nextState;

        const fadeBackground = this.game.add.graphics(0, 0);
        fadeBackground.beginFill(0xFFFFFF, 1);
        fadeBackground.drawRect(0, 0, this.game.width, this.game.height);
        fadeBackground.alpha = 0;
        fadeBackground.endFill();

        const backgroundTween = this.game.add.tween(fadeBackground);
        backgroundTween.to({ alpha: 1 }, 1000, null);
        backgroundTween.onComplete.add(this.changeState, this);
        backgroundTween.start();
    }

    changeState()
    {
        this.game.state.start(this.nextState);
        this.fadeOut();
    }

    fadeOut()
    {
        var fadeBackground = this.game.add.graphics(0, 0);
        fadeBackground.beginFill(0xFFFFFF, 1);
        fadeBackground.drawRect(0, 0, this.game.width, this.game.height);
        fadeBackground.alpha = 1;
        fadeBackground.endFill();

        const backgroundTween = this.game.add.tween(fadeBackground);
        backgroundTween.to({ alpha: 0 }, 1000, null);
        backgroundTween.start();
    }


    create(){
        this.fade("Main");
    }
}

export default Preload;
