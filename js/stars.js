/*!----------------------------------------------------------------------------
 * stars - CSS3 animation
 * Licensed under the MIT License.
 * Copyright (C) 2018 Pikachu pocketfish@yeah.net
 * --------------------------------------------------------------------------*/

const getRandomFloat = (min, max) => Math.random() * (max - min) + min

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min) 
 
class Star {
  constructor (x, y, scale, blinkTime) {
    this.x = x
    this.y = y
    this.scale = scale
    this.blinkTime = blinkTime
  }
  draw (container) {
    // jQuery append
    let starDom = document.createElement('div')
    starDom.innerHTML = '<div class="blink" style="animation:blinking ' + this.blinkTime + 's linear infinite; top:' + this.y + 'px; left:' + this.x +
    'px;"><div class="fade" style="width:' + this.scale +'px; height:' + this.scale + 'px;"></div></div>'
    let frag = document.createDocumentFragment();
    while (starDom.firstChild) {
      frag.appendChild(starDom.firstChild)
    }
    container.appendChild(frag)
  }
}

class StarrySky {
  constructor (num, diffusion, container) {
    this.num = num
    this.diffusion = diffusion
    this.container = container
  }
  draw () {
    let width = this.container.offsetWidth
    let height = this.container.offsetHeight
    for (let i = 0; i < this.num; i++) {
      setTimeout((() => {
        let star = new Star(getRandomInt(0, width), getRandomInt(0, height), getRandomInt(1, 2), getRandomFloat(3, 5))
        star.draw(this.container)
      }), i * this.diffusion)
    }
  }
}
