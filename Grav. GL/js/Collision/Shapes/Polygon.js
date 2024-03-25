/**
 * Class representing the Polygon object, used in the game
 * @class Polygon
 * @classdesc Creates a new polygon with dynamic properties
 */
class Polygon {
  /**
   * Creates a new Polygon
   * @param {Vector} pos The position of the Polygon
   * @param {Vector[]} points The points for the polygon
   * @param {number=} density The density of the circle
   * @param {number=} size The size of the Polygon
   * @param {number=} angle The initial angle of the Polygon
   */
  constructor (pos, points, density = 1, size = 1, angle = false) {
    /**
     * The center of the Polygon, initialized as the position
     * @name Polygon#pos
     * @type {Vector}
     * @instance
     */
    this.pos = pos
    /**
     * The angle of the Polygon measured in radians
     * @name Polygon#angle
     * @type {number}
     * @default 0
     * @instance
     */
    this.angle = 0
    /**
     * The size of the Polygon / How big it is
     * @name Polygon#size
     * @type {number}
     * @default 1
     * @instance
     */
    this.size = size
    /**
     * The density of the Polygon
     * @name Polygon#density
     * @type {number}
     * @default 1
     * @instance
     */
    this.density = density
    /**
     * The type of the Polygon, always equals to the constant
     * @name Polygon#type
     * @type {number}
     * @instance
     * @final
     */
    this.type = TYPE_POLYGON

    // set the points
    this.setPoints(points)

    // if an angle was inputted then rotate
    if (angle) this.rotate(angle)
  }

  /**
   * Calculates the mass of the Polygon
   */
  calcMass () {
    // set shorthand variables
    const density = this.density
    const points = this.calcPoints
    const len = points.length

    // Set temporary variables
    let area = 0
    let point
    let next
    let sum

    // loop through all the points
    for (let i = 0; i < len; i++) {
      point = points[i]
      next = (i === len - 1) ? points[0] : points[i + 1]

      // get the area of the region and add it to the total
      sum = point.cross(next)
      area += sum
    }

    area *= 0.5
    this.area = area

    // get mass
    const mass = area * density

    // set mass properties

    /**
     * The mass of the Polygon
     * @name Polygon#mass
     * @type {number}
     * @instance
     */
    this.mass = mass
    /**
     * The inverse mass of the Polygon (1 / mass)
     * @name Polygon#invMass
     * @type {number}
     * @instance
     */
    this.invMass = 1 / mass
  }

  /**
   * Gets the center of the polygon
   * @param {number} area The current area of the Polygon
   * @returns {Vector} the center of the Polygon
   */
  getCenter (area) {
    // set the scalar which will scale each point
    const scalar = 1 / (6 * area)

    const points = this.calcPoints
    const len = points.length

    let center = Vector.create()
    let point
    let next
    let scal

    // loop through all the points
    for (let i = 0; i < len; i++) {
      point = points[i]
      next = (i === len - 1) ? points[0] : points[i + 1]

      // get the scalar
      scal = point.cross(next)

      // move the center
      center.x += (point.x + next.x) * scal
      center.y += (point.y + next.y) * scal
    }

    center.scale(scalar)

    // return the calculated center
    return center
  }

  /**
   * Sets the density of the Polygon
   * @param {number} density The density of the Polygon
   */
  setDensity (density) {
    // set the new density and recalc mass
    this.density = density
    this.calcMass()
  }

  /**
   * Sets the points of the Polygon
   * @param {Vector[]} points The new points of the Polygon
   */
  setPoints (points) {
    const len = points.length

    // reset arrays
    const calcPoints = []
    const edges = []
    const normals = []

    // loop through length
    for (let i = 0; i < len; i++) {
      // add a Vector to each array
      calcPoints.push(Vector.create())
      edges.push(Vector.create())
      normals.push(Vector.create())
    }

    // set points and other properties

    /**
     * The points of the Polygon
     * @name Polygon#points
     * @type {Vector[]}
     * @instance
     */
    this.points = points
    /**
     * The calculated collision points for the Polygon
     * @name Polygon#calcPoints
     * @type {Vector[]}
     * @instance
     */
    this.calcPoints = calcPoints
    /**
     * The edges of the Polygon
     * @name Polygon#edges
     * @type {Vector[]}
     * @instance
     */
    this.edges = edges
    /**
     * The normals of the Polygon
     * @name Polygon#normals
     * @type {Vector[]}
     * @instance
     */
    this.normals = normals

    // recalculate normals and mass
    this.recalc()
    this.calcMass()

    // get center

    /**
     * The center of the polygon, equivalent to the position, only temporary
     * @name Polygon#center
     * @type {Vector}
     * @instance
     */
    this.center = this.getCenter(this.area)

    // offset points to have the position be the center
    const diff = this.pos.clone().sub(this.center).scale(1 / this.size)
    this.translate(diff.x, diff.y)
  }

  /**
   * Sets the angle of the Polygon
   * @param {number} angle The new angle measured in radians
   */
  setAngle (angle) {
    // set the angle and recalc
    this.angle = angle
    this.recalc()
  }

