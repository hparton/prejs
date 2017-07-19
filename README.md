# PreJS [![npm version](https://badge.fury.io/js/prejs.svg)](https://badge.fury.io/js/prejs)

A lightweight preloading javascript library without any dependencies.

## Installation

### Using npm

```sh
$ npm install prejs --save
```

### Using Yarn

```sh
$ yarn add prejs
```

## Usage

```js
import PreJS from 'prejs';
const pre = new PreJS();

let imageUrls = ['example.jpg', 'example.png', 'example.svg'];
pre.load(imageUrls, 'image');
```

## Events

| Event     | Returns      | Description                                                                          |
|-----------|--------------|--------------------------------------------------------------------------------------|
| start     |              | Fired when attempting to load the first item							              |
| loaded    | url (string) | Fired after each item is loaded		                                              |
| error     | url (string) | Fired after an item fails to load correctly										  |
| complete  |   		   | Fired when all items loaded or errored out                                           |


## API

#### load(urls, loader)
Accepts an array of urls and a loader type to handle them.

Built in loaders are:
- 'image' : Loads .jpg, .png, .svg, .jpeg and anything else Image() accepts

```js
pre.load([url1, url2, url3], loader)

// loader can be a string:
pre.load([url1, url2, url3], 'image')

// or your own function:
pre.load([url1, url2, url3], (item) => {
	console.log(item)
	customLoadingFunction(() => {
		pre.loaded(item)
	})
})
```

#### on(event)
Add an event listener to different events.

```js
pre.on('loaded', (item) => {
	console.log('loaded:', item)
})
```

#### trigger(event)
Trigger all event listeners for an event.

```js
pre.trigger('loaded', item)
```

### Example:
```js
import PreJS from 'prejs'

const pre = new PreJS()
let imageUrls = ['example.jpg', 'example.png', 'example.svg']

pre.on('start', () => {
	console.log('Started preloading items')
})

pre.on('loaded', (item) => {
	console.log('loaded:', item)
	// pre.percentage is available if you wanted to show a custom loading indicator, you can update it here
})

pre.on('complete', () => {
	console.log('All items pre-loaded, you can do a cb here.')
})

pre.load(imageUrls, 'image')
```