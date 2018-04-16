window.requestAnimFrame = (() =>
	window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || ((callback, element) => window.setTimeout(callback, 1000 / 60))
)()

getRandomFloat = (min, max) => Math.random() * (max - min) + min

getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)