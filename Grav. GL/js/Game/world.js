class World {
  constructor (canvas, ratio, size, element) {
    this.inGame = false
    this.element = element

    this.ratio = ratio
    this.inv_ratio = 1 / ratio

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')

    this.canvasRatio = CanvasRatioManager.create(canvas, element, ratio)
    this.canvasRatio.center()

    this.inputManager = InputManager.create(canvas)

    this.size = size
    this.referenceFrame = 0
    this.moversHit = 0
    this.scoreQueue = 0

    this.saveDimensions()
    this.calcSize()

    this.render = RenderRatio.create(this.ctx, this.scale)
    this.SAT = SAT.create()
    this.manifold = Manifold.create()

    this.reset()

    this.cannon = Cannon.create(this)
    this.target = Target.create(this)
  }

  resize () {
    const {
      canvasRatio,
      ctx,
      scale,
      cannon
    } = this

    canvasRatio.calcSize()
    canvasRatio.center()

    this.saveDimensions()
    this.calcSize()

    this.render = RenderRatio.create(ctx, scale)

    if ('cannon' in this) cannon.resize()
    if (this.inGame) this.setBorders()
  }

  calcSize () {
    const width = this.size
    const invRatio = this.inv_ratio
    const renderWidth = this.renderWidth

    this.width = width
    this.height = width * invRatio
    this.scale = renderWidth / width
  }

  saveDimensions () {
    const canvas = this.canvasRatio

    this.renderWidth = canvas.width
    this.renderheight = canvas.height
  }

  reset () {
    this.inGame = false

    this.movers = [1]
    this.statics = [1]
    this.gravities = [1]
    this.borders = [1]

    this.resize()

    this.shaking = false
    this.shakeStrength = 0
    this.shakeCount = 0
    this.shakePeriod = 0

    this.offset = Vector.create()

    this.referenceFrame = 0
    this.score = 0
    this.scoreQueue = 0
    this.scoreInc = 0
    this.moversHit = 0

    this.setBorders()
  }

  init () {
    this.reset()
    this.setBorders()

    this.inGame = true
  }

  setCannon (firstColor, strokeColor, secondColor, percentX, percentY, baseRadius, barrelWidth, barrelHeight, projectile) {
    const base = Cannon.base.create(this, percentX, percentY, baseRadius, barrelWidth, barrelHeight)
    const cannon = Cannon.create(this, firstColor, strokeColor, secondColor, base, projectile)

    this.cannon = cannon
  }

  setTarget (size, pos, width, color) {
    const target = Target.create(this, size, pos, width, color)

    this.target = target
  }

  setBorders () {
    this.borders = [1]

    const { width, height } = this
    const THREE_WIDTH = 3 * width
    const THREE_HEIGHT = 3 * height

    const points = [
      Vector.create(),
      Vector.create(THREE_WIDTH),
      Vector.create(THREE_WIDTH, THREE_HEIGHT),
      Vector.create(0, THREE_HEIGHT)
    ]

    const type = 'border'

    const pos1 = Vector.create(width * 0.5, -height * 1.5)
    const pos2 = Vector.create(width * 2.5, height * 0.5)
    const pos3 = Vector.create(width * 0.5, height * 2.5)
    const pos4 = Vector.create(-width * 1.5, height * 0.5)

    const poly1 = Polygon.create(pos1, cloneVectorArray(points), 1, 1)
    const poly2 = Polygon.create(pos2, cloneVectorArray(points), 1, 1)
    const poly3 = Polygon.create(pos3, cloneVectorArray(points), 1, 1)
    const poly4 = Polygon.create(pos4, cloneVectorArray(points), 1, 1)

    const borders = [
      [ type, Body.create(poly1) ],
      [ type, Body.create(poly2) ],
      [ type, Body.create(poly3) ],
      [ type, Body.create(poly4) ]
    ]

    this.add(borders)
  }

  add (bodies) {
    for (let i = 0; i < bodies.length; i++) {
      const arr = bodies[i]

      const type = arr[0]
      const body = arr[1]
      const def = arr[2]

      const name = firstCharUpperCase(type)
      const func = ('add').concat(name)

      this[func](body, def)
    }
  }

  addMover (body, def) {
    body.applyDef(def)

    const { movers } = this

    movers.push(body)
    movers[0] = movers.length
  }

  addStatic (body, def) {
    body.applyDef(def)

    const { statics } = this

    statics.push(body)
    statics[0] = statics.length
  }

  addGravity (body, def) {
    body.applyDef(def)

    const { gravities } = this

    gravities.push(body)
    gravities[0] = gravities.length
  }

  addBorder (body, def) {
    body.applyDef(def)

    const { borders } = this

    borders.push(body)
    borders[0] = borders.length
  }

  remove (indexes) {
    for (let i = 0; i < indexes.length; i++) {
      const arr = indexes[i]

      const type = arr[0]
      const index = arr[1]

      const name = firstCharUpperCase(type)
      const func = ('remove').concat(name)

      this[func](index)
    }
  }

  removeMover (index) {
    const { movers } = this

    movers.splice(index, 1)
    movers[0] = movers.length
  }

  removeStatic (index) {
    const { statics } = this

    statics.splice(index, 1)
    statics[0] = statics.length
  }

  removeGravity (index) {
    const { gravities } = this

    gravities.splice(index, 1)
    gravities[0] = gravities.length
  }

  removeBorder (index) {
    const { borders } = this

    borders.splice(index, 1)
    borders[0] = borders.length
  }

  shake (strength = 0.3, count = 50, period = 2) {
    this.shaking = true
    this.shakeStrength = strength
    this.shakeCount = count
    this.shakePeriod = period

    this.offset.reset()
  }

  stopShaking () {
    this.shaking = false
    this.shakeStrength = 0
    this.shakeCount = 0
    this.shakePeriod = 0

    this.offset.reset()
  }

  updateShaking () {
    if (this.shaking) {
      const doShake = randomInt(0, this.shakePeriod) === 0

      if (doShake) {
        const strength = this.shakeStrength
        const offset = Vector.randomFromBox(strength)

        this.offset = offset
      }

      this.shakeCount--

      if (this.shakeCount <= 0) this.stopShaking()
    }
  }

  update () {
    this.referenceFrame++

    this.updateShaking()

    const {
      movers,
      gravities,
      statics,
      borders,
      manifold,
      cannon,
      target,
      SAT
    } = this

    manifold.reset()

    let i
    let j
    let len

    len = movers[0]

    for (i = 1; i < len; i++) {
      const mover = movers[i]
      const shape = mover.shape
      const notHitTargetYet = !movers[i].hitTarget

      mover.update()

      let result = SAT.collision(shape, target.hitbox, manifold)
      if (result && notHitTargetYet) {
        this.addScore(582, 5)
        PlaySound('hitTarget')

        mover.shrink()
        mover.hitTarget = true
        mover.vel.scale(0.5)

        this.moversHit++
      }

      let len2

      if (notHitTargetYet) {
        len2 = gravities[0]
        for (j = 1; j < len2; j++) {
          const gravity = gravities[j]
          const attraction = calculateAttraction(gravity.shape, shape)

          mover.applyForce(attraction)
        }

        len2 = statics[0]
        for (j = 1; j < len2; j++) {
          result = SAT.solveCollision(mover, statics[j], manifold)
          if (result) break
        }

        len2 = borders[0]
        for (j = 1; j < len2; j++) {
          result = SAT.solveCollision(mover, borders[j], manifold)
          if (result) break
        }
      }
    }

    let len2 = borders[0]

    len = statics[0]
    for (i = 1; i < len; i++) {
      const Static = statics[i]
      Static.update(true)

      for (j = 1; j < len2; j++) {
        const border = borders[j]

        SAT.solveCollision(Static, border, manifold, true)
      }
    }

    len = gravities[0]
    for (i = 1; i < len; i++) {
      const gravity = gravities[i]
      gravity.update(true)

      for (j = 1; j < len2; j++) {
        const border = borders[j]

        SAT.solveCollision(gravity, border, manifold, true)
      }
    }

    let list = []
    let exists

    len2 = movers[0]
    for (i = 1; i < len2; i++) {
      exists = movers[i].exists()

      if (!exists) {
        this.addScore(-10)
        list.push(['mover', i])
      }
    }

    len2 = statics[0]
    for (i = 1; i < len2; i++) {
      exists = statics[i].exists()

      if (!exists) {
        list.push(['static', i])
      }
    }

    len2 = gravities[0]
    for (i = 1; i < len2; i++) {
      exists = gravities[i].exists()

      if (!exists) {
        list.push(['gravity', i])
      }
    }

    this.remove(list)

    cannon.update()
    target.oscilate(0.04, 0.2)

    this.addScore(-1)
    this.updateScore()
  }

  updateScore () {
    const { scoreInc, scoreQueue } = this

    this.addScore(scoreInc)
    this.scoreQueue--

    if (this.scoreQueue <= 0) {
      this.scoreQueue = 0
      this.scoreInc = 0
    }
  }

  addScore (amount, period) {
    if (period) {
      this.scoreInc = Math.floor(amount / period)
      this.scoreQueue = period
    } else {
      const score = this.score + amount

      this.score = constrain(score, 0, Number.MAX_VALUE)
    }
  }

  renderScene () {
    const {
      cannon,
      target,
      statics,
      gravities,
      movers,
      offset,
      canvasRatio
    } = this

    canvasRatio.clearScreen()

    let i
    let len

    len = statics[0]
    for (i = 1; i < len; i++) {
      this.renderBody(statics[i])
    }

    len = gravities[0]
    for (i = 1; i < len; i++) {
      this.renderBody(gravities[i])
    }

    len = movers[0]
    for (i = 1; i < len; i++) {
      this.renderBody(movers[i])
    }

    cannon.render({
      x: offset.x,
      y: offset.y * 0.2
    })

    target.render()
  }

  renderBody (body, noOffset) {
    const offset = noOffset ? false : this.offset

    const {
      shape,
      fillColor,
      strokeColor,
      strokeWidth
    } = body

    const {
      type,
      pos,
      r
    } = shape

    if (type === TYPE_POLYGON) {
      const points = shape.calcPoints

      this.render.polygon(points, pos, r, fillColor, strokeColor, strokeWidth, offset)
      return
    }

    this.render.circle(pos, r, fillColor, strokeColor, strokeWidth, offset)
  }

  border (width, color) {
    this.canvasRatio.border(width, color)

    this.resize()
  }

  static create (canvas, ratio, size, element) {
      return new World(canvas, ratio, size, element);
  }
}
