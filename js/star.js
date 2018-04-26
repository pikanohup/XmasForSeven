/* ----------------------------------------------------------------------------
 * star singleton
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu pocketfish@yeah.net
 * -------------------------------------------------------------------------- */

/* -------------- star singleton -------------- */ 
class Star {
  constructor (x, y, scale, blinkTime) {
    this.x = x
    this.y = y
    this.scale = scale
    this.blink = blinkTime * 0.0007
    this.alpha = 0
  }
  draw (context) {   
    this.alpha += this.blink
    if (this.alpha >= 1 || this.alpha <= 0) {
      this.blink = -this.blink
    } 
		
    context.save()
    context.fillStyle = 'rgba(255, 255, 255, ' + this.alpha + ')'
    context.beginPath()
    context.arc(this.x, this.y, this.scale, 0, Math.PI * 2)
    context.closePath()
    context.fill()
    context.restore()
  }
}
