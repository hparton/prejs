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

    for (var i = 0; i < this.itemsToLoad.length; i++) {
      let item = this.itemsToLoad[i]
      this._loadItem(item, type)
    }
  }

  _reset (items) {
    this.itemsToLoad = items
    this.total = this.itemsToLoad.length
    this.itemsLoaded = 0
    this.progress = 0
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
      this._loadImage(item)
    }
  }

  _loadImage (item) {
    var img = new Image()

    img.onload = () => {
      this._itemLoaded(item)
    }

    img.onerror = () => {
      this._emitError(item)
    }

    img.src = item
  }

  _emitError (item) {
    this.trigger('error', item)
    this.itemsLoaded += 1
    this._updateProgress()
    this._checkComplete()
  }

  _itemLoaded (item) {
    this.trigger('loaded', item)
    this.itemsLoaded += 1
    this._updateProgress()
    this._checkComplete()
  }

  _checkComplete () {
    if (this.itemsLoaded === this.total) {
      this.trigger('complete')
    }
  }

  _updateProgress () {
    this.progress = mapRange(this.itemsLoaded, 0, this.total, 0, 1)
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

function mapRange (value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1)
}

export default PreJS