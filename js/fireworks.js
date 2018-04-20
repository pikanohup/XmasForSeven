/*!----------------------------------------------------------------------------
 * fireworks - canvas animation
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu pocketfish@yeah.net
 * --------------------------------------------------------------------------*/
 
const glowBig = document.getElementById('glow-big')
const radiusBig = 6
const glowSmall = document.getElementById('glow-small')
const radiusSmall = 3
const gridSize = 12
 
class Firework {
  constructor (position, target, velocity, colour, gravityForced) {
    this.alpha = 1
    this.easing = Math.random() * 0.02
    this.fade = Math.random() * 0.1

    this.position = {x: position.x || 0, y: position.y || 0}
    this.lastPos = {x: position.x || 0, y: position.y || 0}
    this.target = {y: target.y || 0}
    this.velocity = {x: velocity.x || 0, y: velocity.y || 0}
    this.grid = {x: colour % (gridSize * 10), y: Math.floor(colour / (gridSize * 10)) * gridSize}
    this.colour = colour
    this.gravityForced = gravityForced || false
  }
  render (context, boom) {
    let x = Math.round(this.position.x),
        y = Math.round(this.position.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5

    context.save()
    context.globalCompositeOperation = 'lighter'
    context.globalAlpha = Math.random() * this.alpha

    context.fillStyle = "rgba(255,255,255,0.3)"
    context.beginPath()
    context.moveTo(this.position.x, this.position.y)
    context.lineTo(this.position.x + 1.5, this.position.y)
    context.lineTo(this.position.x + xVel, this.position.y + yVel)
    context.lineTo(this.position.x - 1.5, this.position.y)
    context.closePath()
    context.fill()

    context.drawImage(boom, this.grid.x, this.grid.y, radiusBig * 2, radiusBig * 2, x - radiusBig, y - radiusBig, radiusBig * 2, radiusBig * 2)
    context.drawImage(glowSmall, x - radiusSmall, y - radiusSmall)

    context.restore()
  }
  circle (night) {
    let count = 100, angle = (Math.PI * 2) / count
    while(count--) {
      let randomVelocity = 4 + Math.random() * 4,
          particleAngle = count * angle
      night.createFirework(
        this.position,
        null,
        {
          x: Math.cos(particleAngle) * randomVelocity,
          y: Math.sin(particleAngle) * randomVelocity
        },
        this.colour, true)
    }
  }
  star (night) {
    let points = 6 + Math.round(Math.random() * 15),
        jump = 3 + Math.round(Math.random() * 7),
        circle = Math.PI * 2,
        bias = Math.random() * Math.PI * 2,
        randomVelocity  = -(Math.random() * 3 - 6),
        subDivisions = 10, radius = 80, start = 0, end = 0
        
    do {
      start = end
      end = (end + jump) % points
      
      let sAngle = (start / points) * circle - bias,
          eAngle = ((start + jump) / points) * circle - bias,          
          startPos = {
            x: this.position.x + Math.cos(sAngle) * radius,
            y: this.position.y + Math.sin(sAngle) * radius
          },
          endPos = {
            x: this.position.x + Math.cos(eAngle) * radius,
            y: this.position.y + Math.sin(eAngle) * radius
          },
          diffPos = {
            x: endPos.x - startPos.x,
            y: endPos.y - startPos.y,
            a: eAngle - sAngle
          }
          
      for(let i = 0; i < subDivisions; i++) {
        let sub = i / subDivisions,
            subAngle = sAngle + (sub * diffPos.a)
        night.createFirework(
          {
            x: startPos.x + (sub * diffPos.x),
            y: startPos.y + (sub * diffPos.y)
          },
          null,
          {
            x: Math.cos(subAngle) * randomVelocity,
            y: Math.sin(subAngle) * randomVelocity
          },
          this.colour, true)
      }
    } while(end)
  }
  update (gravity) {
    this.lastPos.x = this.position.x
    this.lastPos.y = this.position.y
    if (this.gravityForced) {
      this.velocity.y += gravity
      this.position.y += this.velocity.y
      this.alpha -= this.fade
    } else {
      let distance = (this.target.y - this.position.y)
      this.position.y += distance * (0.03 + this.easing)
      this.alpha = Math.min(distance * distance * 0.00005, 1)
    }
    this.position.x += this.velocity.x
    return (this.alpha < 0.005)
  }
}

class FireworkNight {
  constructor (mainCanvas, boomCanvas, gravity) {
    this.mainCanvas = mainCanvas
    this.mainContext = mainCanvas.getContext('2d')
    this.boomCanvas = boomCanvas
    this.boomContext = boomCanvas.getContext('2d')
    this.fireworks = []
    this.gravity = gravity || 0.06
  }
  createFirework (position, target, velocity, colour, gravityForced) {
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
      colour || Math.floor(Math.random() * 100) * gridSize,
      gravityForced)
    )
  }
  setPalette () {
    this.boomContext.globalCompositeOperation = 'source-over'
    this.boomCanvas.width = gridSize * 10
    this.boomCanvas.height = gridSize * 10
    for (let i = 0; i < 100; i++) {
      let colour = (i * gridSize),
          gridX = colour % (gridSize * 10),
          gridY = Math.floor(colour / (gridSize * 10)) * gridSize
      this.boomContext.fillStyle = "hsl(" + Math.round(i * 3.6) + ",100%,60%)"
      this.boomContext.fillRect(gridX, gridY, gridSize, gridSize)
      this.boomContext.drawImage(glowBig, gridX, gridY)
    }
  }
  draw () {
    let n = this.fireworks.length
    while(n--) {
      let firework = this.fireworks[n]
      if (firework.update(this.gravity)) {
        this.fireworks.splice(n, 1)
        if (!firework.gravityForced) {
          if (Math.random() < 0.7) {
            firework.star(this)
          } else {
            firework.circle(this)
          }
        }
      }
      firework.render(this.mainContext, this.boomCanvas)
    }
  }
  update () {
    this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
    requestAnimFrame(() => this.update()) // magic!! >< 
    this.draw()
  }
  bind () {
    this.mainCanvas.onclick = (() => this.createFirework(
      {
        x: event.clientX, 
        y: this.mainCanvas.height + 10
      },
      {
        y: event.clientY
      })
    )
  }
  fireUp () {
    this.mainCanvas.width = document.getElementsByClassName('sky')[0].getBoundingClientRect().width
		this.mainCanvas.height = document.getElementsByClassName('sky')[0].getBoundingClientRect().height
    this.setPalette()
    this.bind()
    this.update()
  }
}
