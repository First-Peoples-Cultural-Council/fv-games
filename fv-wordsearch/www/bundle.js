webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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

/* harmony default export */ exports["a"] = Boot;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class GameOver {

    create(){

    }

    restartGame()
    {
        this.game.state.start("GameTitle");
    }
}

/* harmony default export */ exports["a"] = GameOver;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
class GameTitle {

    create(){
        this.game.state.start("Main");
    }

    startGame()
    {
        // this.game.state.start("Main");
    }
}

/* harmony default export */ exports["a"] = GameTitle;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
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

/* harmony default export */ exports["a"] = Main;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

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

/* harmony default export */ exports["a"] = Preload;


/***/ },
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(16)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./node_modules/css-loader/index.js!./style.css", function() {
			var newContent = require("!!./node_modules/css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)();
// imports


// module
exports.push([module.i, "body {\n    margin:0;\n    padding:0;\n}\n\ncanvas {\n    border:2px solid #000\n}\n\n#game {\n    width: 800px;\n    height: 600px;\n    margin: auto;\n    position: relative;\n    top: 35px;\n}", ""]);

// exports


/***/ },
/* 11 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__style_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__style_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__js_boot__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__js_preload__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__js_gametitle__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__js_main__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__js_gameover__ = __webpack_require__(2);
//Styles


//Scenes







(()=>{
    const game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');
    //Add all states
    game.state.add("Boot", __WEBPACK_IMPORTED_MODULE_1__js_boot__["a" /* default */]);
    game.state.add("Preload", __WEBPACK_IMPORTED_MODULE_2__js_preload__["a" /* default */]);
    game.state.add("GameTitle", __WEBPACK_IMPORTED_MODULE_3__js_gametitle__["a" /* default */]);
    game.state.add("Main", __WEBPACK_IMPORTED_MODULE_4__js_main__["a" /* default */]);
    game.state.add("GameOver", __WEBPACK_IMPORTED_MODULE_5__js_gameover__["a" /* default */]);

    //Start the first state
    game.state.start("Boot");
})()

/***/ }
],[17]);