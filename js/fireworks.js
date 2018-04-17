/*!----------------------------------------------------------------------------
 * fireworks - canvas animation
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu pocketfish@yeah.net
 * --------------------------------------------------------------------------*/
 
const glowBig = document.getElementById('glow-small')
const glowSmall = document.getElementById('glow-small')
 
class Firework {
  constructor (position, target, velocity, grid, colour, gravityForced) {
    this.alpha = 1
    this.position = position
    this.target = target
    this.velocity = velocity
    this.grid = grid
    this.colour = colour
    this.gravityForced = gravityForced
  }
  draw () {
    console.log('draw firework!!')
  }
}

class FireworkNight {
  constructor (mainCanvas, boomCanvas) {
    this.mainCanvas = mainCanvas
    this.mainContext = mainCanvas.getContext('2d')
    this.boomCanvas = boomCanvas
    this.boomContext = boomCanvas.getContext('2d')
  }
  draw () {
    console.log('hooray!!')
  }
  update () {
    this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
    requestAnimFrame(() => this.update()) // magic!! >< 
    this.draw()
  }
  fireUp () {
    this.mainCanvas.width = document.getElementsByClassName('sky')[0].getBoundingClientRect().width;
		this.mainCanvas.height = document.getElementsByClassName('sky')[0].getBoundingClientRect().height;
    this.update()
  }
}

let tn = new FireworkNight(document.getElementById('fireworks'), document.getElementById('boom'))

tn.fireUp()