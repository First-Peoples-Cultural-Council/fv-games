class GameTitle {

    create()
    {
        this.add.sprite(0, 0, 'wood');
        this.createThumbnails();
        this.fadeIn();
    }

    createThumbnails()
    {

        this.thumbnails = this.add.group();
        this.thumbnails.inputEnableChildren = true;
        this.thumbnails.createMultiple(1, ['thumb1', 'thumb2', 'thumb3', 'thumb4'], 0, true);
        this.thumbnails.setAll('input.useHandCursor', 'input', true);
        this.thumbnails.callAll('anchor.set', 'anchor', 0.5);
        this.thumbnails.align(2, 2, 400, 300, Phaser.CENTER);

        this.thumbnails.onChildInputOver.add(this.overThumb, this);
        this.thumbnails.onChildInputOut.add(this.outThumb, this);
        this.thumbnails.onChildInputUp.add(this.selectThumb, this);

        //  We use the `data` property that Sprites have to store some extra information
        //  about each jigsaw. The width and height properties are the number of jigsaw
        //  pieces the puzzle will contain, and the img is the picture key (in the cache)
        //  that will be cut to create the jigsaw.
        this.thumbnails.getChildAt(0).data = { width: 3, height: 3, img: 'picture1' };
        this.thumbnails.getChildAt(1).data = { width: 5, height: 4, img: 'picture2' };
        this.thumbnails.getChildAt(2).data = { width: 7, height: 6, img: 'picture3' };
        this.thumbnails.getChildAt(3).data = { width: 10, height: 8, img: 'picture4' };

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
