/* ----------------------------------------------------------------------------
 * common parameters
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu hooraypikachu@gmail.com
 * -------------------------------------------------------------------------- */

// image parameters
// someone told me that hiding library elements in the DOM is fun... @God Seven do you think so? >.O
const glowBig = document.getElementById('glow-big')
const radiusBig = 6
const glowSmall = document.getElementById('glow-small')
const radiusSmall = 3
const kittyIcon = document.getElementById('kitty')
const kittySize = 300

// other const parameters
const gridSize = 12
const gravity = 0.06

// functions
const easeInOutQuad = (t, b, c, d) => (t /= d / 2) < 1 ? (c / 2 * t * t + b) : (- c / 2 *((--t) * (t - 2) - 1) + b)