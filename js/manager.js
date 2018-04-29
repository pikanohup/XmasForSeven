/* ----------------------------------------------------------------------------
 * canvas manager
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu hooraypikachu@gmail.com
 * -------------------------------------------------------------------------- */

class Manager {
  constructor (mainCanvas) {
    this.mainCanvas = mainCanvas
    this.mainContext = mainCanvas.getContext('2d')
    this.boomCanvas = document.createElement('canvas')
    this.kittyTemplate = []
    this.stars = []
    this.fireworks = []
    this.particles = []
  }
  setUp () {
    this.mainCanvas.width = document.getElementsByClassName('sky')[0].getBoundingClientRect().width
		this.mainCanvas.height = document.getElementsByClassName('sky')[0].getBoundingClientRect().height

    // set stars
    let starNum = 77, diffusion = 77
    for (let i = 0; i < starNum; i++) {
      setTimeout((() => {
        this.stars.push(new Star(
          Math.floor(Math.random() * this.mainCanvas.width), Math.floor(Math.random() * this.mainCanvas.height),
          Math.random() * 0.5 + 0.5, Math.random() * 2 + 3 ))
      }), i * diffusion)
    }

    Firework.setPalette(this.boomCanvas)

    this.kittyTemplate = Particle.incise(kittyIcon, kittySize, kittySize, 77, 77, this.mainContext)
    console.log(this.kittyTemplate)
  }
  explode (firework) {
    let flag = Math.random() * 10
    if (flag < 5) {
      Explosion.star(firework, this.fireworks)
    } else if (flag < 8) {
      Explosion.circle(firework, this.fireworks)
    } else {
      Explosion.shape(firework, this.kittyTemplate, this.particles)
    }
  }
  draw () {
    this.stars.forEach(star => {
      star.draw(this.mainContext)
    })

    let nf = this.fireworks.length
    while (nf--) {
      let firework = this.fireworks[nf]
      if (firework.update()) {
        this.fireworks.splice(nf, 1)
        if (!firework.gravityForced) {
          this.explode(firework)
       }
      }
      firework.draw(this.mainContext, this.boomCanvas)
    }

    let np = this.particles.length
    while (np--) {
      let particle = this.particles[np]
      if (particle.update()) {
        this.particles.splice(np, 1)
      }
      particle.draw(this.mainContext)
    }
  }
  update () {
    this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
    requestAnimationFrame(() => this.update()) // magic!! ><
    this.draw()
  }
  bind () {
    this.mainCanvas.onclick = (() => Explosion.createFirework(
      this.fireworks,
      {
        x: event.clientX,
        y: this.mainCanvas.height + 10
      },
      {
        y: event.clientY
      })
    )
  }
  fire () {
    this.setUp()
    this.bind()
    this.update()
  }
}
