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

    create()
    {
        //  The fill color comparison tolerance.
        //  Between 0 (no comparison at all during fill) and 255.
        //  Realistically you wouldn't usually put this larger than 128.
        this.tolerance = 50;

        this.thumbnails = null;

        this.key = '';

        this.bmd = null;
        this.bmdContainer = null;

        this.color = null;

        this.saveIcon = null;
        this.printIcon = null;

        this.swatch = null;
        this.selectedColor = null;
        this.swatchColorWidth = 16;
        this.swatchColorHeight = 30;

        //  Textured paper background
        // this.add.sprite(0, 0, 'paper');
        this.createThumbnails();
        this.fadeIn();
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
     * Here we loop through and create 4 thumbnails, for each of the 4 pictures you can
     * color in. Each one is input enabled, and when you mouse-over it, it'll scale and
     * rotate slightly to indicate an over state.
     */
    createThumbnails () {

        this.thumbnails = this.add.group();

        this.thumbnails.inputEnableChildren = true;

        this.thumbnails.createMultiple(1, ['thumb1', 'thumb2', 'thumb3', 'thumb4'], 0, true);

        this.thumbnails.setAll('input.useHandCursor', 'input', true);
        this.thumbnails.callAll('anchor.set', 'anchor', 0.5);

        this.thumbnails.align(2, 2, 400, 300, Phaser.CENTER);

        this.thumbnails.onChildInputOver.add(this.overThumb, this);
        this.thumbnails.onChildInputOut.add(this.outThumb, this);
        this.thumbnails.onChildInputUp.add(this.selectThumb, this);

    }

    /**
     * Called when the mouse is over a thumbnail. Applies a small scale and rotation.
     */
    overThumb (thumbnail) {

        thumbnail.scale.set(1.1);
        thumbnail.angle = 4;

    }

    /**
     * Called when the mouse leaves a thumbnail. Removes the small scale and rotation.
     */
    outThumb (thumbnail) {

        thumbnail.scale.set(1);
        thumbnail.angle = 0;

    }

    /**
     * Called when the player clicks a thumbnail.
     * Sets the local proper `this.key` to be the picture the user selected.
     */
    selectThumb (thumbnail) {

        this.key = thumbnail.key.replace('thumb', 'picture');

        this.thumbnails.destroy();

        this.start();

    }

    /**
     * This is the meat of the set-up, called when a thumbnail is picked.
     * It creates the BitmapData that will be filled, and places the rest of the game
     * UI into the scene (the icons and so on). See the comments within this function
     * for more details.
     */
    start () {

        //  The BitmapData on which the fill takes place
        this.bmd = this.add.bitmapData();

        //  Load the black and white outline picture into it.
        this.bmd.load(this.key);

        //  And add it to the world, so it becomes visible.
        this.bmdContainer = this.bmd.addToWorld();

        //  Enable input for this sprite, so we can tell when it's clicked.
        this.bmdContainer.inputEnabled = true;
        this.bmdContainer.events.onInputDown.add(this.fill, this);

        //  This just centers it in the bottom-middle of the screen.
        this.bmdContainer.centerX = this.world.centerX;
        this.bmdContainer.bottom = this.game.height;

        //  This applies a small alpha to the image, allowing you to see
        //  the paper texture through it. You can remove this depending
        //  on what your requirements are.
        this.bmdContainer.alpha = 1;

        //  A copy of the image to be filled, placed over the top of the canvas
        //  This keeps the outline fresh, no matter how much filling takes place
        //  It could also contain a watermark or similar.
        var overlay = this.add.sprite(0, 0, this.key);
        overlay.x = this.bmdContainer.x;
        overlay.y = this.bmdContainer.y;
        overlay.alpha = this.bmdContainer.alpha;

        //  The save icon
        this.saveIcon = this.add.sprite(8, 456, 'save');
        this.saveIcon.inputEnabled = true;
        this.saveIcon.input.useHandCursor = true;
        this.saveIcon.events.onInputUp.add(this.save, this);

        //  The print icon
        this.printIcon = this.add.sprite(8, 528, 'print');
        this.printIcon.inputEnabled = true;
        this.printIcon.input.useHandCursor = true;
        this.printIcon.events.onInputUp.add(this.print, this);

        //  The palette swatch
        //  This is just a PNG we created in PhotoShop, that detects clicks on it.
        //  We then get the pixel color value from the swatch click, and use that
        //  as the new fill color. You could replace this technique with anything
        //  you require, or replace this swatch image. All that matters is that
        //  the fill color is loaded somehow.
        this.swatch = this.add.bitmapData();
        this.swatch.load('swatch');

        var swatchContainer = this.swatch.addToWorld();

        swatchContainer.inputEnabled = true;

        swatchContainer.events.onInputDown.add(this.pickColor, this);

        //  A little sprite marker to show which color is currently selected
        //  in our swatch.
        this.selectedColor = this.add.sprite(0, 0, 'selected');

        //  Pick a default color
        this.pickColor(null, { x: 360, y: 0 });

    }

    /**
     * When the mouse is pressed down on the color swatch Sprite, this function
     * is called. All it does is get the pixel color value from the underlying
     * BitmapData, and set that into the `this.color` property. Finally the
     * swatch selector sprite is moved.
     */
    pickColor (sprite, pointer) {

        if (pointer.y <= 60)
        {
            var x = pointer.x;
            var y = pointer.y;

            //  Get the color from the swatch
            var pixel = this.swatch.getPixel32(x, y);

            //  Use this function to normalize between big and little endian
            this.color = Phaser.Color.unpackPixel(pixel);

            //  And update the swatch color selection marker
            this.selectedColor.x = this.math.snapToFloor(x, this.swatchColorWidth);

            if (y < 30)
            {
                this.selectedColor.y = 0;
            }
            else
            {
                this.selectedColor.y = 30;
            }
        }

    }

    /**
     * Called when the picture is clicked.
     *
     * Simple calculates the x and y value of the click, and passes that along with the
     * currently selected color to the BitmapData.floodFill routine.
     *
     * After filling the 'outline' is re-applied, so it never gets destroyed by the fill
     * process. If you are using a tolerance of 0 then this doesn't need to happen, we
     * only do it because our outline is aliased slightly.
     */
    fill (sprite, pointer) {

        if (pointer.y < 64)
        {
            return;
        }

        this.bmd.floodFill(
            pointer.x - this.bmdContainer.x,
            pointer.y - this.bmdContainer.y,
            this.color.r,
            this.color.g,
            this.color.b,
            this.color.a,
            this.tolerance);

        //  After filling, we'll re-apply the outline, so it never gets 'destroyed' by the fill
        this.bmd.copy(this.key);

        //  And update the pixel data, ready for the next fill
        this.bmd.update();

    }

    /**
     * Called when the user clicks the Print icon.
     *
     * Opens a printer dialog with the image on.
     */
    print () {

        //  You can add whatever HTML you need here, such as a logo, or copyright text,
        //  and it will be printed along with the image.

        var win = window.open();
        win.document.write("<br><img src='" + this.bmd.canvas.toDataURL() + "'/>");
        win.print();
        win.location.reload();

    }

    /**
     * Called when the user clicks the Save icon.
     *
     * Saves the colored-in image, without the paper texture. If you want to
     * include the paper texture, or maybe add in your own watermark, then you
     * could create a temporary BitmapData and draw the various elements to it,
     * then use that in the `toBlob` call below instead.
     *
     * Note that this operation is browser / device specific, i.e. it won't work
     * on iOS, but does work on desktop browsers.
     */
    save () {

        var _this = this;

        this.bmd.canvas.toBlob(function(blob) {
            saveAs(blob, _this.key + ".png");
        });
    }

    update()
    {

    }

    gameOver()
    {
        this.game.state.start("GameOver");
    }
}

/* harmony default export */ exports["a"] = Main;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";

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
    const game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');
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