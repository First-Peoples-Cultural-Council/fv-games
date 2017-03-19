import configManager from './config';

class Main {

    init(){

        this.config = configManager.getConfig();

        //  This is your word list. Add or remove any words you like in here.
        //  The words mustn't contain any spaces or numbers.

        //  The shorter the array, the larger the letter tiles will scale in-game.
        this.letters = this.config.letters;

        this.puzzle = null;
        this.solution = null;

        this.wordList = {};
        //  The dimensions of the word search, in letters (not pixels)
        //  You can set a fixed size here.
        //  Or set to -1 means it'll adapt to fit the longest word in the words array.
        this.puzzleWidth = -1;
        this.puzzleHeight = -1;

        //  The size of each letter sprite sheet, in pixels
        this.tileWidth = 100;
        this.tileHeight = 100;

        //  The selection line color and thickness
        this.drawLineColor = 0x00BAD2;
        this.drawLineAlpha = 0.6;
        this.drawLineThickness = 26;

        //  A tint applied to the letters when a word is found
        this.highlightTint = 0xffff00;

        //  Booleans to control the game during play
        this.drawLine = null;

        this.isSelecting = false;
        this.firstLetter = null;
        this.endLetter = null;

        this.foundWords = [];

        this.featureWord = null;

        this.mapWords();

    }

    mapWords()
    {
        const wordMap = {};
        const wordsArray = [];
        const words = this.config.words;
        
        let letters = this.letters;

        words.forEach((word)=>{
            wordMap[word.word] = word;
            wordsArray.push(word.word);
            letters = letters.concat(word.word.split(''));
        })

        this.letters = letters;
        this.words = wordsArray;
        this.wordMap = wordMap;
    }

