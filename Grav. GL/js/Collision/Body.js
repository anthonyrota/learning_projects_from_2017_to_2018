/**
 * Class representing the Body object, used in the game
 * @class Body
 * @classdesc Holds information for an object including collision data, etc
 */
class Body {
  /**
   * Creates a new Body
   * @param {Circle|Polygon} shape The shape to be used
   */
  constructor (shape) {
    /**
     * The hitbox or shape of the Body
     * @name Body#shape
     * @type {Circle|Polygon}
     * @instance
     */
    this.shape = shape

    /**
     * The velocity of the Body
     * @name Body#vel
     * @type {Vector}
     * @instance
     */
    this.vel = Vector.create()
    /**
     * The acceleration of the Body
     * @name Body#acc
     * @type {Vector}
     * @instance
     */
    this.acc = Vector.create()
    /**
     * A temporary Vector to avoid allocating memory
     * @name Body#tempVector
     * @type {Vector}
     * @instance
     */
    this.tempVector = Vector.create()

    /**
     * The last 5 or so angles of the Body that are stored
     * So that the rotations are smooth
     * @name Body#angles
     * @type {number[]}
     * @instance
     */
    this.angles = []
    /**
     * The angular Velocity of the Body
     * @name Body#angVel
     * @type {number}
     * @default 0
     * @instance
     */
    this.angVel = 0
    /**
     * The times left before the Body can stop rotation
     * So that the rotation is smooth and not sudden
     * @name Body#angCount
     * @type {number}
     * @instance
     */
    this.angCount = 0
    /**
     * The permanent rotation that the Body will rotate by
     * @name Body#permanentRotation
     * @type {number}
     * @default 0
     * @instance
     */
    this.permanentRotation = 0

    /**
     * Whether the Body is oscilating
     * @name Body#oscilating
     * @type {boolean}
     * @default false
     * @instance
     */
    this.oscilating = false
    /**
     * The last few sizes of the Body so that it can oscilate legitamately
     * @name Body#oscilationMemory
     * @type {number[]}
     * @instance
     */
    this.oscilationMemory = []
    /**
     * How much the Body will be oscilating ie the strength
     * @name Body#oscilationStrength
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationStrength = 0
    /**
     * The counter for ticking past the sin or cosin wave during oscilation
     * @name Body#oscilationCount
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationCount = 0
    /**
     * The minimum size that the Polygon can be while oscilating
     * @name Body#minOscilationSize
     * @type {number}
     * @default 0
     * @instance
     */
    this.minOscilationSize = 0
    /**
     * How fast the Body is oscilating
     * @name Body#oscilationSpeed
     * @type {number}
     * @default 0
     * @instance
     */
    this.oscilationSpeed = 0

    /**
     * Whether the Body is involved in a collision
     * @name Body#inCollision
     * @type {boolean}
     * @instance
     */
    this.inCollision = false
    /**
     * The bounce when the Body is involved in a collision
     * @name Body#restitution
     * @type {number}
     * @default 0
     * @instance
     */
    this.restitution = 0
    /**
     * Whether the Body is shrinking or not
     * @name Body#shrinking
     * @type {boolean}
     * @default false
     * @instance
     */
    this.shrinking = false
    /**
     * How fast the Body is shrinking, the lower the faster
     * @name Body#shrinkSpeed
     * @type {number}
     * @default 0.95
     * @instance
     */
    this.shrinkSpeed = 0.95
    /**
     * How many frames left before the Body shrinks
     * @name Body#lifespan
     * @type {boolean|number}
     * @default false
     * @instance
     */
    this.lifespan = false
  }

  /**
   * Starts oscilating the Body, as in making it smaller and bigger
   * In a wave like motion due to the given inputs
   * @param {number=} strength How large or small it gets, the higher the srength the
   *   larger the difference between the highest and smallest sized during oscilation
   * @param {number=} speed How fast the Body will oscilate
   * @param {number=} min The minimum size while oscilating
   */
  oscilate (strength = 1, speed = 1, min = 0.01) {
    // set oscilation to true and update settings
    this.oscilating = true
    this.oscilationCount = 0
    this.oscilationStrength = strength
    this.minOscilationSize = min

    // scale down speed so numbers like 5 will equal a small oscilation speed
    this.oscilationSpeed = speed * 0.01
  }

  /**
   * Applies a force to the Body, equivalently moving it in
   * a dirrection where the magnitude is affected by the mass
   * @param {Vector} force A Vector where the Body should be pushed
   */
  applyForce (force) {
    const div = this.shape.invMass
    const f = this.tempVector.copy(force).scale(div)

    // finally add the scaled force to the accelaration
    this.acc.add(f)
  }

  /**
   * Sets the velocity of the Body
   * @param {Vector=} vel The velocity to set
   */
  setVel (vel = Vector.create()) {
    this.vel = vel
  }

  /**
   * Rotates the body by the given angle in radians
   * @param {number} angle The angle to rotate by
   */
  rotate (angle) {
    // cut up the turn into smaller steps so it doesnt look jumpy
    this.angVel = angle * 0.1
    this.angCount = 10
  }

  /**
   * Updates the shrinking motion of the Body effectively making it smaller
   */
  shrink () {
    this.shrinking = true

    // scale the size by the shrinkspeed of the Body
    this.shape.scale(this.shrinkSpeed)
  }

  /**
   * Decides whether the Body size is big enough to exist
   * @returns {boolean} Whether the Body exists
   */
  exists () {
    const type = this.shape.type
    if (type === TYPE_POLYGON) return this.shape.size > 0.01
    if (type === TYPE_CIRCLE) return this.shape.r > 0.01
  }

