import PreJS from '../dist/loader.js'

const audioPreload = new PreJS()
const imgPreload = new PreJS()
const testLoader = new PreJS()

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