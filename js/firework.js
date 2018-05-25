/* ----------------------------------------------------------------------------
 * firework
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu hooraypikachu@gmail.com
 * -------------------------------------------------------------------------- */

class Firework {
  constructor (position, target, velocity, colour, gravityForced) {
    this.position = {x: position.x || 0, y: position.y || 0}
    this.target = {y: target.y || 0}
    this.velocity = {x: velocity.x || 0, y: velocity.y || 0}
    this.colour = colour
    this.gravityForced = gravityForced || false
    this.lastPos = {x: position.x || 0, y: position.y || 0}
    this.alpha = 1
    this.easing = Math.random() * 0.02
    this.fade = Math.random() * 0.1
    this.grid = {x: colour % (gridSize * 10), y: Math.floor(colour / (gridSize * 10)) * gridSize}
  }
  draw (context, boom) {
    let x = Math.round(this.position.x),
        y = Math.round(this.position.y),
        xVel = (x - this.lastPos.x) * -5,
        yVel = (y - this.lastPos.y) * -5

    context.save()
    context.globalCompositeOperation = 'lighter'
    context.globalAlpha = this.alpha

    context.fillStyle = 'rgba(255, 255, 255, 0.3)'
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + 2, y)
    context.lineTo(x + xVel, y + yVel)
    context.lineTo(x - 2, y)
    context.closePath()
    context.fill()

    context.drawImage(boom, this.grid.x, this.grid.y, gridSize, gridSize, x - radiusBig, y - radiusBig, gridSize, gridSize)
    context.drawImage(glowSmall, x - radiusSmall, y - radiusSmall)

    context.restore()
  }
  update () {
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
  static setPalette (canvas) {
    canvas.width = gridSize * 10
    canvas.height = gridSize * 10

    let context = canvas.getContext('2d')
    context.globalCompositeOperation = 'xor'
    for (let i = 0; i < 100; i++) {
      let colour = (i * gridSize),
          gridX = colour % (gridSize * 10),
          gridY = Math.floor(colour / (gridSize * 10)) * gridSize
      context.fillStyle = 'hsl(' + Math.round(i * 3.6) + ', 100%, 40%)'
      context.fillRect(gridX, gridY, gridSize, gridSize)
      context.drawImage(glowBig, gridX, gridY)
    }
  }
}
