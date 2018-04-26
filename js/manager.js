/* ----------------------------------------------------------------------------
 * canvas manager
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu pocketfish@yeah.net
 * -------------------------------------------------------------------------- */
 
class Manager {
  constructor (mainCanvas, boomCanvas) {
    this.mainCanvas = mainCanvas
    this.mainContext = mainCanvas.getContext('2d')
    this.boomCanvas = boomCanvas
    this.boomContext = boomCanvas.getContext('2d')
    this.stars = []
    this.fireworks = []
  }
  setStars (num, diffusion) {
    for (let i = 0; i < num; i++) {
      setTimeout((() => {
        this.stars.push(new Star(
          Math.random() * this.mainCanvas.width, Math.random() * this.mainCanvas.height, 
          Math.random() * 0.5 + 0.5, Math.random() * 2 + 3 ))
      }), i * diffusion)
    }
  }
  setPalette () {
    this.boomContext.globalCompositeOperation = 'source-over'
    this.boomCanvas.width = gridSize * 10
    this.boomCanvas.height = gridSize * 10
    for (let i = 0; i < 100; i++) {
      let colour = (i * gridSize),
          gridX = colour % (gridSize * 10),
          gridY = Math.floor(colour / (gridSize * 10)) * gridSize
      this.boomContext.fillStyle = 'hsl(' + Math.round(i * 3.6) + ', 100%, 40%)'
      this.boomContext.fillRect(gridX, gridY, gridSize, gridSize)
      this.boomContext.drawImage(glowBig, gridX, gridY)
    }
  }
  draw () {
    this.stars.forEach(star => {
      star.draw(this.mainContext)
    })
    
    let n = this.fireworks.length
    while(n--) {
      let firework = this.fireworks[n]
      if (firework.update()) {
        this.fireworks.splice(n, 1)
        if (!firework.gravityForced) {
          if (Math.random() < 0.6) {
            Explosion.star(firework, this.fireworks)
          } else {
            Explosion.circle(firework, this.fireworks)
          }
        }
      }
      firework.render(this.mainContext, this.boomCanvas)
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
  fireUp () {
    this.mainCanvas.width = document.getElementsByClassName('sky')[0].getBoundingClientRect().width
		this.mainCanvas.height = document.getElementsByClassName('sky')[0].getBoundingClientRect().height
    this.setStars(77, 77)
    this.setPalette()
    this.bind()
    this.update()
  }
}
