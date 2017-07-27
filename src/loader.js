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
class PreJS {
  /**
   * PreJS Constructor
   */
  constructor () {
    this.itemsToLoad = []
    this.total = 0
    this.itemsLoaded = 0
    this.progress = 0
    this._handlers = []
  }

  /**
   * Add extra information to the urls passed through to the loader,
   * like progress and a place to store the final asset when loaded.
   * @param  {Array} items Array of item urls
   * @return {Array}       Array of item objects
   */
  _setupItems (items) {
    let processed = []

    for (var i = 0; i < items.length; i++) {
      processed.push({
        url: items[i],
        progress: 0,
        asset: false
      })
    }

    return processed
  }

  /**
   * Reset the loader to a fresh state, resetting the progress
   * and itemsToLoad array.
   * @param  {Array} items Array of item urls
   */
  _reset (items) {
    this.itemsToLoad = this._setupItems(items)
    this.total = this.itemsToLoad.length
    this.itemsLoaded = 0
    this.progress = 0
  }

  /**
   * Start loading all of the items in itemsToLoad.
   * @param  {Array} items Items
   * @param  {Mixed} type A string to denote which loader to use, or a custom function
   */
  load (items, type) {
    if (typeof items === 'string') {
      items = [items]
    }

    this.dispatch('start', items)
    this._reset(items)

    for (var i = 0; i < this.itemsToLoad.length; i++) {
      let item = this.itemsToLoad[i]
      this._loadItem(item, type)
    }
  }

  /**
   * Determine the correct loader to use for each item, this can
   * be passed in or guessed based on the item.url file extension.
   * @param  {Array} item   Array of item objects
   * @param  {Mixed} loader A string to denote which loader to use, or a custom function
   */
  _loadItem (item, loader) {
    this.dispatch('loading', item)

    // Check if a custom loader was supplied
    if (typeof loader === 'function') {
      loader.apply(this, [item])
      return
    }

    // Use the 'new Image()' method instead.
    if (loader === 'image' || this.isImage(item)) {
      this.imageLoader(item)
      return
    }

    // Use the 'new Audio()' method instead.
    if (loader === 'audio' || this.isAudio(item)) {
      this.audioLoader(item)
      return
    }

    if (loader === 'video' || this.isVideo(item)) {
      this.videoLoader(item)
      return
    }

    // Daym. We ain't got shit.
    if (typeof loader === 'undefined') {
      throw new Error('No loader available')
    }

    throw new Error('Not a valid loader type')
  }

  /**
   * Check if the url extension matches any in the given array.
   * @param  {String} url        Full url for the item to load
   * @param  {Array} extensions  Array of possible extensions to match against
   * @return {Boolean}
   */
  checkExtension (url, extensions) {
    let extension = url.split('.').pop()
    for (var i = extensions.length - 1; i >= 0; i--) {
      if (extensions[i] === extension) return true
    }

    return false
  }

  /**
   * Wrapper for checkExtension for Images.
   * @return {Boolean}
   */
  isImage (item) {
    return this.checkExtension(item.url, ['jpg', 'jpeg', 'gif', 'apng', 'bmp', 'bmp ico', 'ico', 'png', 'svg'])
  }

  /**
   * Wrapper for checkExtension for Audio.
   * @return {Boolean}
   */
  isAudio(item) {
    return this.checkExtension(item.url, ['mp3', 'wav', 'ogg'])
  }

  /**
   * Wrapper for checkExtension for Video.
   * @return {Boolean}
   */
  isVideo(item) {
    return this.checkExtension(item.url, ['mp4', 'ogv', 'webm'])
  }

  /**
   * Loader for images, uses the html <img> element and events.
   * @param  {Object} item
   */
  imageLoader (item) {
    var img = new Image()

    img.addEventListener('load', () => {
      this._itemProgress(item, 1)
    })

    img.addEventListener('error', () => {
      this._emitError(item)
    })

    img.src = item.url

    item.asset = img
  }

