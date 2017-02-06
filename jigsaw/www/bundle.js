webpackJsonp([0],[
/* 0 */,
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

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

/* harmony default export */ __webpack_exports__["a"] = Boot;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class GameOver {

    create(){

    }

    restartGame()
    {
        this.game.state.start("GameTitle");
    }
}

/* harmony default export */ __webpack_exports__["a"] = GameOver;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = GameTitle;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Main {

    init(data){

        this.states = {
            SELECTING:0,
            PLACING:1,
            DROPPING:2
        };

        this.image = data.img;

        this.puzzleWidth = data.width;
        this.puzzleHeight = data.height;

        this.lineWidth = 3;
        this.lineStyle = 'rgba(255, 255, 255, 0.7)';

        //  The size of the circles used for hit testing (to see if a piece is put
        //  in the right place). Circle to Circle intersection tests are used.
        //  Each jigsaw piece has a circle in its center, and there is one mapped
        //  to the pointer / mouse.
        //  If you look in the render function you'll see a way to visualise the hit circles.
        //  For very dense jigsaws (with tiny pieces) you'll need to adjust this value.
        this.hitCircleSize = 32;
        this.hitTestCircle = new Phaser.Circle(0, 0, this.hitCircleSize);

        //  A flag that hides all of the other currently un-set jigsaw pieces when you
        //  pick a new one up. Toggle it to see the difference.
        this.hidePiecesOnPickup = true;

        //  The current piece being dragged
        this.current = null;

        //  A shadow (appears below the currently dragged piece)
        this.shadow = null;

        //  The Group of piece Sprites
        this.pieces = null;

        //  A Sprite that appears on completion
        this.wellDone = null;

        this.action = this.states.SELECTING;

    }

    create()
    {
        this.fadeIn();


        //  The background wood texture
        this.add.sprite(0, 0, 'wood');

        //  The BitmapData that contains the selected image.
        var bmd = this.make.bitmapData();

        //  Load the image into it.
        bmd.load(this.image);

        //  And chop it up! This function will cut the BitmapData up, returning an object full of new
        //  pieces (each one a canvas). You can log out the data object to see its contents.
        var data = bmd.jigsawCut(this.puzzleWidth, this.puzzleHeight, this.lineWidth, this.lineStyle);

        console.log(data);
        //  A Group that all the jigsaw pieces will be put in.
        this.pieces = this.add.group();

        //  Center the jigsaw group
        this.pieces.x = (this.game.width - data.width) / 2;
        this.pieces.y = (this.game.height - data.height) / 2;

        this.pieces.inputEnableChildren = true;

        var coords = [];

        //  Here we loop through each piece in the data object.
        //  This creates a Sprite from each piece, using the piece canvas as the texture.
        //  The pieces are positioned perfectly, creating the final 'assembled' picture.
        //  A Circle object is created for each 'correct' piece, and input events are set-up.
        for (var x = 0; x < data.pieces.length; x++)
        {
            var column = data.pieces[x];

            for (var y = 0; y < column.length; y++)
            {
                var pieceData = column[y];

                var piece = this.pieces.create(pieceData.x, pieceData.y, PIXI.Texture.fromCanvas(pieceData.canvas));

                piece.input.enableDrag(false, false, true);

                piece.events.onDragStop.add(this.dropPiece, this);

                var cx = this.pieces.x + piece.centerX;
                var cy = this.pieces.y + piece.centerY;

                coords.push({ x: piece.x, y: piece.y });

                piece.data.correct = false;
                piece.data.dropX = pieceData.x;
                piece.data.dropY = pieceData.y;
                piece.data.hitCircle = new Phaser.Circle(cx, cy, this.hitCircleSize);
                piece.data.textureNoOutline = PIXI.Texture.fromCanvas(pieceData.canvasNoOutline);
            }
        }

        //  This shuffles up the piece coords, placing the jigsaw pieces in different locations.
        coords = Phaser.ArrayUtils.shuffle(coords);

        var i = 0;
        var _this = this;

        //  And this adds a little variance (+- 32 pixels) to every piece, and a slight angle
        //  (between +- 6 degrees). In short, this mixes up our pieces so they're no longer
        //  in the right place on the board. You can tweak the various values here for a more
        //  dramatic, or subtle, effect. If you don't want the pieces rotated then simply
        //  comment out the `child.angle` line.
        coords.forEach(function(coord) {
            var child = _this.pieces.getChildAt(i);
            child.x = coords[i].x + _this.rnd.between(-32, 32);
            child.y = coords[i].y + _this.rnd.between(-32, 32);
            child.angle = _this.rnd.between(-6, 6);
            i++;
        });

        //  Add our Shadow piece. This appears below the piece being dragged.
        this.shadow = this.pieces.create(0, 0);
        this.shadow.data.correct = true;
        this.shadow.visible = false;
        this.shadow.input.enabled = false;

        //  Add the corner sprites, to help with jigsaw alignment when playing.
        //
        //  Each corner is 48x48 pixels in size, aligned to the four
        //  edges of the pieces Group.
        //  You can comment out this whole section if you don't need this.

        this.add.sprite(this.pieces.x, this.pieces.y, 'corner1a');
        this.add.sprite(this.pieces.x + data.width - 48, this.pieces.y, 'corner1b');
        this.add.sprite(this.pieces.x, this.pieces.y + data.height - 48, 'corner1c');
        this.add.sprite(this.pieces.x + data.width - 48, this.pieces.y + data.height - 48, 'corner1d');

        //  The Well Done sprite that appears on completion
        this.wellDone = this.add.sprite(0, 0, 'wellDone');
        this.wellDone.centerX = this.world.centerX;
        this.wellDone.visible = false;

        //  Start the event handler going
        this.pieces.onChildInputDown.add(this.selectPiece, this);

        this.action = this.states.SELECTING;

    }

    /**
     * Called when a piece is picked-up.
     * It's responsible for creating a new shadow piece below it, and fading out the other
     * pieces if set.
     */
    selectPiece (piece) {

        if (this.action !== this.states.SELECTING || piece.data.correct)
        {
            return;
        }

        this.current = piece;

        this.action = this.states.PLACING;

        //  You want the piece to be straight when trying to place it.
        piece.angle = 0;

        //  Creates the shadow sprite below the piece.
        this.shadow.loadTexture(piece.texture);
        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.5;
        this.shadow.x = piece.x + 8;
        this.shadow.y = piece.y + 8;
        this.shadow.visible = true;

        //  We need the shadow at the top of the Group ...
        this.shadow.bringToTop();

        //  ... but obviously behind the piece being dragged
        piece.bringToTop();

        //  Fade out the other un-sorted pieces
        if (this.hidePiecesOnPickup)
        {
            this.pieces.forEach(this.hidePiece, this);
        }

    }

    /**
     * Hides a single piece of the jigsaw. This is a simple linear tween.
     */
    hidePiece (piece) {

        if (piece !== this.current && piece.data.correct === false)
        {
            this.add.tween(piece).to({ alpha: 0 }, 100, "Linear", true);
        }

    }

    /**
     * Shows a single piece of the jigsaw. This is a simple linear tween.
     */
    showPiece (piece) {

        if (piece !== this.current && piece.data.correct === false)
        {
            this.add.tween(piece).to({ alpha: 1 }, 250, "Linear", true);
        }

    }

    dropPiece(sprite, pointer)
    {
       this.hitTestCircle.x = this.pieces.x + sprite.centerX;
        this.hitTestCircle.y = this.pieces.y + sprite.centerY;

        //  Does the piece being dragged intersect with its hit circle?
        //  i.e. the place where it _should_ actually be dropped.
        if (Phaser.Circle.intersects(this.hitTestCircle, this.current.data.hitCircle))
        {
            //  Yup! So we'll enter DROPPING mode, and tween the piece into place.
            sprite.data.correct = true;
            sprite.input.enabled = false;

            this.action = this.states.DROPPING;

            var tween = this.add.tween(sprite).to( { x: sprite.data.dropX, y: sprite.data.dropY }, 500, "Linear", true);

            tween.onComplete.addOnce(this.checkJigsaw, this);
        }
        else
        {
            //  No match, so we'll go back to SELECTING mode.
            this.action = this.states.SELECTING;

            //  Show the remaining pieces.
            if (this.hidePiecesOnPickup)
            {
                this.pieces.forEach(this.showPiece, this);
            }
        }

        //  Reset current and hide the shadow.
        this.current = false;
        this.shadow.visible = false;
    }

    /**
     * This is called after a piece is dropped into the area it is supposed to be put, and has
     * finished tweening into place. It then checks to see if the jigsaw is completed or not.
     */
    checkJigsaw (droppedPiece) {

        //  Put the dropped piece to the back of the Group.
        droppedPiece.sendToBack();

        //  Swap for our 'no outline' texture, so that the final picture appears seamless
        droppedPiece.loadTexture(droppedPiece.data.textureNoOutline);

        //  Count how many pieces are in the correct place?
        var correct = 0;

        this.pieces.forEach(function(piece) {
            if (piece.data.correct)
            {
                correct++;
            }
        });

        //  All of them, excellent, you've completed the jigsaw.
        if (correct === this.pieces.total)
        {
            //  Tween in our 'Well Done' sprite.
            this.wellDone.y = 0;
            this.wellDone.visible = true;

            var tween = this.add.tween(this.wellDone).to({ y: 250 }, 1500, "Bounce.easeOut", true);

            tween.onComplete.addOnce(this.puzzleComplete, this);
        }
        else
        {
            //  Not finished yet, go back into SELECTING mode.
            if (this.hidePiecesOnPickup)
            {
                this.pieces.forEach(this.showPiece, this);
            }

            this.action = this.states.SELECTING;
        }

    }


    /**
     * Called when the Well Done sprite has tweened into place.
     * Just waits for a click and then returns to pick a new puzzle.
     */
    puzzleComplete () {
        this.game.input.onDown.addOnce(this.chooseNewPuzzle, this);
    }

    chooseNewPuzzle () {
        this.state.start('GameTitle');
    }

    /**
     * In the preRender we update the position of the shadow sprite to match
     * the currently dragged piece (if there is one).
     */
    preRender () {

        if (this.current)
        {
            //  The 8 values is the offset of the shadow from the piece being dragged.
            this.shadow.x = this.current.x + 8;
            this.shadow.y = this.current.y + 8;
        }

    }
    update()
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

    gameOver()
    {
        this.game.state.start("GameOver");
    }
}

/* harmony default export */ __webpack_exports__["a"] = Main;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

class Preload {

    init()
    {
        this.loadingBar = this.game.make.sprite(this.game.world.centerX , 500, "loading");
        this.logo       = this.game.make.sprite(this.game.world.centerX, 250, 'brand');
        this.status     = this.game.make.text(this.game.world.centerX, 450, 'Loading...', {fill: 'black'});

        this.centerObjects([this.logo, this.status, this.loadingBar]);
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

        this.load.script('jigsaw', 'libs/BitmapDataJigsawCut.js');

        this.load.path = 'assets/game/';

        this.load.image('wood', 'wood.jpg');

        this.load.image('wellDone', 'well-done.png');

        this.load.images(['thumb1', 'thumb2', 'thumb3', 'thumb4']);
        this.load.images(['corner1a', 'corner1b', 'corner1c', 'corner1d']);

        this.load.image('picture1', 'picture1.jpg');
        this.load.image('picture2', 'picture2.jpg');
        this.load.image('picture3', 'picture3.jpg');
        this.load.image('picture4', 'picture4.jpg');
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
        this.fade("GameTitle");
    }
}

/* harmony default export */ __webpack_exports__["a"] = Preload;


/***/ }),
/* 6 */,
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(11)();
// imports


// module
exports.push([module.i, "body {\n    margin:0;\n    padding:0;\n}\n\ncanvas {\n    border:2px solid #000\n}\n\n#game {\n    width: 800px;\n    height: 600px;\n    margin: auto;\n    position: relative;\n    top: 35px;\n}", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports) {

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


/***/ }),
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports) {

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


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
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

/***/ })
],[17]);