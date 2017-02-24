import configManager from './config';

class GameTitle {

    init()
    {
        this.config = configManager.getConfig();
        this.page = 0
        this.perPage = 4;
        this.pageOffset = 325;
    }

    create()
    {
        this.add.sprite(0, 0, 'wood');
        this.createThumbnails();
        this.fadeIn();
    }

    createThumbnails()
    {
        const config = this.config;
        const puzzles = config.puzzles;

        this.thumbnails = this.add.group();
        this.thumbnails.inputEnableChildren = true;
        puzzles.forEach((puzzle,index)=>{
            var style = { font: "bold 30px Arial", fill: "#ffffff", align: "center"};  
            var text = this.game.add.text(0, 0, "Test\nTest", style);

            var bar = this.game.add.graphics();
            bar.beginFill(0x000000, 0);
            bar.drawRect(0, 0, 200, 100);
    
            var thumb = this.thumbnails.create(0,0,puzzle.thumbnailKey);
            text.anchor.set(0.5);
            text.x = 0;
            text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

            thumb.addChild(bar);
            thumb.addChild(text);

            thumb.data = { width: 3, height: 3, img: puzzle.pictureKey };
        }); 

        // this.thumbnails.createMultiple(1, ['thumb1', 'thumb2', 'thumb3', 'thumb4'], 0, true);
        this.thumbnails.setAll('input.useHandCursor', 'input', true);
        this.thumbnails.callAll('anchor.set', 'anchor', 0.5);
        this.thumbnails.align(Math.round(puzzles.length / 2), 2, 360, 250, Phaser.BOTTOM_RIGHT);
        this.thumbnails.onChildInputOver.add(this.overThumb, this);
        this.thumbnails.onChildInputOut.add(this.outThumb, this);
        this.thumbnails.onChildInputUp.add(this.selectThumb, this);
        this.thumbnails.x = 40;
        this.thumbnails.y = 50;




            //  One BitmapText per word (so we can change their color when found)
        var style = { font: "bold 28px Arial", autoUpperCase:true, fill: "#000000" };
        //  One BitmapText per word (so we can change their color when found)
        var title = this.add.text(0,0, 'Choose a Puzzle', style);
        title.anchor.x = 0.5;
        title.anchor.y = 0.5;
        title.x = this.game.width / 2;
        title.y = 25;

        var nextArrow = this.add.image(this.game.width - 15, this.game.height - 15 ,'arrow');
        nextArrow.anchor.x = 1;
        nextArrow.anchor.y = 1;
        nextArrow.inputEnabled = true;
        nextArrow.events.onInputUp.add(()=>{
            this.page++;
            this.add.tween(this.thumbnails).to({x:-(this.page * this.pageOffset)},1500, Phaser.Easing.Elastic.Out, true);
        })

    }

    nextPage()
    {

    }
    fadeIn()
    {
        var fadeBackground = this.game.add.graphics(0, 0);
        fadeBackground.beginFill(0xFFFFFF, 1);
        fadeBackground.drawRect(0, 0, this.game.width, this.game.height);
        fadeBackground.alpha = 1;
        fadeBackground.endFill();

        const backgroundTween = this.game.add.tween(fadeBackground);
        backgroundTween.to({ alpha: 0 }, 500, null);
        backgroundTween.start();
    }



    /**
     * Thumbnail
     */
    overThumb(thumbnail)
    {
        thumbnail.scale.set(1.1);
        thumbnail.angle = 4;
    }

    /**
     * Thumbnail
     */
    outThumb(thumbnail)
    {
        thumbnail.scale.set(1);
        thumbnail.angle = 0;
    }

    selectThumb(thumbnail)
    {
        var data = thumbnail.data;
        this.thumbnails.destroy();
        this.state.start("Main", true, false, data);
    }
}

export default GameTitle;
