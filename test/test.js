import PreJS from '../dist/loader.js'

const audioPreload = new PreJS()
const imgPreload = new PreJS()

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