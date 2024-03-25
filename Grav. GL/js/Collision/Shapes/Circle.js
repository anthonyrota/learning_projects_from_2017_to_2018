/**
 * Class representing the Circle object, used in the game
 * @class Circle
 * @classdesc Creates a new circle with dynamic properties
 */
 class Circle {
  /**
   * Creates a new Circle
   * @param {Vector} pos The position of the circle
   * @param {number} r The radius of the circle
   * @param {number=} density The density of the circle
   */
  constructor (pos, r, density = 1) {
    /**
     * The center of the Circle
     * @name Circle#pos
     * @type {Vector}
     * @instance
     */
    this.pos = pos
    /**
     * The radius of the circle
     * @name Circle#r
     * @type {number}
     * @instance
     */
    this.r = r
    /**
     * The density of the Circle
     * @name Circle#density
     * @type {number}
     * @instance
     */
    this.density = density

    /**
     * States that the Object is a Circle, used instead of 'instanceof'
     * @name Circle#type
     * @type {number}
     * @default 1
     * @instance
     */
    this.type = TYPE_CIRCLE

    // Recalc all of the properties
    this.recalc()
  }

  /**
   * Recalcs the Circle
   */
  recalc () {
    // Recalc mass and AABB
    this.calcMass()
    this.calcAABB()
  }

  /**
   * Calculates the mass of the Circle
   */
  calcMass () {
    const r = this.r
    
    // get radius squared
    const rSq = r ** 2
    
    // get mass by PI r^2 multiplied by density
    const mass = PI * rSq * this.density

    /**
     * The mass of the circle
     * @name Circle#mass
     * @type {number}
     * @instance
     */
    this.mass = mass
    /**
     * The inverse mass of the circle, stored so less calculations take place
     * @name Circle#invMass
     * @type {number}
     * @instance
     */
    this.invMass = 1 / mass
  }

  /**
   * Calculates the density of the Circle
   * @param {number} density The density of the Circle
   */
  setDensity (density) {
    // set the new density
    this.density = density

    // recalc the mass
    this.calcMass()
  }

  /**
   * Adds to the radius of the Circle
   * @param {number} amount The amount to add to the radius
   */
  addSize (amount) {
    // increase the radius then recalc
    this.r += amount
    this.recalc()
  }

  /**
   * Sets the size of the Circle
   * @param {number} r The new radius of the circle
   */
  setSize (r) {
    // set the new radius then recalc
    this.r = r
    this.recalc()
  }

  /**
   * Scales the radius of the Circle
   * @param {number} sc The scalar to scale up by
   */
  scale (sc) {
    // scale the radius then recalc
    this.r *= sc
    this.recalc()
  }

  /**
   * Sets the position of the circle
   * @param {Vector} pos The new position of the Circle
   */
  setPosition (pos) {
    // set the position then recalc the AABB
    this.pos = pos
    this.calcAABB()
  }

  /**
   * Moves the Circle by a certain amount
   * @param {Vector} vec The vector to move by
   */
  move (vec) {
    // add the vel/vec to the position then recalc AABB
    this.pos.add(vec)
    this.calcAABB()
  }

  /**
   * Recalcs the AABB of the Circle
   */
  calcAABB () {
    // Shorthand properties
    const pos = this.pos
    const r = this.r

    // calculate min and max of new AABB
    const min = pos.clone().sub(r, r)
    const max = pos.clone().add(r, r)

    /**
     * The AABB of the Circle
     * @name Circle#AABB
     * @type {Box}
     * @instance
     */
    this.AABB = Box.create(min, max)
  }

  /**
   * Creates a new Circle without having to use the 'new' keyword
   * @param {Vector} pos The position of the circle
   * @param {number} r The radius of the circle
   * @param {number} density The density of the circle
   * @returns {Circle} The new Circle
   * @static
   */
  static create (pos, r, density) {
    return new Circle(pos, r, density)
  }
}
