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

var PreJS = function () {
  function PreJS() {
    _classCallCheck(this, PreJS);

    this.itemsToLoad = [];
    this.total = 0;
    this.itemsLoaded = 0;
    this.progress = 0;
    this._handlers = [];
  }

  _createClass(PreJS, [{
    key: 'load',
    value: function load(items, type) {
      this.trigger('start', items);
      this._reset(items);

      for (var i = 0; i < this.itemsToLoad.length; i++) {
        var item = this.itemsToLoad[i];
        this._loadItem(item, type);
      }
    }
  }, {
    key: '_reset',
    value: function _reset(items) {
      this.itemsToLoad = items;
      this.total = this.itemsToLoad.length;
      this.itemsLoaded = 0;
      this.progress = 0;
    }
  }, {
    key: '_loadItem',
    value: function _loadItem(item, loader) {
      this.trigger('loading', item);

      if (typeof loader === 'function') {
        loader.apply(this, [item]);
        return;
      }

      if (typeof loader === 'undefined') {
        console.error('Either pass through a string with the loading strategy or a function to handle it: the current item is available as the first argument');
        return;
      }

      if (loader === 'image') {
        this._loadImage(item);
        return;
      }

      if (loader === 'audio') {
        this._loadAudio(item);
        return;
      }

      console.error('Not a valid loader type');
    }
  }, {
    key: '_loadImage',
    value: function _loadImage(item) {
      var _this = this;

      var img = new Image();

      img.onload = function () {
        _this._itemLoaded(item);
      };

      img.onerror = function () {
        _this._emitError(item);
      };

      img.src = item;
    }
  }, {
    key: '_loadAudio',
    value: function _loadAudio(item) {
      var _this2 = this;

      var audio = new Audio();

      audio.addEventListener('canplaythrough', function () {
        _this2._itemLoaded(item);
      }, false);

      audio.addEventListener('error', function () {
        _this2._emitError(item);
      });

      audio.src = item;
      audio.load();
    }
  }, {
    key: '_emitError',
    value: function _emitError(item) {
      this.trigger('error', item);
      this.itemsLoaded += 1;
      this._updateProgress();
      this._checkComplete();
    }
  }, {
    key: '_itemLoaded',
    value: function _itemLoaded(item) {
      this.itemsLoaded += 1;
      this._updateProgress();
      this._checkComplete();
      this.trigger('loaded', item);
    }
  }, {
    key: '_checkComplete',
    value: function _checkComplete() {
      if (this.itemsLoaded === this.total) {
        this.trigger('complete', this.itemsToLoad);
      }
    }
  }, {
    key: '_updateProgress',
    value: function _updateProgress() {
      this.progress = mapRange(this.itemsLoaded, 0, this.total, 0, 1);
    }
  }, {
    key: 'loaded',
    value: function loaded(item) {
      this._itemLoaded(item);
    }
  }, {
    key: 'trigger',
    value: function trigger(event, params) {
      for (var i = 0; i < this._handlers.length; i++) {
        if (this._handlers[i].event === event) {
          this._handlers[i].cb(params);
        }
      }
    }
  }, {
    key: 'on',
    value: function on(event, cb) {
      this._handlers.push({ event: event, cb: cb });
    }
  }]);

  return PreJS;
}();

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


const audioPreload = new __WEBPACK_IMPORTED_MODULE_0__dist_loader_js___default.a()
const imgPreload = new __WEBPACK_IMPORTED_MODULE_0__dist_loader_js___default.a()

let $audio = document.querySelector('.audio-percentage');
let $img = document.querySelector('.img-percentage');

let images = [
	'https://source.unsplash.com/user/erondu/1600x400',
	'https://source.unsplash.com/user/erondu/1600x900'
]

let audio = [
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3'
]

imgPreload.on('start', () => bark('Started Image Loader'))
audioPreload.on('start', () => bark('Started Audio Loader'))

imgPreload.on('loaded', (item) => {
	bark(item, 'Image Loaded: ')
	$img.innerHTML = imgPreload.progress * 100
})
audioPreload.on('loaded', (item) => {
	bark(item, 'Audio Loaded: ')
	$audio.innerHTML = audioPreload.progress * 100
})

imgPreload.on('error', (item) => bark(item, 'Image Errored: '))
audioPreload.on('error', (item) => bark(item, 'Audio Errored: '))

imgPreload.on('complete', (items) => bark(items, 'Image Complete: '))
audioPreload.on('complete', (items) => bark(items, 'Audio Complete: '))

imgPreload.load(images, 'image')
audioPreload.load(audio, 'audio')

function bark (string, loader) {
	if (loader) {
		console.log(loader + string)
	} else {
		console.log(string)
	}
}

/***/ })
/******/ ]);