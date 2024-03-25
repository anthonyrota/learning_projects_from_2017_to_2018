class Renderer {
  constructor (ctx) {
    this.ctx = ctx
  }

  gradient (x, y, inner, outer, stops, amount) {
    let gradient = this.ctx.createRadialGradient(x, y, inner, x, y, outer)

    for (let i = 0; i < amount; i++) {
      const stop = stops[i].get()
      gradient.addColorStop(i, stop)
    }

    return gradient
  }

  polygon (points, pos, r, fillColor, strokeColor, strokeWidth) {
    const colorStops = [fillColor, strokeColor]
    const gradient = this.gradient(pos.x, pos.y, r * 0.1, r * 1.5, colorStops, 2)
    const ctx = this.ctx

    ctx.fillStyle = gradient
    ctx.strokeStyle = strokeColor.get()
    ctx.lineWidth = strokeWidth * 2

    let point = points[0]

    ctx.beginPath()
    ctx.moveTo(point.x, point.y)

    for (let i = 0; i < points.length; i++) {
      const point = points[i]
      ctx.lineTo(point.x, point.y)
    }

    ctx.closePath()

    ctx.save()
    ctx.clip()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  circle (pos, r, fillColor, strokeColor, strokeWidth) {
    const colorStops = [fillColor, strokeColor]
    const gradient = this.gradient(pos.x, pos.y, r * 0.1, r * 2, colorStops, 2)
    const ctx = this.ctx

    ctx.fillStyle = gradient
    ctx.strokeStyle = strokeColor.get()
    ctx.lineWidth = strokeWidth

    ctx.beginPath()
    ctx.arc(pos.x, pos.y, r - strokeWidth * 0.25, 0, TWO_PI)
    ctx.closePath()

    ctx.stroke()
    ctx.fill()
  }

  box (pos, w, h, angle, fillColor) {
    const ctx = this.ctx
    const begin = -w * 0.5

    ctx.save()
    ctx.translate(pos.x, pos.y)
    ctx.rotate(angle - HALF_PI)

    ctx.fillStyle = fillColor.get()
    ctx.fillRect(begin, 0, w, h)

    ctx.restore()
  }

  point (pos, fillColor) {
    const ctx = this.ctx

    ctx.fillStyle = fillColor.get()
    ctx.beginPath()
    ctx.arc(pos.x, pos.y, 2, 0, TWO_PI)
    ctx.closePath()
    ctx.fill()
  }

  static create (ctx) {
    return new Renderer(ctx)
  }
}
