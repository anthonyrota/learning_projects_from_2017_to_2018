String.prototype.get = function() { return this };
String.prototype.copy = function() { return this };
String.prototype.fade = function() { return this };

class RGBA {
  constructor (r = 0, g = 0, b = 0, a = 1) {
    this.r = Math.round(r)
    this.g = Math.round(g)
    this.b = Math.round(b)
    this.a = Math.round(a)
  }

  get () {
    const { r, g, b, a } = this
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }

  fade (strength = 0.95) {
    this.a *= strength
    return this
  }

  exists () {
    return this.a > 0.01
  }

  copy () {
    const { r, g, b, a } = this
    return new RGBA(r, g, b, a)
  }

  static random (alpha = random(0, 1)) {
    return new RGBA(
      random(0, 255),
      random(0, 255),
      random(0, 255),
      alpha
    )
  }
}
