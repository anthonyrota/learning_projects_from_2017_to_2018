/**
 * Class representing a point in the cartesian plane
 * @class Vector
 * @classdesc Creates a new Vector Object
 */
class Vector {
  /**
   * Creates a new Vector
   * @param {x=} x The x coordinate
   * @param {y=} y The y coordinate
   */
  constructor (x = 0, y = 0) {
    /**
     * The x coordinate of the Vector
     * @name Vector#x
     * @type {number}
     * @default 0
     * @instance
     */
    this.x = x
    /**
     * The y coordinate of the Vector
     * @name Vector#y
     * @type {number}
     * @default 0
     * @instance
     */
    this.y = y
  }

  /**
   * Sets the position of the Vector
   * @param {number=} x The x coordinate
   * @param {number=} y The y coordinate
   * @returns {Vector} This is for chaining
   */
  set (x = 0, y = 0) {
    this.x = x
    this.y = y
    return this
  }

  /**
   * Resets the Vectors x and y values
   * @returns {Vector} This is for chaining
   */
  reset () {
    this.x = 0
    this.y = 0
    return this
  }

  /**
   * Gets the angle of the Vector
   * @returns {number} The calculated angle
   */
  getAngle () {
    return Math.atan2(this.y, this.x)
  }

  /**
   * Adds the values of the Vector to another
   * @param {Vector} other The other Vector to add too
   * @returns {Vector} This is for chaining
   */
  add (other) {
    this.x += other.x
    this.y += other.y
    return this
  }

  /**
   * Subtracts the values of the Vector from another
   * @param {Vector} other The other Vector to subtract from
   * @returns {Vector} This is for chaining
   */
  sub (other) {
    this.x -= other.x
    this.y -= other.y
    return this
  }

  /**
   * Scales the vector by a given amount
   * @param {number} x The x amount to scale by
   * @param {number=} y The y amount to scale by
   * @returns {Vector} This is for chaining
   */
  scale (x, y = x) {
    this.x *= x
    this.y *= y
    return this
  }

  /**
   * Copies the values of another Vector into this one
   * @param {Vector} other The Vector to copy
   * @returns {Vector} This is for chaining
   */
  copy (other) {
    this.x = other.x
    this.y = other.y
    return this
  }

  /**
   * Gives a new Vector with the same properties
   * Used to avoid Object references and allows for deep clones
   * @returns {Vector} The clones Vector
   */
  clone () {
    return Vector.create(this.x, this.y)
  }

  /**
   * Turns the Vector 90 degrees clockwise
   * @returns {Vector} This is for chaining
   */
  perp () {
    const x = this.x
    this.x = this.y
    this.y = -x
    return this
  }

  /**
   * Rotates the Vector by a given amount
   * @param {number} angle The angle to rotate by in radians
   * @returns {Vector} This is for chaining
   */
  rotate (angle) {
    // clone values of this Vector
    const x = this.x
    const y = this.y
    
    // get sin and cosin of angle
    const c = Math.cos(angle)
    const s = Math.sin(angle)

    // use rotational transform to rotate
    this.x = x * c - y * s
    this.y = x * s + y * c
    
    return this
  }

  /**
   * Flips the Vector 180 degrees
   * @returns {Vector} This is for chaining
   */
  reverse () {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  /**
   * Sets the Vectors magnitude to one
   * @returns {Vector} This is for chaining
   */
  normalize () {
    // Get magnitude
    const dist = this.len()
    
    if (dist > 0) {
      // Divide by magnitude to get length equal to one
      this.x /= dist
      this.y /= dist
    }
    
    return this
  }

  /**
   * Projects the Vector onto another
   * @returns {Vector} This is for chaining
   */
  project (other) {
    const a = this.dot(other) / other.len2()
    
    this.x = a * other.x
    this.y = a * other.y
    return this
  }

  /**
   * Projects the Vector onto a normalized Vector
   * A bit more efficient
   * @returns {Vector} This is for chaining
   */
  projectN (other) {
    const a = this.dot(other)
    
    this.x = a * other.x
    this.y = a * other.y
    return this
  }

  /**
   * Reflects the Vector along a given axis
   * @param {Vector} axis The axis to reflect on
   * @returns {Vector} This is for chaining
   */
  reflect (axis) {
    const x = this.x
    const y = this.y

    this.project(axis).scale(2)
    this.x -= x
    this.y -= y
    return this
  }

  /**
   * Reflects the Vector along a normalized axis
   * @param {Vector} axis The axis to reflect on
   * @returns {Vector} This is for chaining
   */
  reflectN (axis) {
    const x = this.x
    const y = this.y

    this.projectN(axis).scale(2)
    this.x -= x
    this.y -= y
    return this
  }

  /**
   * Returns the distance multiplied by the other Vectors
   * Length when projected onto another Vector
   * @param {Vector} other The Vector to dot against
   * @returns {number} The dot product
   */
  dot (other) {
    return this.x * other.x + this.y * other.y
  }

  /**
   * Gets the length squared of the Vector
   * @returns {number} The length Squared
   */
  len2 () {
    return this.dot(this)
  }

  /**
   * Gets the magnitude of the Vector
   * @returns {number} The magnitude of the Vector
   */
  len () {
    return Math.sqrt(this.len2())
  }

  /**
   * Crosses the Vector onto another
   * Can be visualized as the area of the Parrallelogram formed
   * By the two Vectors combined around coordinate (0, 0)
   * @param {Vector} other The other Vector to be crossed against
   * @returns {number} The cross product
   */
  cross (other) {
    return this.x * other.y - this.y * other.x
  }

  /**
   * Sets the magnitude of the Vector to the given value
   * @param {number} mag The resulting magnitude
   * @returns {Vector} This is for chaining
   */
  setMag (mag) {
    // get the magnitude
    const dist = this.len()
    
    // only if magnitude is non zero
    if (dist > 0) {
      // get the scalar
      const s = mag / dist
      
      // scale coordinates
      this.x *= s
      this.y *= s
    }
    return this
  }

  /**
   * Creates a new Vector without having to use the 'new' keyword
   * @param {number} x The x coordinate
   * @param {number} y The y coordinate
   * @static
   */
  static create (x, y) {
    return new Vector(x, y)
  }

  /**
   * Creates a random Vector uniform withing the unit circle
   * @returns {Vector} The random Vector
   * @static
   */
  static random () {
    // get a random angle
    const angle = random(0, TWO_PI)
    
    // convert to cartesian
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    
    // return calculated Vector
    return Vector.create(x, y)
  }

  /**
   * Creates a new Vector randomly given two angular bounds
   * @param {number} startAngle The minimum angle
   * @param {number} endAngle The maximum angle
   * @returns {Vector} The random Vector
   * @static
   */
  static randomFromAngles (startAngle, endAngle) {
    // get the random angle
    const angle = random(startAngle, endAngle)
    
    // convert to cartesian coordinates
    const x = Math.cos(angle)
    const y = Math.sin(angle)
    
    // return the calculated Vector
    return Vector.create(x, y)
  }

  /**
   * Creates a new Vector sampled uniformly from the given box
   * @param {number} w The width of the box to be sampled from
   * @param {number=} h The height of the box to be sampled from
   * @returns {Vector} The random Vector
   * @static
   */
  static randomFromBox (w, h = w) {
    // get random coordinates
    const x = random(-w, w)
    const y = random(-h, h)
    
    // return calculated Vector
    return Vector.create(x, y)
  }
}
