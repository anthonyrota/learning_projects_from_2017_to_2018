window.options = {
  sound: true,

  toggle (prop) {
    this[prop] = !this[prop]
    return this[prop]
  }
}