  /**
   * Applies the given def to the body, changing its inner settings
   * @param {Def=} def The def to be applied against the Body
   * @param {Vector=} def.vel The velocity to be set
   * @param {number=} def.angle The initial angle to be set against the shaoe
   * @param {number=} def.rotate The permanent rotation
   * @param {boolean=} def.oscilate Whether the Body will oscilate
   * @param {number=} def.oscilationStrength The range of oscilation sizes
   * @param {number=} def.oscilationSpeed How fast the Body oscilates
   * @param {number=} def.minOscilationSize The minimum size during oscilation
   * @param {number=} def.lifespan How many game ticks are left till the Body shrinks
   * @param {number=} def.shrinkSpeed How fast the Body shrinks
   * @param {string|RGBA=} def.fillColor The fill color of the Body
   * @param {string|RGBA=} def.strokeColor The stroke color of the body
   * @param {number=} def.strokeWidth The width of the stroked line when drawing the Body
   * @param {number=} def.restitution The bounce factor during collisions
   */
  applyDef (def = Def.create()) {
    // set default values
    const {
      vel,
      angle,
      rotate,
      oscilate,
      oscilationStrength,
      oscilationSpeed,
      minOscilationSize,
      lifespan,
      shrinkSpeed,
      fillColor,
      strokeColor,
      strokeWidth,
      restitution
    } = def

    // if there is a velocity then set the velocity
    if (vel) this.setVel(vel)

    // if there is an angle then rotate by that amount
    if (angle) this.shape.setAngle(angle)
    if (rotate) this.permanentRotation = rotate

    // if oscilation is there than oscilate by the parameters given
    if (oscilate) {
      const strength = oscilationStrength
      const speed = oscilationSpeed
      const min = minOscilationSize
      this.oscilate(strength, speed, min)
    }

    // if there was a lifespan specified then set lifespan and or shrinkspeed
    if (lifespan) this.lifespan = lifespan
    if (shrinkSpeed) this.shrinkSpeed = shrinkSpeed

    // set colors
    this.fillColor = fillColor
    this.strokeColor = strokeColor

    // some un-processable value for no strokeColor
    this.strokeWidth = strokeWidth || 0.01

    // if there is no restitution then it will be the Def default value
    this.restitution = restitution
  }

  /**
   * Updates the angles in the angular memory,
   * Aimed at creating a delayed turn
   * @param {boolean} doRotate whether the Body should rotate
   */
  updateAngularMemory (doRotate) {
    const shape = this.shape

    // only rotate if it is a polygon and the doRotate param is true
    if (shape.type === TYPE_POLYGON) {
      if (doRotate) {
        // get current angles
        let angles = this.angles

        // get current angle
        const angle = this.vel.getAngle()
        const currentAngle = angles.length < 5 ? angle : angles.shift()

        // push current angle
        angles.push(angle)

        // set angle of shape
        this.shape.setAngle(currentAngle)
      }

      // rotate by permanent rotation
      const angle = this.permanentRotation
      if (angle) this.shape.rotate(angle)
    }
  }

  /**
   * Updates the oscilation of the Body
   */
  updateOscilation () {
    // only if it is oscilating and not shrinking
    if (this.oscilating && !this.shrinking) {
      // update the oscilation count
      this.oscilationCount++

      // def default variables
      const {
        oscilationMemory,
        oscilationCount,
        oscilationSpeed,
        oscilationStrength,
        minOscilationSize,
        shape
      } = this

      const {
        r,
        size,
        type
      } = shape

      // get the current angle and sin value
      const theta = oscilationCount * oscilationSpeed
      const sin = Math.sin(theta)

      // get last and current size
      const prevSize = oscilationMemory[0] || 0
      const newSize = sin * oscilationStrength

      // update oscilation memory
      oscilationMemory[0] = oscilationMemory[1] || 0
      oscilationMemory[1] = newSize

      // get difference between sizes and the current size
      const diff = newSize - prevSize
      const radius = type === TYPE_CIRCLE ? r : size

      // calculate the new size and change the shapes size to that
      const total = abs(diff + radius)
      const Size = constrain(total, minOscilationSize, Math.MAX_VALUE)

      this.shape.setSize(Size)
    }
  }

  /**
   * Updates the Polygon including angular rotation, velocity etc
   * @param {boolean} noRotate whether the Polygon should not have its rotation updated
   */
  update (noRotate) {
    // integrate velocity
    this.vel.add(this.acc)
    this.shape.move(this.vel)
    this.acc.reset()

    const doRotate = !noRotate

    // update angles and oscilation
    this.updateAngularMemory(doRotate)
    this.updateOscilation()

    // update angular velocity
    if (this.angCount > 0) {
      this.vel.rotate(this.angVel)
      this.angCount--

      if (this.angCount === 0) {
        this.angVel = 0
        this.inCollision = false
      }
    }

    // update lifespan
    if (this.lifespan) {
      this.lifespan--

      if (this.lifespan <= 0) {
        this.shrink()
        this.lifespan = false
      }
    }

    // update shrinking
    if (this.shrinking) {
      this.shrink()
    }
  }

  /**
   * Creates a new Body without having to use the 'new' keyword
   * @param {Polygon|Circle} shape The shape to be passed into the Bodys parameters
   * @returns {Body} The new CirBodycle
   * @static
   */
  static create (shape) {
    return new Body(shape)
  }
}
