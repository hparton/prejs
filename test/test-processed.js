/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * PreJS is a simple preloader, originally part of Viva Le Velo. It was taken
 * out and expanded upon in my own time, feel free to use it as you wish. Just
 * don't claim it as your own and it's not my fault if it breaks.
 *
 * @author  hparton
 * @version  1.2.5
 * @created_at 22/06/2017
 * @updated_at 26/07/2017
 */
var PreJS = function () {
  /**
   * PreJS Constructor
   */
  function PreJS() {
    _classCallCheck(this, PreJS);

    this.itemsToLoad = [];
    this.total = 0;
    this.itemsLoaded = 0;
    this.progress = 0;
    this._handlers = [];
  }

  /**
   * Add extra information to the urls passed through to the loader,
   * like progress and a place to store the final asset when loaded.
   * @param  {Array} items Array of item urls
   * @return {Array}       Array of item objects
   */


  _createClass(PreJS, [{
    key: '_setupItems',
    value: function _setupItems(items) {
      var processed = [];

      for (var i = 0; i < processed.length; i++) {
        processed.push({
          url: items[i],
          progress: 0,
          asset: false
        });
      }

      return processed;
    }

    /**
     * Reset the loader to a fresh state, resetting the progress
     * and itemsToLoad array.
     * @param  {Array} items Array of item urls
     */

  }, {
    key: '_reset',
    value: function _reset(items) {
      this.itemsToLoad = this._setupItems(items);
      this.total = this.itemsToLoad.length;
      this.itemsLoaded = 0;
      this.progress = 0;
    }

    /**
     * Start loading all of the items in itemsToLoad.
     * @param  {Array} items Items
     * @param  {Mixed} type A string to denote which loader to use, or a custom function
     */

  }, {
    key: 'load',
    value: function load(items, type) {
      if (typeof items === 'string') {
        items = [items];
      }

      this.dispatch('start', items);
      this._reset(items);

      for (var i = 0; i < this.itemsToLoad.length; i++) {
        var item = this.itemsToLoad[i];
        this._loadItem(item, type);
      }
    }

    /**
     * Determine the correct loader to use for each item, this can
     * be passed in or guessed based on the item.url file extension.
     * @param  {Array} item   Array of item objects
     * @param  {Mixed} loader A string to denote which loader to use, or a custom function
     */

  }, {
    key: '_loadItem',
    value: function _loadItem(item, loader) {
      this.dispatch('loading', item);

      // Check if a custom loader was supplied
      if (typeof loader === 'function') {
        loader.apply(this, [item]);
        return;
      }

      // Use the 'new Image()' method instead.
      if (loader === 'image' || this.isImage(item)) {
        this.imageLoader(item);
        return;
      }

      // Use the 'new Audio()' method instead.
      if (loader === 'audio' || this.isAudio(item)) {
        this.audioLoader(item);
        return;
      }

      if (loader === 'video' || this.isVideo(item)) {
        this.videoLoader(item);
        return;
      }

      // Daym. We ain't got shit.
      if (typeof loader === 'undefined') {
        throw new Error('No loader available');
      }

      throw new Error('Not a valid loader type');
    }

    /**
     * Check if the url extension matches any in the given array.
     * @param  {String} url        Full url for the item to load
     * @param  {Array} extensions  Array of possible extensions to match against
     * @return {Boolean}
     */

  }, {
    key: 'checkExtension',
    value: function checkExtension(url, extensions) {
      var extension = url.split('.').pop();
      for (var i = extensions.length - 1; i >= 0; i--) {
        if (extensions[i] === extension) return true;
      }

      return false;
    }

    /**
     * Wrapper for checkExtension for Images.
     * @return {Boolean}
     */

  }, {
    key: 'isImage',
    value: function isImage(item) {
      return this.checkExtension(item.url, ['jpg', 'jpeg', 'gif', 'apng', 'bmp', 'bmp ico', 'ico', 'png', 'svg']);
    }

    /**
     * Wrapper for checkExtension for Audio.
     * @return {Boolean}
     */

  }, {
    key: 'isAudio',
    value: function isAudio(item) {
      return this.checkExtension(item.url, ['mp3', 'wav', 'ogg']);
    }

    /**
     * Wrapper for checkExtension for Video.
     * @return {Boolean}
     */

  }, {
    key: 'isVideo',
    value: function isVideo(item) {
      return this.checkExtension(item.url, ['mp4', 'ogv', 'webm']);
    }

    /**
     * Loader for images, uses the html <img> element and events.
     * @param  {Object} item
     */

  }, {
    key: 'imageLoader',
    value: function imageLoader(item) {
      var _this = this;

      var img = new Image();

      img.addEventListener('load', function () {
        _this._itemProgress(item, 1);
      });

      img.addEventListener('error', function () {
        _this._emitError(item);
      });

      img.src = item.url;

      item.asset = img;
    }

    /**
     * Loader for audio, uses the html <audio> element and events.
     *
     * Will not load the full audio using this strategy, instead will
     * load a buffer. Size of the buffer depends on internet speed.
     *
     * @param  {Object} item
     */

  }, {
    key: 'audioLoader',
    value: function audioLoader(item) {
      var _this2 = this;

      var audio = new Audio();

      // 'canplaythrough' is fired when the browser has enough data loaded and
      // based on your internet speed can finish loading before you catch up to
      // the end of the buffer. Good enough for preloading for me.
      audio.addEventListener('canplaythrough', function () {
        _this2._itemProgress(item, 1);
      }, false);

      audio.addEventListener('error', function () {
        _this2._emitError(item);
      });

      audio.src = item.url;
      audio.load();

      item.asset = audio;
    }

    /**
     * Loader for video, uses XMLHttpRequest() instead of the video element.
     *
     * Will load the full video using this strategy, at the cost of browser
     * support. Requires IE10+ since we are using Blob objects. May be able
     * to get this to IE9+ if we use ArrayBuffer instead.
     *
     * TODO: Add Check if window.URL.createObjectURL is supported and try a fallback
     *
     * @param  {Object} item
     */

  }, {
    key: 'videoLoader',
    value: function videoLoader(item) {
      var _this3 = this;

      var xhr = new XMLHttpRequest();
      xhr.open('GET', item.url, true);
      xhr.responseType = 'blob';

      xhr.onreadystatechange = function (e) {
        if (xhr.readyState === 4) {
          var blob = xhr.response;

          var video = document.createElement('video');

          video.onload = function () {
            window.URL.revokeObjectURL(video.src);
          };

          video.src = window.URL.createObjectURL(blob);
          item.asset = video;

          _this3._itemProgress(item, 1);
        }
      };

      xhr.onerror = function () {
        _this3._emitError(item);
      };

      xhr.onprogress = function (e) {
        if (e.lengthComputable && xhr.readyState !== 4) {
          _this3._itemProgress(item, e.loaded / e.total);
        }
      };
      xhr.send();
    }

    /**
     * Update the progress of an individual item and the overall loader.
     * @param  {Object} item
     * @param  {Number} progress Current progress from 0 - 1
     */

  }, {
    key: '_itemProgress',
    value: function _itemProgress(item, progress) {
      item.progress = progress;
      // Update the overall progress of the loader.
      this._updateProgress();

      // Item is fully loaded, send the 'loaded' event.
      if (item.progress === 1) {
        this._itemLoaded(item);
      }
    }

    /**
     * Emit the loaded event for an individual item.
     * @param  {Object} item
     */

  }, {
    key: '_itemLoaded',
    value: function _itemLoaded(item) {
      this.itemsLoaded += 1;
      // Check all of the items in the loader are now complete
      this._checkComplete();
      this.dispatch('loaded', item);
    }

    /**
     * Emit the error event for an individual item.
     * @param  {Obeject} item
     */

  }, {
    key: '_emitError',
    value: function _emitError(item) {
      this.dispatch('error', item);
      // NOTE: May be worth having an option to fail early on errors, otherwise set progress
      // to complete so it doesn't block the overall loader.on('complete') event.
      this._itemProgress(item, 1);
      this._updateProgress();
      this._checkComplete();
    }

    /**
     * Update the overall progress of the loader by adding each items progress together
     * and mapping the result to a value between 0 - 1.
     */

  }, {
    key: '_updateProgress',
    value: function _updateProgress() {
      // Add up all of the progress for each item
      var overallProgress = this.itemsToLoad.reduce(function (sum, current) {
        return sum + current.progress;
      }, 0);

      // Map this between 0 - X (items.length), to 0 - 1 so its useful for loading bars, etc...
      this.progress = mapRange(overallProgress, 0, this.total, 0, 1);
      this.dispatch('progress', this.progress);
    }

    /**
     * Check if all of the loader items have loaded/failed, dispatch the
     * 'complete' event if they have.
     */

  }, {
    key: '_checkComplete',
    value: function _checkComplete() {
      // All of the items have fired their 'loaded' events, so we are done!
      if (this.itemsLoaded === this.total) {
        this.dispatch('complete', this.itemsToLoad);
      }
    }

    /**
     * External wrapper for custom loader functions.
     */

  }, {
    key: 'loaded',
    value: function loaded(item) {
      this._itemLoaded(item);
    }

    /**
     * Execute any callbacks assigned to a specific event.
     * @param  {String} event  Name of the event
     * @param  {Mixed} params  Any params passed through
     */

  }, {
    key: 'dispatch',
    value: function dispatch(event, params) {
      for (var i = 0; i < this._handlers.length; i++) {
        if (this._handlers[i].event === event) {
          this._handlers[i].cb(params);
        }
      }
    }

    /**
     * Add a callback to to a specific event, will be called when
     * dispatch() is run.
     * @param  {String}   event Name of the event
     * @param  {Function} cb
     */

  }, {
    key: 'on',
    value: function on(event, cb) {
      this._handlers.push({ event: event, cb: cb });
    }
  }]);

  return PreJS;
}();