  /**
   * Rotates the Polygon by a given angle
   * @param {number} angle The angle to rotate by measured in radians
   */
  rotate (angle) {
    // increase the angle then recalc
    this.angle += angle
    this.recalc()
  }

  /**
   * Translates the Polygons original points by an x and y value
   * @param {number} x The x value to translate by
   * @param {number} y The y value to translate by
   */
  translate (x, y) {
    // get points
    const points = this.points

    // loop through points
    for (let i = 0; i < points.length; i++) {
      // translate each point
      points[i].x += x
      points[i].y += y
    }

    // recalc normals, etc
    this.recalc()
  }

  /**
   * Handles a change in size
   */
  handleChange () {
    // recalc mass and normals, etc
    this.calcMass()
    this.recalc()
  }

  /**
   * Scales the polygon by a scalar
   * @param {number} sc The scalar to scale by
   */
  scale (sc) {
    // scale the size and recalc everything
    this.size *= sc
    this.handleChange()
  }

  /**
   * Sets the size of the Polygon
   * @param {number} size The new size
   */
  setSize (size) {
    // change the size and recalc everthing
    this.size = size
    this.handleChange()
  }

  /**
   * Increases the size of the Polygon
   * @param {number} amount The amount to increase the size by
   */
  addSize (amount) {
    // increase the size and recalc everything
    this.size += amount
    this.handleChange()
  }

  /**
   * Sets the new Position of the Polygon
   * @param {Vector} pos The new position
   */
  setPosition (pos) {
    // set the new position and recalc
    this.pos = pos
    this.recalc()
  }

  /**
   * Moves the Polygon by a certain amount
   * @param {Vector} vec The amount to move by
   */
  move (vec) {
    this.pos.add(vec)
    this.recalc()
  }

  /**
   * Recalculates the polygons normals and other properties
   */
  recalc () {
    // The points of the Polygon, given in a Vector array
    // Are the original points that will remain unchanged
    // And are only to reference off of and copy into other Vectors
    const points = this.points

    // The calculated points of the Polygon which are to be used
    // In collision testing and rendering, they include the given
    // angle and size etc. in the calculation
    const calcPoints = this.calcPoints

    // The angle of the polygon in which the calcPoints will be rotated by
    const angle = this.angle

    // The edges of the polygon which each are a Vector that represents
    // a single edge which is calculated by subtracting one of the points
    // by another
    const edges = this.edges

    // The normals of the polygon to be used in collision detection
    // Is a normalized edge of the Polygon
    const normals = this.normals

    // The size of the polygon which the calcPoints will be scaled by
    const size = this.size

    // How many points there are
    const len = points.length

    // set the temp variables
    let tempVector = Vector.create()
    let distance = 0
    let bestDistance = 0

    // loop through all the points
    for (let i = 0; i < len; i++) {
      const point = this.points[i]

      // initially set the calcPoint
      let calcPoint = calcPoints[i].copy(point).scale(size)

      // if there is an angle than rotate the point
      if (angle !== 0) calcPoint.rotate(angle)

      // calculate squared distance to center then store it
      // if it is the furthest distance
      distance = tempVector.copy(calcPoint).len2()
      if (distance > bestDistance) bestDistance = distance

      calcPoint.add(this.pos)
    }

    // set the radius of the polygon as the furthest distance from the center
    this.r = Math.sqrt(bestDistance)

    // loop through all the points
    for (let i = 0; i < len; i++) {
      const point1 = calcPoints[i]
      const point2 = (i < len - 1) ? calcPoints[i + 1] : calcPoints[0]

      // get the edge as the points subtracted from eachother
      const edge = edges[i].copy(point2).sub(point1)

      // finally calculate the normal
      normals[i].copy(edge).perp().normalize()
    }

    // calculate the AABB of the Polygon
    this.AABB = this.getAABB()
  }

  /**
   * Calculates the AABB of the Polygon
   * @returns {Box} The calculated AABB
   */
  getAABB () {
    const points = this.calcPoints

    // initialize the min and max vars
    let xMin = points[0].x
    let yMin = points[0].y
    let xMax = points[0].x
    let yMax = points[0].y

    // loop through all the points
    for (let i = 0; i < points.length; i++) {
      const point = points[i]

      // if it is less or larger set the x value as min / max
      if (point.x < xMin) {
        xMin = point.x
      } else if (point.x > xMax) {
        xMax = point.x
      }

      // if it is less or larger set the y value as min / max
      if (point.y < yMin) {
        yMin = point.y
      } else if (point.y > yMax) {
        yMax = point.y
      }
    }

    // get the min and max as a combination of the individual variables
    const min = Vector.create(xMin, yMin)
    const max = Vector.create(xMax, yMax)

    // return the new Box
    return Box.create(min, max)
  }

  /**
   * Creates a new Polygon without having to use the 'new' keyword
   * @param {Vector} pos The position of the Polygon
   * @param {Vector[]} points The points for the polygon
   * @param {number=} density The density of the circle
   * @param {number=} size The size of the Polygon
   * @param {number=} angle The initial angle of the Polygon
   * @returns {Polygon} The new Polygon
   * @static
   */
  static create (pos, points, density, size, angle) {
    return new Polygon(pos, points, density, size, angle)
  }
}
