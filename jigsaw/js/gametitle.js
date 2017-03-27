import configManager from './config';

class GameTitle {

    init()
    {
        this.config = configManager.getConfig();
        this.page = 0
        this.pageOffset = 700;
        this.maxPage = (Math.ceil(this.config.words.length / 4) - 1);
    }

    create()
    {
        const sprite = this.add.sprite(0, 0, 'background');
        sprite.scale.setTo(0.5);
        this.createThumbnails();
    }

    createThumbnails()
    {
        const config = this.config;
        const words = config.words;

        this.thumbnails = this.add.group();
        this.thumbnails.inputEnableChildren = true;
        words.forEach((word,index)=>{

            const thumbGroup = this.make.group();

            const thumb = this.make.image(0,0,word.pictureKey);
            const thumbWidth = thumb.width;
            const thumbHeight = thumb.height;
            thumb.width = 300;
            thumb.height = 300 * (thumbHeight / thumbWidth)
            thumb.inputEnabled = true;
            thumb.input.useHandCursor = true;
            thumb.data = { width: 3, height: 3, img: word.pictureKey, word };

            const thumbShadow = this.make.image(0,0,word.pictureKey);
            thumbShadow.width = thumb.width;
            thumbShadow.height = thumb.height;
            thumbShadow.tint = 0x000000;
            thumbShadow.alpha = 0.6;
            thumbShadow.x = 5;
            thumbShadow.y = 5;

            var wordText = this.game.add.text(0, 0, word.word, { font: "bold 30px Arial", fill: "#ffffff", align: "center"});
            wordText.anchor.set(0.5);
            wordText.x = thumb.width / 2;
            wordText.y = thumb.height / 2;
            wordText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            wordText.resolution = 2;

            var translationText = this.game.add.text(0, 0, word.translation, { font: "bold 20px Arial", fill: "#ffffff", align: "center"});
            translationText.anchor.set(0.5);
            translationText.x = thumb.width / 2;
            translationText.y = thumb.height / 2 + 30;
            translationText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
            translationText.resolution = 2;


            const border = this.make.graphics(0, 0);
            border.lineStyle(4, 0xFFFFFF, 1);
            border.drawRect(0,0, thumb.width,thumb.height);

            thumbGroup.add(thumbShadow);
            thumbGroup.add(thumb);
            thumbGroup.add(wordText);
            thumbGroup.add(translationText);
            thumbGroup.add(border);


            thumbGroup.onChildInputUp.add(this.selectThumb, this);

            this.thumbnails.add(thumbGroup);
        }); 

        this.thumbnails.align(Math.round(words.length / 2), 2, 375, 250, Phaser.BOTTOM_LEFT);
        this.thumbnails.x = 65;
        this.thumbnails.y = 40;
        this.thumbnails.child

        //  One BitmapText per word (so we can change their color when found)
        var title = this.add.text(0,0, 'Choose a Puzzle');
        title.anchor.set(0, 0);
        title.font = 'Arial';
        title.fontSize = 35;
        title.fill = '#FFFFFF';
        title.stroke = '#000000';
        title.strokeThickness = 3;
        title.anchor.x = 0.5;
        title.anchor.y = 0.5;
        title.x = this.game.width / 2;
        title.y = 45;
        title.setShadow(1, 1, '#000000', 1);
        title.resolution = 2;


        if(this.maxPage > 0)
        {
            var nextPage = this.add.image(this.game.width - 50, this.game.height - 30 ,'arrow');
            nextPage.anchor.setTo(0.5)
            nextPage.inputEnabled = true;
            nextPage.input.useHandCursor = true;
            nextPage.events.onInputUp.add(()=>{
                if(this.page < this.maxPage)
                {
                    this.page++;
                    const pagePosition = (this.page )
                    var test = this.thumbnails.getAt((this.page * 4));
                    this.add.tween(this.thumbnails).to({x:-(test.x) + 65},1200, Phaser.Easing.Elastic.Out, true);
                    this.previousPageButton.visible = true;

                    if(this.page >= this.maxPage)
                    {
                        this.nextPageButton.visible = false;
                    }
                } 
            });

            var previousPage = this.add.image(50, this.game.height - 30 ,'arrow');
            previousPage.anchor.setTo(0.5)
            previousPage.angle = 180;
            previousPage.inputEnabled = true;
            previousPage.input.useHandCursor = true;
            previousPage.visible = false;
            previousPage.events.onInputUp.add(()=>{
                if(this.page > 0)
                {
                    this.page--;
                    const pagePosition = (this.page )
                    var test = this.thumbnails.getAt((this.page * 4));
                    this.add.tween(this.thumbnails).to({x:-(test.x) + 65},1200, Phaser.Easing.Elastic.Out, true);

                    if(this.page === 0)
                    {
                        this.previousPageButton.visible = false;
                        this.nextPageButton.visible = true;
                    }
                } 
            });

            this.previousPageButton = previousPage;
            this.nextPageButton = nextPage;

        }

    }


    selectThumb(thumbnail)
    {
        var data = thumbnail.data;
        this.thumbnails.destroy();
        this.state.start("DifficultySelect", true, false, data);
    }
}

export default GameTitle;
