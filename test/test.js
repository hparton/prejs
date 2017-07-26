import PreJS from '../dist/loader.js'

const loader = new PreJS()

let $audio = document.querySelector('.audio-percentage');
let $img = document.querySelector('.img-percentage');

let urls = [
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'http://i.imgur.com/fHyEMsl.jpg',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'https://ia802508.us.archive.org/5/items/testmp3testfile/mpthreetest.mp3',
	'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
]

loader.on('start', () => { console.log('Started Loader') })

loader.on('progress', progress => {
	document.querySelector('.js-bar').style.width = progress * 100 + '%'
})

loader.on('loaded', item => {
	console.log('Loaded: ', item.url)
	$img.innerHTML = loader.progress * 100
})

loader.on('error', item => console.log('Errored: ', item.url))

loader.on('complete', (items) => {
	for (var i = items.length - 1; i >= 0; i--) {
		if (items[i].asset) {
			document.body.appendChild(items[i].asset)
			console.log(items[i].asset)
		}
	}
})

loader.load(urls)