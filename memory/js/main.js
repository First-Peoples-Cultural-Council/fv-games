import configManager from './config';

class Main {

    init()
    {
        this.config = configManager.getConfig();
        this.firstCardChoice = false;
        this.secondCardChoice = false;
        this.cards = this.shuffleCards();
        this.wait = false;
    }

    create () 
    {
        this.fadeIn();
        this.game.add.sprite(0,0,'background');
        this.allCards = this.add.group();
        this.createCards();
        this.createTitle();
        this.createTimer();
    }

    createTitle()
    {
        this.title = this.add.sprite(0,0,'title');
        this.title.anchor.setTo(0.5);
        this.title.x = this.game.width / 2;
        this.title.y = 75;        
    }

    createTimer()
    {
        this.timer = this.add.text(0,0,'test',{ font: "40px Arial", fill: "#000000", align: "center" });
        this.timer.x = 230;
        this.timer.y = 577;
        this.timeTitle = this.add.sprite(0,0,'time');
        this.timeTitle.anchor.setTo(0.5);
        this.timeTitle.x = 150;
        this.timeTitle.y = 600;     
        this.startTime = Date.now();
    }

    shuffleCards()
    {
        let cards = this.config.cards.slice(0);
        cards = cards.concat(cards.slice(0));

        for (let i = cards.length; i; i--) 
        {
            let j = Math.floor(Math.random() * i);
            [cards[i - 1], cards[j]] = [cards[j], cards[i - 1]];
        }

        return cards;
    }

    createCard(cardData)
    {
        const card = this.add.group();

        const cardSprite = this.game.make.sprite(0,0,'card');
        cardSprite.inputEnabled = true;
        cardSprite.input.useHandCursor = true;
        cardSprite.anchor.setTo(0.5,0.5);
        cardSprite.events.onInputDown.add(this.chooseCard.bind(this, card));
        
        const cardFlipped = this.game.make.sprite(0,0,'card_flipped');
        cardFlipped.anchor.setTo(0.5,0.5);
        cardFlipped.visible = false;

        const cardContents = this.add.group();

        const itemImage = this.game.make.sprite(0,0,cardData.image);
        itemImage.anchor.setTo(0.5,0.5);
        itemImage.x = 0
        itemImage.y = 0
        itemImage.scale.setTo(0.5);

        const word = this.game.make.text(0,0,cardData.word,{ font: "12px Arial", fill: "#FFFFFF", align: "center" });
        word.anchor.setTo(0.5);
        word.y = -65;

        const translation = this.game.make.text(0,0,cardData.translation,{ font: "12px Arial", fill: "#FFFFFF", align: "center" });
        translation.anchor.setTo(0.5);
        translation.y = 65;

        cardContents.add(itemImage);
        cardContents.add(word);
        cardContents.add(translation);
        cardContents.visible = false;
        
        card.add(cardSprite);
        card.add(cardFlipped);
        card.add(cardContents);


        card.cardContents = cardContents;
        card.unflippedCardImage = cardSprite;
        card.flippedCardImage = cardFlipped;
        card.cardData = cardData;

        
        return card;
    }


    chooseCard(card)
    {
        if(this.wait === false)
        {
            const tween = this.game.add.tween(card.scale);
            tween.to({x:0}, 500, Phaser.Easing.Cubic.InOut);
            tween.onComplete.addOnce(this.showCard.bind(this,card));
            tween.start();
            this.wait = true;

            if(this.firstCardChoice === false)
            {
                this.firstCardChoice = card;
            }
            else if(this.secondCardChoice === false)
            {
                this.secondCardChoice = card;
            }
        }
    }

    showCard(card)
    {
        card.unflippedCardImage.visible = false;
        card.flippedCardImage.visible = true;
        card.cardContents.visible = true;

        const tween = this.game.add.tween(card.scale);
        tween.to({x:1}, 500, Phaser.Easing.Cubic.InOut);
        tween.onComplete.addOnce(this.checkCards.bind(this, card));
        tween.start();
    }

    flipCardBack(card)
    {
        const tween = this.game.add.tween(card.scale);
        tween.to({x:0}, 500, Phaser.Easing.Cubic.InOut);
        tween.onComplete.addOnce(this.hideCard.bind(this,card));
        tween.start();
    }

    hideCard(card)
    {
        card.unflippedCardImage.visible = true;
        card.flippedCardImage.visible = false;
        card.cardContents.visible = false;

        const tween = this.game.add.tween(card.scale);
        tween.to({x:1}, 500, Phaser.Easing.Cubic.InOut);
        tween.start();
    }

    checkCards(card)
    {
        if(this.firstCardChoice !== false && this.secondCardChoice !== false)
        {
            if(this.firstCardChoice.cardData.word === this.secondCardChoice.cardData.word)
            {
                //Play and do things
            }
            else
            {
                this.flipCardBack(this.firstCardChoice);
                this.flipCardBack(this.secondCardChoice);
            }
            
            this.firstCardChoice = false;
            this.secondCardChoice = false;
        }

        this.wait = false;
    }

    createCards()
    {
        this.cards.map((card)=>{
            this.allCards.add(this.createCard(card));
        });

        this.allCards.align(5, 3, 135, 207, Phaser.CENTER);
        this.allCards.x = 65;
        this.allCards.y = 150;
    }

    update() {  
        this.updateTimer();
    }
    
    updateTimer() 
    {  
        const now = Date.now();
        const timeDiff = now - this.startTime;

        let minutes = Math.floor(timeDiff / 60000) % 60;    
        let seconds = Math.floor(timeDiff / 1000) % 60;      
        let time = '';

        if (seconds < 10)
        {
            seconds = '0' + seconds;
        }    

        time = seconds;

        if (minutes < 10)
        {
            minutes = '0' + minutes;    
        }

        time = minutes + ':' + seconds;
    
        this.timer.setText(time);
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

}

export default Main;