/**
 * Map a value from one range to another.
 * e.g.
 * mapRange(5, 0, 10, 0, 1)
 * 5 between 0 - 10 would be mapped to 0.5 between 0 - 1
 *
 * @param  {Number} value Value
 * @param  {Number} low1  Lowest point of range value is from
 * @param  {Number} high1 Highest point of range value is from
 * @param  {Number} low2  Lowest point of range you want the value to be in
 * @param  {Number} high2 Highest point of range you want the value to be in
 * @return {Number}       Value mapped to the new range
 */


function mapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

exports.default = PreJS;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_loader_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dist_loader_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__dist_loader_js__);


const loader = new __WEBPACK_IMPORTED_MODULE_0__dist_loader_js___default.a()

let $audio = document.querySelector('.audio-percentage');
let $img = document.querySelector('.img-percentage');

let urls = [
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
]

loader.on('start', () => { console.log('Started Loader') })

loader.on('progress', progress => {
	document.querySelector('.js-bar').style.width = progress * 100 + '%'
})

loader.on('loaded', item => {
	console.log('Loaded: ', item.url)
	$img.innerHTML = loader.progress * 100
})

loader.on('error', item => console.log('Errored: ', item.url))

loader.on('complete', (items) => {
	for (var i = items.length - 1; i >= 0; i--) {
		if (items[i].asset) {
			document.body.appendChild(items[i].asset)
			console.log(items[i].asset)
		}
	}
})

loader.load(urls)

/***/ })
/******/ ]);