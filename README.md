<p align="center"><img width="250" src="https://user-images.githubusercontent.com/5281898/28754919-f3b59eea-7546-11e7-9b31-fda336e3bdb1.png" alt="PreJS"></p>

<p align="center">
  <a href="https://www.npmjs.com/package/prejs"><img src="https://badge.fury.io/js/prejs.svg" alt="npm version"></a>
  <a href="https://github.com/hparton/prejs/issues"><img src="https://img.shields.io/badge/issues-0-brightgreen.svg" alt="issues"></a>
  <a href="#"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="prs"></a>
</p>

## Introduction

PreJS is a lightweight preloading javascript library for images, video and audio without any dependencies.

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

<p align="center"><img src="https://user-images.githubusercontent.com/5281898/28755106-16fc4346-754b-11e7-91d7-e9cfe7fda9c9.gif" alt=""></p>

```js
import PreJS from 'prejs'

let $progress = document.querySelector('.progress')

let pre = new PreJS()
let images = [
  'http://i.imgur.com/Wo0Kyth.jpg',
  'http://i.imgur.com/5pKVfC1.jpg',
  'http://i.imgur.com/1yK4wnx.gif',
  'http://i.imgur.com/GsBSYth.mp4',
  'http://i.imgur.com/YUxVkvN.png',
  'http://i.imgur.com/68Tnk5j.jpg',
]

pre.on('start', () => {
  console.log('Starting')
})

pre.on('progress', progress => {
  $progress.style.width = progress * 100 + '%'
})

pre.load(images)
```

## Events

#### 'start'
Fired when the loader attempts to load the first item.

#### 'loaded'
Fired when an individual item is finished loading in, use this if you want a progressive indiciation of items loading.<br>
**Returns:** *[item](#item)*

#### 'error'
Fired when an individual item is fails to load, you can use this to handle image fallbacks.<br>
**Returns:** *[item](#item)*

#### 'progress'
Fired when the overall loader progress increases (due to an item loading/partially loading).<br>
**Returns:** *progress (number between 0 - 1)*

#### 'complete'
Fired when all items have either loaded or errored out.<br>
**Returns** *array of [items](#item)*

---

##### Item

| key | value | description |
| --- | --- | --- |
| url | string | The original url given to the loader |
| progress | number | A value between 0 - 1 showing the percentage loaded |
| asset | HTMLElement | Returns a html element (img, audio, video, etc..), this can be modified and appended to the page |

## API

#### load(urls, loader)
Accepts an array of urls and a loader type to handle them.

Built in loaders are:

##### 'image'
Loads .jpg, .png, .svg, .jpeg and anything else Image() accepts. Uses the Image() element to load in files.

##### 'audio'
Loads .mp3, .ogg, .wave and anything else Audio() accepts. Uses the Audio() element to load in files.

##### 'video'
Loads .mp4, .ogv, .webm files. Uses XMLHttpRequest to grab the full video, this unfortunately means that its IE10+ and restricted to same origin
unless the host has the correct Cross-Origin headers set.

**If a loader is not defined explicitly, PreJS will attempt to figure out which loader to use based on the file extension.**

```js
// loader can be a string:
pre.load([url1, url2, url3], 'image')

// loader can be undefined and PreJS will guess:
pre.load([url1, url2, url3])

// or your own function:
pre.load([url1, url2, url3], (item) => {
	console.log(item)
	customLoadingFunction(() => {
		pre.loaded(item)
	})
})
```

#### on(event, cb)
Add an event listener to different events.

```js
pre.on('loaded', (item) => {
	console.log('loaded:', item)
})
```

#### dispatch(event)
Dispatch all event listeners for an event.

```js
pre.dispatch('loaded', item)
```
