/*!----------------------------------------------------------------------------
 * fireworks - canvas animation
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu pocketfish@yeah.net
 * --------------------------------------------------------------------------*/
 
const glowBig = document.getElementById('glow-small')
const glowSmall = document.getElementById('glow-small')
 
class Firework {
  constructor (position, target, velocity, size, colour, gravityForced) {
    this.alpha = 1
    this.position = position
    this.lastPosition = position
    this.target = target
    this.velocity = velocity
    this.grid = {x: colour % size, y: Math.floor(colour / size) * size / 10}
    this.colour = colour
    this.gravityForced = gravityForced
  }
  draw () {
    console.log('draw!!')
  }
  render () {
    console.log('render!!')
  }
  star () {
    console.log('star!!')
  }
  circle () {
    console.log('circle!!')
  }
  update () {
    console.log('update!!')
    return (false)
  }
}

class FireworkNight {
  constructor (mainCanvas, boomCanvas, colourNum) {
    this.mainCanvas = mainCanvas
    this.mainContext = mainCanvas.getContext('2d')
    this.boomCanvas = boomCanvas
    this.boomContext = boomCanvas.getContext('2d')
    this.fireworks = []
    this.colourNum = colourNum || 12
  }
  createFirework (position, target, velocity, colour, size, gravityForced) {
    position = position || {}
    target = target || {}
    velocity = velocity || {}   
    this.fireworks.push(new Firework(
      {
        x: position.x || this.mainCanvas.width * 0.5,
        y: position.y || this.mainCanvas.height + 10
      },
      {
        y: target.y || 150 + Math.random() * 100
      },
      {
        x: velocity.x || Math.random() * 3 - 1.5,
        y: velocity.y || 0
      },
      size || 12,
      colour || Math.floor(Math.random() * 100) * size,     
      gravityForced || false)
    )
  }
  setPalette () {
    this.boomCanvas.width = this.colourNum * 10
    this.boomCanvas.height = this.colourNum * 10
    for(let i = 0; i < 100; i++) {
      let colour = (i * this.colourNum)
      let gridX = colour % this.colourNum
      let gridY = Math.floor(colour / (this.colourNum * 10)) * this.colourNum
      this.boomContext.fillStyle = "hsl(" + Math.round(i * 3.6) + ",100%,60%)";
      this.boomContext.fillRect(gridX, gridY, this.colourNum, this.colourNum);
      this.boomContext.drawImage(glowBig, gridX, gridY)
    }
  }
  draw () {
    let n = this.fireworks.length   
    while(n--) {
      let firework = this.fireworks[n]
      if (firework.update()) {
        fireworks.splice(n, 1)
        if (!firework.gravityForced) {
          if (Math.random() < 0.8) {
            firework.star()
          } else {
            firework.circle()
          }
        }
      }
      firework.render()
    }
  }
  update () {
    this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
    requestAnimFrame(() => this.update()) // magic!! >< 
    this.draw()
  }
  bind () {
    document.addEventListener('click', () => this.createFirework(), false)
  }
  fireUp () {
    this.mainCanvas.width = document.getElementsByClassName('sky')[0].getBoundingClientRect().width
		this.mainCanvas.height = document.getElementsByClassName('sky')[0].getBoundingClientRect().height
    this.setPalette()
    this.bind()
    this.update()
  }
}

let tn = new FireworkNight(document.getElementById('fireworks'), document.getElementById('boom'))

tn.fireUp()