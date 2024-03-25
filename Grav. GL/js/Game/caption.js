class Caption {
  constructor (ctx, text, pos, size) {
    this.ctx = ctx
    this.text = text
    this.pos = pos
    this.size = size
    this.vel = Vector.create()
    this.color = new RGBA(255, 255, 255)
  }

  update () {
    this.pos.add(this.vel)
    this.render()
    this.fade(0.85)
  }

  exists () {
    return this.color.exists()
  }

  float (vel) {
    this.vel = vel
  }

  fade (n) {
    this.color.fade(n )
  }

  render () {
    const { ctx, color, pos, text, size } = this

    ctx.save()
    ctx.font = `${size}px 'Function Regular'`
    ctx.fillStyle = color.get()
    ctx.fillText(text, pos.x, pos.y)
    ctx.restore()
  }
}
