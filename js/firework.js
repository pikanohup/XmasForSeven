/* ----------------------------------------------------------------------------
 * firework
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu pocketfish@yeah.net
 * -------------------------------------------------------------------------- */


/* -------------- firework singleton -------------- */
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
    context.globalAlpha = this.alpha // * Math.random()

    context.fillStyle = 'rgba(255, 255, 255, 0.3)'
    context.beginPath()
    context.moveTo(this.position.x, this.position.y)
    context.lineTo(this.position.x + 1.5, this.position.y)
    context.lineTo(this.position.x + xVel, this.position.y + yVel)
    context.lineTo(this.position.x - 1.5, this.position.y)
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
}

/* -------------- image to particles -------------- */
class Shape {
  constructor (source, width, height, colNum, rowNum) {
    this.source = source
    this.width = width || 0
    this.height = height || 0
    this.colNum = colNum || 100
    this.rowNum = rowNum || 100
    this.particles = []
  }
  incise (context) {
    context.drawImage(this.source, 0, 0)
    let raw = context.getImageData(0, 0, this.width, this.height).data
    context.clearRect(0, 0, this.width, this.height)
    
    let gridWidth = this.width / this.colNum,
        gridHeight = this.height / this.rowNum
    for (let i = 0; i < this.width; i+=gridWidth) {
      for (let j = 0; j < this.height; j+=gridHeight) {
        if (raw[j * this.width + i]) {
          this.particles.push({x: i, y: j})
        }
      }
    }
  }
}

/* -------------- explosion methods -------------- */
class Explosion {
  static createFirework (box, position, target, velocity, colour, gravityForced) {
    position = position || {}
    target = target || {}
    velocity = velocity || {}
    box.push(new Firework(
      {
        x: position.x,
        y: position.y
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
  static circle (shot, box) {
    let count = 100, angle = (Math.PI * 2) / count
    for (let i = 0; i < count; i++) {
      let randomVel = 4 + Math.random() * 4
      Explosion.createFirework(
        box,
        shot.position,
        null,
        {
          x: Math.cos(i * angle) * randomVel,
          y: Math.sin(i * angle) * randomVel
        },
        shot.colour,
        true)
    }
  }
  static star (shot, box) {
    let points = 6 + Math.round(Math.random() * 15),
        jump = 3 + Math.round(Math.random() * 7),
        circle = Math.PI * 2,
        bias = Math.random() * Math.PI * 2,
        randomVel  = -(Math.random() * 3 - 6),
        subDivisions = 10, radius = 80, start = 0, end = 0
        
    do {
      start = end
      end = (end + jump) % points
      
      let sAngle = (start / points) * circle - bias,
          eAngle = ((start + jump) / points) * circle - bias,          
          startPos = {
            x: shot.position.x + Math.cos(sAngle) * radius,
            y: shot.position.y + Math.sin(sAngle) * radius
          },
          endPos = {
            x: shot.position.x + Math.cos(eAngle) * radius,
            y: shot.position.y + Math.sin(eAngle) * radius
          },
          diffPos = {
            x: endPos.x - startPos.x,
            y: endPos.y - startPos.y,
            a: eAngle - sAngle
          }
          
      for(let i = 0; i < subDivisions; i++) {
        let sub = i / subDivisions,
            subAngle = sAngle + (sub * diffPos.a)
        Explosion.createFirework(
          box,
          {
            x: startPos.x + (sub * diffPos.x),
            y: startPos.y + (sub * diffPos.y)
          },
          null,
          {
            x: Math.cos(subAngle) * randomVel,
            y: Math.sin(subAngle) * randomVel
          },
          shot.colour, 
          true)
      }
    } while(end)
  }
}