    preload()
    {
        const letters = this.letters;
        const letterCount = letters.length;
        for(let i = 0; i < letterCount; i++)
        {
            let letter = letters[i];

            // let letterLowercase = letter.toLowerCase();

            let tileImage = this.cache.getImage('tile');
            let tileImageBlockWidth = tileImage.width / 2;
            let tileImageBlockHeight = tileImage.height / 2;

            let bitmap = this.add.bitmapData(tileImage.width, tileImage.height);
            bitmap.clear();

            let context = bitmap.context;
            context.drawImage(tileImage, 0,0, tileImage.width, tileImage.height);
            context.font = "bold 35px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle"
            context.fillText(letter,tileImageBlockWidth / 2 ,tileImage.height / 2);
            context.fillText(letter,tileImageBlockWidth + (tileImageBlockWidth / 2) ,tileImage.height / 2);

            let letterBitmapData = bitmap.canvas.toDataURL();  
            
            this.load.spritesheet(letter, letterBitmapData, this.tileWidth, this.tileHeight);
        }

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

    create () {

        this.stage.backgroundColor = '#A5572C';
        const background = this.add.sprite(0, -50, 'background');
        background.scale.setTo(0.5,0.5);
        
        //  Generate a new Word Search puzzle, and store the size of it.

        if (this.puzzleWidth !== -1)
        {
            this.puzzle = wordfind.newPuzzle(this.words, { width: this.puzzleWidth, height: this.puzzleHeight, letters:this.letters });
        }
        else
        {
            this.puzzle = wordfind.newPuzzle(this.words, {letters:this.letters});
            this.puzzleWidth = this.puzzle[0].length;
            this.puzzleHeight = this.puzzle.length;
        }

        //  Solve the puzzle (i.e. find all of the words within it, and store it)

        var solution = wordfind.solve(this.puzzle, this.words, this.letters);

        this.solution = solution.found;

        //  Un-comment these to Debug the puzzle, the first outputs the puzzle to the console
        //  The second outputs the answers object

        // wordfind.print(this.puzzle);
        // console.log(this.solution);

        //  Create the letter tile grid
        var x = 0;
        var y = 0;
        var _this = this;

        this.grid = this.add.group();
        this.grid.inputEnableChildren = true;

        this.puzzle.forEach(function(row) {

            row.forEach(function(letter) {

                var tile = _this.grid.create(x, y, letter, 0);

                tile.data.row = x / _this.tileWidth;
                tile.data.column = y / _this.tileHeight;
                tile.data.words = {};
                tile.data.letter = letter;
                tile.data.startWord = false;

                tile.events.onInputDown.add(_this.startLetterSelect, _this);
                tile.events.onInputUp.add(_this.stopLetterSelect, _this);
                tile.events.onInputOver.add(_this.overLetter, _this);
                tile.events.onInputOut.add(_this.outLetter, _this);

                x += _this.tileWidth;

            });

            x = 0;
            y += _this.tileHeight;

        });



        //  Flag all of the starting letters in the grid
        this.solution.forEach(function(entry) {

            //  Based on the grid position we can get the tile index
            var index = (entry.y * _this.puzzleWidth) + entry.x;
            var tile = _this.grid.getChildAt(index);

            tile.data.startWord = true;
            tile.data.words[entry.word] = { orientation: entry.orientation, length: entry.word.length };

        });

        //  This controls the position and scale of the word search grid
        //  Setting the width / height automatically scales the Group
        //  If you remove this, the tiles will be displayed at their full size
        //
        //  Use it to position the grid within your game, and make sure it fits
        //  no matter how many words are in it.

        this.grid.x = 25;
        this.grid.y = 50;
        this.grid.width = 500;
        this.grid.height = 500;

        //  Display the words to find down the right-hand side, and add to the wordList object

        y = 45;

        const wordGroup = this.add.group();
        
        this.solution.forEach((entry)=> {
            
            const word = this.wordMap[entry.word];

            //  One BitmapText per word (so we can change their color when found)            
            let textGroup = this.make.group();
            let wordText = this.make.text(0,0, word.word, { font: "bold 25px Arial", autoUpperCase:true, fill: "#FFFFFF" });
            let translatedText = this.make.text(0,30, `${word.translation}`, { font: "bold 15px Arial", autoUpperCase:true, fill: "#000000" });

            textGroup.add(wordText);
            textGroup.add(translatedText);
            wordGroup.add(textGroup);
            
            wordText.inputEnabled = true;
            wordText.events.onInputDown.add(this.selectFeatureWord,this);
            wordText.data = entry;
            wordText.input.useHandCursor = true;

            let wordAudio = this.add.audio(entry.word);
            
            const wordFeature = this.createWordFeature(entry);


            this.wordList[entry.word] = {
                text:wordText,
                audio:wordAudio,
                wordFeature:wordFeature
            };
            y += 50;

        });

        wordGroup.align(4,4,200,55);
        wordGroup.y = this.game.height - 230;
        wordGroup.x = 40;

        const title = this.add.text(0, 0, 'Wordsearch' ,{ font: "bold 25px Arial", autoUpperCase:true, fill: "#000000",align:'center' });
        title.anchor.set(0.5);
        title.x = this.game.width / 2;
        title.y = 30

        this.drawLine = this.add.graphics(0, 0);

        this.input.addMoveCallback(this.updateDrawLine, this);

        this.fadeIn();
    }

    playAudio(word)
    {
        this.wordList[word].audio.play();
    }

    createWordFeature(entry)
    {
        const wordData = this.wordMap[entry.word];

        const wordImage = this.make.image(0,0,wordData.word);
        wordImage.width = 200;
        wordImage.height = 200;

        const graphics = this.make.graphics(0, 0);
        graphics.lineStyle(4, 0xFFFFFF, 1);
        graphics.drawRect(0,0, 200, 200);

        const word = this.make.text(0, 210, wordData.word ,{ font: "bold 25px Arial", autoUpperCase:true, fill: "#FFFFFF"});
        const translation = this.make.text(0, 240, wordData.translation, { font: "bold 20px Arial", autoUpperCase:true, fill: "#000000"})
        const playAudio = this.make.image(0,270,'playAudio');
        playAudio.width = 25;
        playAudio.height = 25;
        playAudio.inputEnabled = true;
        playAudio.events.onInputUp.add(this.playAudio.bind(this, entry.word));
        playAudio.input.useHandCursor = true;

        const wordFeature = this.game.add.group();
        wordFeature.add(wordImage);
        wordFeature.add(graphics);
        wordFeature.add(word);
        wordFeature.add(translation);
        wordFeature.add(playAudio);
        wordFeature.x = this.game.width - 235;
        wordFeature.y = 55;
        wordFeature.visible = false;

        return wordFeature;
    }

    selectFeatureWord(text)
    {

        if(this.featureWord !== null)
        {
            this.featureWord.visible = false;
        }

        const word = this.wordList[text.data.word];
        word.wordFeature.visible = true;
        this.featureWord = word.wordFeature;

        this.playAudio(text.data.word);
    }


    render()
    {
        this.words.forEach((word)=>{
            this.game.debug.body(this.wordList[word], "red", false);
        })

    }

    /**
     * Draws the selection line, showing which letter tiles are being selected.
     */
    updateDrawLine (pointer, x, y) {

        if (!this.isSelecting)
        {
            return;
        }

        var tw = (this.tileWidth * this.firstLetter.worldScale.x) / 2;
        var th = (this.tileHeight * this.firstLetter.worldScale.y) / 2;

        this.drawLine.clear();
        this.drawLine.lineStyle(this.drawLineThickness, this.drawLineColor, this.drawLineAlpha);
        this.drawLine.moveTo(this.firstLetter.worldPosition.x + tw, this.firstLetter.worldPosition.y + th);
        this.drawLine.lineTo(x, y);

    }

    /**
     * Called when the mouse is pressed down on any of the letter tiles.
     */
    startLetterSelect (letter) {

        this.isSelecting = true;

        this.firstLetter = letter;

    }

    /**
     * Called when the mouse is released from any of the letter tiles.
     * This performs all of the core checks in terms of if they've selected
     * a full word, won the game, etc.
     */
    stopLetterSelect (letter) {

        this.isSelecting = false;

        //  Let's check to see if they selected an actual word :)
        if (this.firstLetter && this.endLetter &&
            this.firstLetter !== this.endLetter &&
            (this.firstLetter.data.startWord || this.endLetter.data.startWord) &&
            this.checkLetterAlignment(this.endLetter))
        {
            var result = this.checkSelectedLetters();

            if (result)
            {
                this.highlightCorrectWord(result);
                this.foundWords.push(result.word);
            }

            //  Check word list, game won?
            if (this.foundWords.length === this.solution.length)
            {
                this.gameWon();
            }
        }

        this.grid.setAll('frame', 0);

        this.clearLine();

    }

    /**
     * Clears the selection line, and resets the first and last letters.
     */
    clearLine () {

        this.firstLetter = false;
        this.endLetter = null;

        this.drawLine.clear();

    }

    /**
     * Called from within stopLetterSelect and both tints the BitmapText word
     * on the right-hand side, and also tints each tile that was matched.
     *
     * If you're going to use a different kind of effect, then you probably want
     * to edit or skip most of this function.
     */
    highlightCorrectWord (result) {

        var _this = this;

        //  result contains the sprites of the letters, the word, etc.
        const word = this.wordList[result.word]

        word.text.tint = this.highlightTint;

        this.selectFeatureWord(word.text);
        
        result.letters.forEach(function(letter) {
            letter.tint = _this.highlightTint;
        });

    }

    /**
     * Called by the letter tile input handler when it is moused over.
     * In short, it checks if it should swap frame or not.
     */
    overLetter (letter) {

        if (this.isSelecting)
        {
            if (this.checkLetterAlignment(letter))
            {
                this.endLetter = letter;

                //  Highlight the tiles below the line (if any)
                var selection = this.getSelectedLetters();

                if (selection && selection.letters.length > 0)
                {
                    this.grid.setAll('frame', 0);

                    selection.letters.forEach(function(sprite) {
                        sprite.frame = 1;
                    });
                }
            }
        }
        else
        {
            letter.frame = 1;
        }

    }

    /**
     * Swaps the letter frame back, if not in selecting mode.
     */
    outLetter (letter) {

        if (!this.isSelecting)
        {
            letter.frame = 0;
        }

    }

    /**
     * Called once all words have been found.
     */
    gameWon () {

        //  They've matched every word!

    }

    //  From this point on, all of the functions deal with checking the letters,
    //  getting selected letters, and checking for word matching. There is no
    //  display related code in any of the following, it's all game logic.

    checkLetterAlignment (letter) {

        var startRow = this.firstLetter.data.row;
        var startColumn = this.firstLetter.data.column;
        var endRow = letter.data.row;
        var endColumn = letter.data.column;

        return (startColumn === endColumn || startRow === endRow || Math.abs(endColumn - startColumn) === Math.abs(endRow - startRow));

    }

    getLetterAt (row, column) {

        var index = (column * this.puzzleWidth) + row;

        return this.grid.getChildAt(index);

    }

    getSelectedLetters () {

        if (!this.firstLetter || !this.endLetter || this.endLetter === this.firstLetter)
        {
            return false;
        }

        var first = this.firstLetter.data;
        var last = this.endLetter.data;
        var tile;
        var letters = [];
        var x, y, top, bottom, left, right;

        //  Let's get all the letters between the first and end letters
        var selectedLetters = [];

        if (first.row === last.row)
        {
            //  Vertical grab

            top = Math.min(first.column, last.column);
            bottom = Math.max(first.column, last.column);

            for (y = top; y <= bottom; y++)
            {
                tile = this.getLetterAt(first.row, y);
                letters.push(tile);
                selectedLetters.push(tile.data.letter);
            }
        }
        else if (first.column === last.column)
        {
            //  Horizontal grab

            left = Math.min(first.row, last.row);
            right = Math.max(first.row, last.row);

            for (x = left; x <= right; x++)
            {
                tile = this.getLetterAt(x, first.column);
                letters.push(tile);
                selectedLetters.push(tile.data.letter);
            }
        }
        else
        {
            top = Math.min(first.column, last.column);
            bottom = Math.max(first.column, last.column);
            left = Math.min(first.row, last.row);
            right = Math.max(first.row, last.row);

            if (first.column > last.column && first.row < last.row)
            {
                //  Diagonal NE grab (up and from left to right)
                y = bottom;

                for (x = left; x <= right; x++)
                {
                    tile = this.getLetterAt(x, y);
                    letters.push(tile);
                    selectedLetters.push(tile.data.letter);
                    y--;
                }
            }
            else if (first.column < last.column && first.row < last.row)
            {
                //  Diagonal SE grab (down and from left to right)
                y = top;

                for (x = left; x <= right; x++)
                {
                    tile = this.getLetterAt(x, y);
                    letters.push(tile);
                    selectedLetters.push(tile.data.letter);
                    y++;
                }
            }
            else if (first.column < last.column && first.row > last.row)
            {
                //  Diagonal SW grab (down and from right to left)
                y = top;

                for (x = right; x >= left; x--)
                {
                    tile = this.getLetterAt(x, y);
                    letters.push(tile);
                    selectedLetters.push(tile.data.letter);
                    y++;
                }
            }
            else if (first.column > last.column && first.row > last.row)
            {
                //  Diagonal NW grab (up and from right to left)
                y = bottom;

                for (x = right; x >= left; x--)
                {
                    tile = this.getLetterAt(x, y);
                    letters.push(tile);
                    selectedLetters.push(tile.data.letter);
                    y--;
                }
            }
            else
            {
                return false;
            }
        }

        var selectedWord = selectedLetters.join('');
        var inverseSelectedWord = selectedLetters.reverse().join('');

        return { word: selectedWord, inverse: inverseSelectedWord, letters: letters };

    }

    checkSelectedLetters () {

        var selection = this.getSelectedLetters();
        
        if (selection)
        {
            var starter = (this.firstLetter.data.startWord) ? this.firstLetter.data : this.endLetter.data;

            for (var word in starter.words)
            {   
                if (word === selection.word || word === selection.inverse)
                {
                    return { word: word, letters: selection.letters };
                }
            }
        }

        return false;

    }
}

export default Main;