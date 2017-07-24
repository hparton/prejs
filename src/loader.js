class PreJS {
  constructor (opts) {
    this.itemsToLoad = []
    this.total = 0
    this.itemsLoaded = 0
    this.progress = 0
    this._handlers = []
  }

  _canLoadUsingXHR () {
    return typeof XMLHttpRequest !== 'undefined';
  }

  load (items, type) {
    this.trigger('start', items)
    this._reset(items)

    for (var i = 0; i < this.itemsToLoad.length; i++) {
      let item = this.itemsToLoad[i]
      this._loadItem(item, type)
    }
  }

  _reset (items) {
    this.itemsToLoad = this._setupItems(items)
    this.total = this.itemsToLoad.length
    this.itemsLoaded = 0
    this.progress = 0
  }

  _setupItems (items) {
    let processedItems = []

    for (var i = 0; i < items.length; i++) {
      processedItems.push({
        url: items[i],
        progress: 0
      })
    }

    return processedItems
  }

  _loadItem (item, loader) {
    this.trigger('loading', item)

    // Check if a custom loader was supplied
    if (typeof loader === 'function') {
      loader.apply(this, [item])
      return
    }

    // These loaders have better browser support and can
    // be used for cross-origin requests

    // Use the 'new Image()' method instead.
    if (loader === 'image' || this.isImage(item)) {
      console.log('Used image')
      this.imageLoader(item)
      return
    }

    // Use the 'new Audio()' method instead.
    if (loader === 'audio' || this.isAudio(item)) {
      console.log('Used audio')
      this.audioLoader(item)
      return
    }

    // Fallback to new XMLHttpRequest() loader.
    if (typeof loader === 'undefined' && this._canLoadUsingXHR()) {
      this.loader(item)
      return
    }

    // Daym. We ain't got shit.
    if (typeof loader === 'undefined') {
      console.error('No loader available')
      return
    }

    console.error('Not a valid loader type')
  }

  checkExtension (url, extensions) {
    let extension = url.split('.').pop()
    for (var i = extensions.length - 1; i >= 0; i--) {
      if (extensions[i] === extension) return true
    }

    return false
  }

  isImage (item) {
    return this.checkExtension(item.url, ['jpg', 'png'])
  }

  isAudio(item) {
    return this.checkExtension(item.url, ['mp3', 'ogg'])
  }

  loader (item) {
    console.warn('Using Fallback')
    let xhr = new XMLHttpRequest()

    // Use 'readystatechange' instead of 'load' since 'load' fires
    // as soon as the request receives a response.
    xhr.addEventListener('readystatechange', (e) => {
      // 4 === complete
      if (xhr.readyState === 4) {
        // Instantly set the progress to complete.
        this._itemProgress(item, 1)
      }
    });

    xhr.addEventListener('error', (e) => {
      this._emitError(item)
    })

    // Increment as we go, leads to a smoother overall increase in percentage.
    xhr.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        let percentage = e.loaded / e.total
        this._itemProgress(item, percentage)
      }
    })

    // Get our data.
    xhr.open('GET', item.url)
    xhr.send()
  }

  imageLoader (item) {
    var img = new Image()

    img.onload = () => {
      this._itemProgress(item, 1)
    }

    img.onerror = () => {
      this._emitError(item)
    }

    img.src = item.url
  }

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
  }

  _itemProgress (item, progress) {
    item.progress = progress
    // Update the overall progress of the loader.
    this._updateProgress()

    // Item is fully loaded, send the 'loaded' event.
    if (item.progress === 1) {
      this._itemLoaded(item)
    }
  }

  _itemLoaded (item) {
    this.itemsLoaded += 1
    // Check all of the items in the loader are now complete
    this._checkComplete()
    this.trigger('loaded', item)
  }

  _emitError (item) {
    this.trigger('error', item)
    // NOTE: May be worth having an option to fail early on errors, otherwise set progress
    // to complete so it doesn't block the overall loader.on('complete') event.
    this._itemProgress(item, 1)
    this._updateProgress()
    this._checkComplete()
  }

  _checkComplete () {
    // All of the items have fired their 'loaded' events, so we are done!
    if (this.itemsLoaded === this.total) {
      this.trigger('complete', this.itemsToLoad)
    }
  }

  _updateProgress () {
    // Add up all of the progress for each item
    let overallProgress = this.itemsToLoad.reduce((sum, current) => {
      return sum + current.progress
    }, 0)

    // Map this between 0 - X (items.length), to 0 - 1 so its useful for loading bars, etc...
    this.progress = mapRange(overallProgress, 0, this.total, 0, 1)
    this.trigger('progress', this.progress)
  }

  loaded (item) {
    this._itemLoaded(item)
  }

  trigger (event, params) {
    for (var i = 0; i < this._handlers.length; i++) {
      if (this._handlers[i].event === event) {
        this._handlers[i].cb(params)
      }
    }
  }

  on (event, cb) {
    this._handlers.push({event, cb})
  }
}

function limitRange (val, low, high) {
  return Math.min(Math.max(parseInt(val), low), high)
}

function mapRange (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
}

export default PreJS