  /**
   * Loader for audio, uses the html <audio> element and events.
   *
   * Will not load the full audio using this strategy, instead will
   * load a buffer. Size of the buffer depends on internet speed.
   *
   * @param  {Object} item
   */
  audioLoader (item) {
    let audio = new Audio()

    // 'canplaythrough' is fired when the browser has enough data loaded and
    // based on your internet speed can finish loading before you catch up to
    // the end of the buffer. Good enough for preloading for me.
    audio.addEventListener('canplaythrough', () => {
      this._itemProgress(item, 1)
    }, false)

    audio.addEventListener('error', () => {
      this._emitError(item)
    })

    audio.src = item.url
    audio.load()

    item.asset = audio
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
  videoLoader (item) {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', item.url, true)
    xhr.responseType = 'blob'

    xhr.onreadystatechange = (e) => {
      if (xhr.readyState === 4) {
          let blob = xhr.response

          let video = document.createElement('video')

          video.onload = () => {
            window.URL.revokeObjectURL(video.src)
          }

          video.src = window.URL.createObjectURL(blob)
          item.asset = video

          this._itemProgress(item, 1)
      }
    }

    xhr.onerror = () => {
      this._emitError(item)
    }

    xhr.onprogress = (e) => {
      if(e.lengthComputable && xhr.readyState !== 4) {
        this._itemProgress(item, e.loaded/e.total)
      }
    }
    xhr.send()
  }

  /**
   * Update the progress of an individual item and the overall loader.
   * @param  {Object} item
   * @param  {Number} progress Current progress from 0 - 1
   */
  _itemProgress (item, progress) {
    item.progress = progress
    // Update the overall progress of the loader.
    this._updateProgress()

    // Item is fully loaded, send the 'loaded' event.
    if (item.progress === 1) {
      this._itemLoaded(item)
    }
  }

  /**
   * Emit the loaded event for an individual item.
   * @param  {Object} item
   */
  _itemLoaded (item) {
    this.itemsLoaded += 1
    // Check all of the items in the loader are now complete
    this._checkComplete()
    this.dispatch('loaded', item)
  }

  /**
   * Emit the error event for an individual item.
   * @param  {Obeject} item
   */
  _emitError (item) {
    this.dispatch('error', item)
    // NOTE: May be worth having an option to fail early on errors, otherwise set progress
    // to complete so it doesn't block the overall loader.on('complete') event.
    this._itemProgress(item, 1)
    this._updateProgress()
    this._checkComplete()
  }

  /**
   * Update the overall progress of the loader by adding each items progress together
   * and mapping the result to a value between 0 - 1.
   */
  _updateProgress () {
    // Add up all of the progress for each item
    let overallProgress = this.itemsToLoad.reduce((sum, current) => {
      return sum + current.progress
    }, 0)

    // Map this between 0 - X (items.length), to 0 - 1 so its useful for loading bars, etc...
    this.progress = mapRange(overallProgress, 0, this.total, 0, 1)
    this.dispatch('progress', this.progress)
  }

  /**
   * Check if all of the loader items have loaded/failed, dispatch the
   * 'complete' event if they have.
   */
  _checkComplete () {
    // All of the items have fired their 'loaded' events, so we are done!
    if (this.itemsLoaded === this.total) {
      this.dispatch('complete', this.itemsToLoad)
    }
  }

  /**
   * External wrapper for custom loader functions.
   */
  loaded (item) {
    this._itemLoaded(item)
  }

  /**
   * Execute any callbacks assigned to a specific event.
   * @param  {String} event  Name of the event
   * @param  {Mixed} params  Any params passed through
   */
  dispatch (event, params) {
    for (var i = 0; i < this._handlers.length; i++) {
      if (this._handlers[i].event === event) {
        this._handlers[i].cb(params)
      }
    }
  }

  /**
   * Add a callback to to a specific event, will be called when
   * dispatch() is run.
   * @param  {String}   event Name of the event
   * @param  {Function} cb
   */
  on (event, cb) {
    this._handlers.push({event, cb})
  }
}

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
function mapRange (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
}

export default PreJS