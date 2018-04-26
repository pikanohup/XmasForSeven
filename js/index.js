setUp = () => {
  loadAll()
  
  let manager = new Manager(document.getElementById('fireworks'), document.getElementById('boom'))
  manager.fireUp()
}

// I know this function seems stupid but...I trid all methods I could find on the Internet...none of them worked T-T
// onload or recursion or callback...none of them worked!!
// so, if the images fails to load before the scripts, just refresh the whole page. Gahhh bruteforce!
loadAll = () => {
  let imgs = document.getElementsByTagName('img')
  for (let img of imgs) {
    if(!img.complete)
      window.location.reload()
  }
}

setUp()