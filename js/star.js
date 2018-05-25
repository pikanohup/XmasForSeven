/* ----------------------------------------------------------------------------
 * star singleton
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu hooraypikachu@gmail.com
 * -------------------------------------------------------------------------- */

class Star {
  constructor (x, y, scale, blinkTime) {
    this.x = x
    this.y = y
    this.scale = scale
    this.blink = blinkTime * 0.0015
    this.alpha = 0.05
  }
  draw (context, spot) {
    this.alpha += this.blink
    if (this.alpha > 0.95 || this.alpha < 0.05) {
      this.blink = -this.blink
    }

    context.save()
    
    context.globalAlpha = this.alpha
    context.drawImage(spot, 0, 0, 40, 40, this.x, this.y, 40 * this.scale, 40 * this.scale)

    context.restore()
  }
  static setSpot (canvas) {
    canvas.width = 40
    canvas.height = 40

    let context = canvas.getContext('2d')
    context.shadowColor = 'rgba(255, 255, 255, 1)'
    context.shadowBlur = 15
    context.fillStyle = 'rgb(255, 255, 255)'
    context.beginPath()
    context.arc(20, 20, 2, 0, Math.PI * 2)
    context.closePath()
    context.fill()
  }
}
