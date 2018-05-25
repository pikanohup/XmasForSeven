/* ----------------------------------------------------------------------------
 * explosion methods
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu hooraypikachu@gmail.com
 * -------------------------------------------------------------------------- */

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
    let count = 50, angle = (Math.PI * 2) / count
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
    let points = 4 + Math.round(Math.random() * 7),
        jump = 2 + Math.round(Math.random() * 3),
        circle = Math.PI * 2,
        bias = Math.random() * Math.PI * 2,
        randomVel  = -(Math.random() * 3 - 6),
        subDivisions = 8, radius = 80, start = 0, end = 0

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
  static shape(shot, template, box) {
    let interval = 2, totalTime = 500,
        duration = Math.ceil((totalTime - 10 * interval) / 16.66),
        colour = Math.round(shot.colour / gridSize * 3.6)
    template.forEach(pixel => {
      box.push(new Particle(
        {
          x: shot.position.x,
          y: shot.position.y
        },
        {
          x: pixel.x + shot.position.x,
          y: pixel.y + shot.position.y
        },
        interval,
        duration,
        colour))
    })
  }
}
