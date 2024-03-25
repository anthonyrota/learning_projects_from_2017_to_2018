class Cannon {
  constructor (world, fillColor1 = '#111', strokeColor = '#464646', fillColor2 = '#111', base = Cannon.base.create(world), proj = {}) {
    this.world = world

    this.inputManager = world.inputManager
    this.ctx = world.ctx
    this.mouse = world.inputManager.mouse
    this.w = world.width

    this.projectile = {}
    this.set(proj)

    this.base = base
    this.fireVec = Vector.create()

    this.fillColor1 = fillColor1
    this.fillColor2 = fillColor2
    this.strokeColor = strokeColor
  }

  set (definition) {
    const { projectile } = this

    const defaults = {}

    defaults.speed = this.w * 0.007

    defaults.def = Def.create({
      oscilate: true,
      oscilationStrength: 0.03,
      minOscilationSize: 0.5,
      oscilationSpeed: 10,
      restitution: 0.6,
      shrinkSpeed: 0.8,
      lifespan: 100,
      fillColor: '#111',
      strokeColor: '#111'
    })

    defaults.points = [
      Vector.create(0.72,0.32),
      Vector.create(1.50,0.68),
      Vector.create(0.72,1.04),
      Vector.create(0.50,0.68)
    ]

    defaults.size = 1
    defaults.firerate = 5
    defaults.density = 1

    for (let name in defaults) {
      if (name in definition) {
        this.projectile[name] = definition[name]
      } else {
        this.projectile[name] = defaults[name]
      }
    }
  }

  assign (propName, value) {
    this.projectile[propName] = value
  }

  update () {
    const {
      world,
      mouse,
      projectile
    } = this

    const outline = world.canvasRatio
    const frame = world.referenceFrame

    const { speed, firerate } = projectile

    const x = mouse.x - outline.borderLeft
    const y = mouse.y - outline.borderTop

    const pos = Vector.create(x, y)

    this.base.head(pos, projectile.speed)

    if (this.inputManager.drag) {
      this.base.extend()

      if (frame % firerate === 0) {
        this.fire()
      }
    } else {
      this.base.unextend()
    }
  }

  createBody (pos) {
    const { projectile } = this
    const { points, density, size } = projectile

    const vertices = cloneVectorArray(points)

    const shape = Polygon.create(pos, vertices, density, size)

    return Body.create(shape)
  }

  fire () {
    PlaySound('shootCannon')

    const def = this.projectile.def.clone()
    const vel = this.base.fireVec.clone()
    const pos = this.base.firePos.clone()

    const body = this.createBody(pos)

    def.vel = vel

    this.world.addMover(body, def)
  }

  render (offset) {
    this.base.render(this.fillColor1, this.strokeColor, this.fillColor2, offset)
  }

  resize () {
    this.base.resize()
  }

  static create (world, f1c, s1c, f2c, base, proj) {
    return new Cannon(world, f1c, s1c, f2c, base, proj)
  }
}

Cannon.base = class {
  constructor (world, percentX = 50, percentY = 99.6, baseRadius = 1, barrelWidth = 0.8, barrelHeight = 2) {
    this.percentX = percentX * 0.01
    this.percentY = percentY * 0.01

    this.baseRadius = baseRadius
    this.barrelWidth = barrelWidth
    this.barrelHeight = barrelHeight

    this.world = world
    this.minSize = this.barrelHeight
    this.maxSize = this.barrelHeight * 1.3
    this.incSize = this.barrelHeight * 0.04

    this.angle = -HALF_PI
    this.prevAngle = 0
    this.tempAngle = 0
    this.easing = 0
    this.easingCount = 0
    this.prevState = 0

    this.pos = Vector.create()
    this.firePos = Vector.create()
    this.fireVec = Vector.create()

    this.resize()
  }

  resize () {
    this.scale = this.world.render.inv_ratio

    const x = this.percentX * this.world.width
    const y = this.percentY * this.world.height

    this.pos.set(x, y)
    this.firePos.reset()
    this.fireVec.reset()
  }

  extend () {
    if (this.barrelHeight < this.maxSize) {
      this.barrelHeight += this.incSize
    } else {
      this.barrelHeight = this.maxSize
    }
  }

  unextend () {
    if (this.barrelHeight > this.minSize) {
      this.barrelHeight -= this.incSize
    } else {
      this.barrelHeight = this.minSize
    }
  }

  head (pos, speed) {
    this.fireVec.copy(pos).scale(this.scale)
    this.fireVec.sub(this.pos).setMag(speed)

    let angle = this.fireVec.getAngle()
    if (angle < 0) angle += TWO_PI

    // check if mouse crossed the bottom
    if (angle < HALF_PI) {
      if (this.prevState === 2) {
        // mouse did cross so ease the transition
        this.easingCount = 12
        this.easing = PI / 12
      }

      angle = 0

      // update the previous state so the angle
      // does not get updated more than once
      this.prevState = 1
    } else if (angle < PI && angle > HALF_PI) {
      if (this.prevState === 1) {
        // mouse did cross so ease the transition
        this.easingCount = 12
        this.easing = -PI / 12
      }

      angle = PI

      // update the previous state so the angle
      // does not get updated more than once
      this.prevState = 2
    } else {
      // mouse didn't cross so reset the state
      this.prevState = 0
    }

    this.prevAngle = this.angle
    this.tempAngle = angle

    this.smooth()
  }

  smooth () {
    const diff = this.tempAngle - this.prevAngle
    const absDiff = abs(diff)

    if (this.easingCount) {
      this.easingCount--
      this.angle += this.easing

      if (this.easingCount < 1) {
        this.easingCount = 0
      }
    } else if (VERSION_PHONE && absDiff > 0.01 && !this.prevState) {
      this.easing = diff * 0.2
      this.easingCount = 5
    } else {
      this.angle = this.tempAngle
    }

    this.firePos.set(this.barrelHeight)
    this.firePos.rotate(this.angle).add(this.pos)
  }

  render (fillColor1, strokeColor, fillColor2, offset) {
    const {
      pos,
      baseRadius,
      barrelWidth,
      barrelHeight,
      angle,
      world
    } = this

    world.render.box(pos, barrelWidth, barrelHeight, angle, fillColor1, 'rgba(0, 0, 0, 0)', 1, offset)
    world.render.circle(pos, baseRadius, fillColor2, strokeColor, 0.1, offset)
  }

  static create (w, px, py, br, bw, bh) {
    return new Cannon.base(w, px, py, br, bw, bh)
  }
};
