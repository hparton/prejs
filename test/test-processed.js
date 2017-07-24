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
  function PreJS(opts) {
    _classCallCheck(this, PreJS);

    this.itemsToLoad = [];
    this.total = 0;
    this.itemsLoaded = 0;
    this.progress = 0;
    this._handlers = [];
  }

  _createClass(PreJS, [{
    key: '_canLoadUsingXHR',
    value: function _canLoadUsingXHR() {
      return typeof XMLHttpRequest !== 'undefined';
    }
  }, {
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
      this.itemsToLoad = this._setupItems(items);
      this.total = this.itemsToLoad.length;
      this.itemsLoaded = 0;
      this.progress = 0;
    }
  }, {
    key: '_setupItems',
    value: function _setupItems(items) {
      var processedItems = [];

      for (var i = 0; i < items.length; i++) {
        processedItems.push({
          url: items[i],
          progress: 0
        });
      }

      return processedItems;
    }
  }, {
    key: '_loadItem',
    value: function _loadItem(item, loader) {
      this.trigger('loading', item);

      // Check if a custom loader was supplied
      if (typeof loader === 'function') {
        loader.apply(this, [item]);
        return;
      }

      // These loaders have better browser support and can
      // be used for cross-origin requests

      // Use the 'new Image()' method instead.
      if (loader === 'image' || this.isImage(item)) {
        console.log('Used image');
        this.imageLoader(item);
        return;
      }

      // Use the 'new Audio()' method instead.
      if (loader === 'audio' || this.isAudio(item)) {
        console.log('Used audio');
        this.audioLoader(item);
        return;
      }

      // Fallback to new XMLHttpRequest() loader.
      if (typeof loader === 'undefined' && this._canLoadUsingXHR()) {
        this.loader(item);
        return;
      }

      // Daym. We ain't got shit.
      if (typeof loader === 'undefined') {
        console.error('No loader available');
        return;
      }

      console.error('Not a valid loader type');
    }
  }, {
    key: 'checkExtension',
    value: function checkExtension(url, extensions) {
      var extension = url.split('.').pop();
      for (var i = extensions.length - 1; i >= 0; i--) {
        if (extensions[i] === extension) return true;
      }

      return false;
    }
  }, {
    key: 'isImage',
    value: function isImage(item) {
      return this.checkExtension(item.url, ['jpg', 'png']);
    }
  }, {
    key: 'isAudio',
    value: function isAudio(item) {
      return this.checkExtension(item.url, ['mp3', 'ogg']);
    }
  }, {
    key: 'loader',
    value: function loader(item) {
      var _this = this;

      console.warn('Using Fallback');
      var xhr = new XMLHttpRequest();

      // Use 'readystatechange' instead of 'load' since 'load' fires
      // as soon as the request receives a response.
      xhr.addEventListener('readystatechange', function (e) {
        // 4 === complete
        if (xhr.readyState === 4) {
          // Instantly set the progress to complete.
          _this._itemProgress(item, 1);
        }
      });

      xhr.addEventListener('error', function (e) {
        _this._emitError(item);
      });

      // Increment as we go, leads to a smoother overall increase in percentage.
      xhr.addEventListener('progress', function (e) {
        if (e.lengthComputable) {
          var percentage = e.loaded / e.total;
          _this._itemProgress(item, percentage);
        }
      });

      // Get our data.
      xhr.open('GET', item.url);
      xhr.send();
    }
  }, {
    key: 'imageLoader',
    value: function imageLoader(item) {
      var _this2 = this;

      var img = new Image();

      img.onload = function () {
        _this2._itemProgress(item, 1);
      };

      img.onerror = function () {
        _this2._emitError(item);
      };

      img.src = item.url;
    }
  }, {
    key: 'audioLoader',
    value: function audioLoader(item) {
      var _this3 = this;

      var audio = new Audio();

      // 'canplaythrough' is fired when the browser has enough data loaded and
      // based on your internet speed can finish loading before you catch up to
      // the end of the buffer. Good enough for preloading for me.
      audio.addEventListener('canplaythrough', function () {
        _this3._itemProgress(item, 1);
      }, false);

      audio.addEventListener('error', function () {
        _this3._emitError(item);
      });

      audio.src = item.url;
      audio.load();
    }
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
  }, {
    key: '_itemLoaded',
    value: function _itemLoaded(item) {
      this.itemsLoaded += 1;
      // Check all of the items in the loader are now complete
      this._checkComplete();
      this.trigger('loaded', item);
    }
  }, {
    key: '_emitError',
    value: function _emitError(item) {
      this.trigger('error', item);
      // NOTE: May be worth having an option to fail early on errors, otherwise set progress
      // to complete so it doesn't block the overall loader.on('complete') event.
      this._itemProgress(item, 1);
      this._updateProgress();
      this._checkComplete();
    }
  }, {
    key: '_checkComplete',
    value: function _checkComplete() {
      // All of the items have fired their 'loaded' events, so we are done!
      if (this.itemsLoaded === this.total) {
        this.trigger('complete', this.itemsToLoad);
      }
    }
  }, {
    key: '_updateProgress',
    value: function _updateProgress() {
      // Add up all of the progress for each item
      var overallProgress = this.itemsToLoad.reduce(function (sum, current) {
        return sum + current.progress;
      }, 0);

      // Map this between 0 - X (items.length), to 0 - 1 so its useful for loading bars, etc...
      this.progress = mapRange(overallProgress, 0, this.total, 0, 1);
      this.trigger('progress', this.progress);
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

function limitRange(val, low, high) {
  return Math.min(Math.max(parseInt(val), low), high);
}

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
const testLoader = new __WEBPACK_IMPORTED_MODULE_0__dist_loader_js___default.a()

let $audio = document.querySelector('.audio-percentage');
let $img = document.querySelector('.img-percentage');

let images = [
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3'
]

let audio = [
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'http://www.sample-videos.com/audio/mp3/india-national-anthem.mp3'
]

imgPreload.on('start', () => bark('Started Image Loader'))
audioPreload.on('start', () => bark('Started Audio Loader'))

imgPreload.on('progress', progress => {
	// console.log(progress)
	document.querySelector('.js-bar').style.width = progress * 100 + '%'
})

imgPreload.on('loaded', (item) => {
	bark(item.url, 'Image Loaded: ')
	$img.innerHTML = imgPreload.progress * 100
})
audioPreload.on('loaded', (item) => {
	bark(item.url, 'Audio Loaded: ')
	$audio.innerHTML = audioPreload.progress * 100
})

imgPreload.on('error', (item) => bark(item.url, 'Image Errored: '))
audioPreload.on('error', (item) => bark(item.url, 'Audio Errored: '))

imgPreload.on('complete', (items) => {
	for (var i = items.length - 1; i >= 0; i--) {
		let img = document.createElement('img')
		img.src = items[i].url
		document.body.appendChild(img)
	}
})

imgPreload.load(images)
// audioPreload.load(audio, 'audio')

function bark (string, loader) {
	if (loader) {
		// console.log(loader + string)
	} else {
		// console.log(string)
	}
}

/***/ })
/******/ ]);