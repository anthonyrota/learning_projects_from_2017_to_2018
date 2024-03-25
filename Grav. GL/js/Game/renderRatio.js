const RenderRatio = class {
  constructor (ctx, ratio) {
    this.ctx = ctx

    this.ratio = ratio
    this.inv_ratio = 1 / ratio

    this.widthAdjust = ratio * 0.036

    this.render = Renderer.create(ctx)

    this.TVECS = []
    for (let i = 0; i < 50; i++) {
      this.TVECS.push(Vector.create())
    }
  }

  polygon (points, pos, r, fillColor, strokeColor, strokeWidth, offset = { x: 0, y: 0 }) {
    const len = points.length
    const ratio = this.ratio
    const adjust = this.widthAdjust

    let list = copyVectorArray(points, this.TVECS, len)

    for (let i = 0; i < len; i++) {
      list[i].add(offset).scale(ratio)
    }

    const position = this.TVECS.pop().copy(pos).add(offset).scale(ratio)

    this.render.polygon(list, position, r * ratio, fillColor, strokeColor, adjust * strokeWidth)
    this.TVECS.push(position)
  }

  circle (pos, r, fillColor, strokeColor, strokeWidth, offset = { x: 0, y: 0 }) {
    const ratio = this.ratio
    const adjust = this.widthAdjust
    const position = this.TVECS.pop().copy(pos).add(offset).scale(ratio)
    const radius = r * ratio

    this.render.circle(position, radius, fillColor, strokeColor, adjust * strokeWidth)
    this.TVECS.push(position)
  }

  box (pos, w, h, angle, fillColor, strokeColor, strokeWidth, offset = { x: 0, y: 0 }) {
    const ratio = this.ratio
    const adjust = this.widthAdjust
    const position = this.TVECS.pop().copy(pos).add(offset).scale(ratio)
    const width = w * ratio
    const height = h * ratio

    this.render.box(position, width, height, angle, fillColor, strokeColor, adjust * strokeWidth)
    this.TVECS.push(position)
  }

  point (pos, fillColor, offset = { x: 0, y: 0 }) {
    const position = this.TVECS.pop().copy(pos).add(offset).scale(this.ratio)

    this.render.point(position, fillColor)
    this.TVECS.push(position)
  }

  static create (ctx, ratio) {
    return new RenderRatio(ctx, ratio)
  }
}
