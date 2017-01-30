class Main {

    init(){

        //  This is your word list. Add or remove any words you like in here.
        //  The words mustn't contain any spaces or numbers.

        //  The shorter the array, the larger the letter tiles will scale in-game.

        this.words = ['atari', 'firstvoices', 'canada', 'vancouver', 'spectrum', 'nintendo',
                    'sega', 'playstation', 'xbox', 'coleco', 'retro', 'superfamicom',
                    'nes', 'sonic', 'mario', 'masterchief', 'msx', 'gameboy', 'jaguar'];

        this.letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        this.puzzle = null;
        this.solution = null;

        //  The BitmapFont word list down the side
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

        this.stage.backgroundColor = '#00BAD2';

        //  Generate a new Word Search puzzle, and store the size of it.

        if (this.puzzleWidth !== -1)
        {
            this.puzzle = wordfind.newPuzzle(this.words, { width: this.puzzleWidth, height: this.puzzleHeight });
        }
        else
        {
            this.puzzle = wordfind.newPuzzle(this.words);
            this.puzzleWidth = this.puzzle[0].length;
            this.puzzleHeight = this.puzzle.length;
        }

        //  Solve the puzzle (i.e. find all of the words within it, and store it)

        var solution = wordfind.solve(this.puzzle, this.words);

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

        this.grid.x = 50;
        this.grid.y = 50;
        this.grid.width = 500;
        this.grid.height = 500;

        //  Display the words to find down the right-hand side, and add to the wordList object

        y = 10;

        this.solution.forEach(function(entry) {

            //  One BitmapText per word (so we can change their color when found)
            _this.wordList[entry.word] = _this.add.bitmapText(500, y, 'azo', entry.word, 28);
            _this.wordList[entry.word].right = 780;
            y += 28;

        });

        //  The Graphics object that controls the letter selection line

        this.drawLine = this.add.graphics(0, 0);

        //  This starts a callback going, that updates whenever the mouse moves,
        //  and calls updateDrawLine. All of the main game logic happens as a result
        //  of events triggered within here, and the letter tile input handlers.

        this.input.addMoveCallback(this.updateDrawLine, this);

        this.fadeIn();

    }

    /**
     * Draws the selection line, showing which letter tiles are being selected.
     */
    updateDrawLine (pointer, x, y) {

        if (!this.isSelecting)
        {
            return;
        }

        this.drawLine.clear();

        this.drawLine.lineStyle(this.drawLineThickness, this.drawLineColor, this.drawLineAlpha);

        var tw = (this.tileWidth * this.firstLetter.worldScale.x) / 2;
        var th = (this.tileHeight * this.firstLetter.worldScale.y) / 2;

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
        this.wordList[result.word].tint = this.highlightTint;

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
        var selectedWord = '';
        var x, y, top, bottom, left, right;

        //  Let's get all the letters between the first and end letters

        if (first.row === last.row)
        {
            //  Vertical grab

            top = Math.min(first.column, last.column);
            bottom = Math.max(first.column, last.column);

            for (y = top; y <= bottom; y++)
            {
                tile = this.getLetterAt(first.row, y);
                letters.push(tile);
                selectedWord = selectedWord.concat(tile.data.letter);
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
                selectedWord = selectedWord.concat(tile.data.letter);
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
                    selectedWord = selectedWord.concat(tile.data.letter);
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
                    selectedWord = selectedWord.concat(tile.data.letter);
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
                    selectedWord = selectedWord.concat(tile.data.letter);
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
                    selectedWord = selectedWord.concat(tile.data.letter);
                    y--;
                }
            }
            else
            {
                return false;
            }
        }

        return { word: selectedWord, inverse: Phaser.Utils.reverseString(selectedWord), letters: letters };

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