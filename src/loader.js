class PreJS {
  constructor () {
    this.itemsToLoad = []
    this.total = 0
    this.itemsLoaded = 0
    this.progress = 0
    this._handlers = []
  }

  load (items, type) {
    this.trigger('start', items)
    this._reset(items)
    console.log(this.itemsToLoad)
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

    if (typeof loader === 'function') {
      loader.apply(this, [item])
      return
    }

    if (typeof loader === 'undefined') {
      console.error('Either pass through a string with the loading strategy or a function to handle it: the current item is available as the first argument')
      return
    }

    if (loader === 'image') {
      this._genericLoader(item)
      return
    }

    if (loader === 'audio') {
      this._genericLoader(item)
      return
    }

    console.error('Not a valid loader type')
  }

  _genericLoader (item) {
    let xhr = new XMLHttpRequest()

    xhr.addEventListener('load', this._itemProgress(item, 1))

    xhr.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        let percentage = e.loaded / e.total
        this._itemProgress(item, percentage)
      }
    })

    xhr.open('GET', item.url)
    xhr.send()
  }

  _loadImage (item) {
    var img = new Image()

    img.onload = () => {
      this._itemProgress(item, 1)
    }

    img.onerror = () => {
      this._emitError(item)
    }

    img.src = item.url
  }

  _loadAudio (item) {
    let audio = new Audio()

    audio.addEventListener('canplaythrough', () => {
      this._itemProgress(item, 1)
    }, false)

    audio.addEventListener('error', () => {
      this._emitError(item)
    })

    audio.src = item.url
    audio.load()
  }

  _emitError (item) {
    this.trigger('error', item)
    this.itemsLoaded += 1
    this._updateProgress()
    this._checkComplete()
  }

  _itemProgress (item, progress) {
    item.progress = progress
    this._updateProgress()

    if (item.progress === 1) {
      this._itemLoaded(item)
    }
  }

  _itemLoaded (item) {
    this.itemsLoaded += 1
    this._checkComplete()
    this.trigger('loaded', item)
  }

  _checkComplete () {
    if (this.itemsLoaded === this.total) {
      this.trigger('complete', this.itemsToLoad)
    }
  }

  _updateProgress () {
    let overallProgress = 0;

    this.itemsToLoad.map(item => {
      overallProgress += item.progress
    })

    this.progress = mapRange(overallProgress, 0, this.total, 0, 1)
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