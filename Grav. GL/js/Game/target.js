class Target {
  constructor (world, side = SIDE_TOP, pos = world.width * 0.5, width = world.width * 0.3, color = RGBA.random(1)) {
    this.world = world

    this.set(side, pos, width)

    this.color = color
    this.oscilationCount = 0

    this.TVECS = [
      Vector.create(),
      Vector.create(),
      Vector.create(),
      Vector.create(),
    ]
  }

  set (side, pos, width) {
    this.side = side
    this.pos = pos

    this.width = width
    this.originalWidth = width

    this.hitbox = null
    this.calc()
  }

  calc () {
    const points = [
      Vector.create(0, 0),
      Vector.create(1, 0),
      Vector.create(1, 1),
      Vector.create(0, 1)
    ]

    const { world, pos, width, side } = this

    const halfWidth = width * 0.47

    const position = (() => {
      switch (side) {
        case SIDE_LEFT:
          return Vector.create(-halfWidth, pos)

        case SIDE_TOP:
          return Vector.create(pos, -halfWidth)

        case SIDE_RIGHT:
          return Vector.create(world.width + halfWidth, pos)

        case SIDE_BOTTOM:
          return Vector.create(pos, world.height + halfWidth)
        }
    })()

    this.hitbox = Polygon.create(position, points, 1, width)
  }

  change (prop, value) {
    this[prop] = value
    this.calc()
  }

  oscilate (speed, strength = 1) {
    this.oscilationCount += speed

    const count = this.oscilationCount
    const width = this.originalWidth
    const theta = count + width
    const cos = Math.cos(theta)

    const size = abs(cos * strength + width)
    this.change('width', size)
  }

  move (amount) {
    const pos = this.pos + amount
    this.change('pos', pos)
  }

  render () {
    const calcPoints = this.hitbox.calcPoints
    const points = copyVectorArray(calcPoints, this.TVECS, 4)
    const ctx = this.world.ctx
    const color = this.color.get()
    const world = this.world
    const scale = world.scale

    ctx.save()
    ctx.fillStyle = color
    ctx.shadowColor = color
    ctx.shadowBlur = 100 * world.ratio

    for (let i = 0; i < 4; i++) {
      points[i].scale(scale)
    }

    let point = points[0]

    ctx.beginPath()
    ctx.moveTo(point.x, point.y)

    for (let i = 0; i < 4; i++) {
      point = points[i]
      ctx.lineTo(point.x, point.y)
    }

    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }

  static create(w, s, p, W, c) {
    return new Target(w, s, p, W, c)
  }
}
