/**
 * Class representing the bounding box, AABB of a Polygon, Circle or Body
 * @class Box
 * @classdesc Used for efficient collision detection
 */
class Box {
  /**
   * Creates a Box
   * @param {Vector} min The upper left constraint
   * @param {Vector} max The lower right constraint
   */
  constructor (min, max) {
    /**
     * The minimum bound
     * @name Box#min
     * @type {Vector}
     * @instance
     */
    this.min = min
    /**
     * The maximum bound
     * @name Box#max
     * @type {Vector}
     * @instance
     */
    this.max = max
  }

  /**
   * Converts the Box to a polygon
   * @param {number=} density The resulting density of the returned polygon
   * @return {Polygon} The resulting calculated polygon
   */
  toPolygon(density = 1) {
    // The difference between the maximum
    // and minimum bounds of the object
    let diff = this.max.clone().sub(this.min)

    // The size of the resulting polygon
    // Given as the x value of the difference So that the
    // Resulting polygon will have a dynamic size
    const size = diff.x

    // Scale the difference down so that the points
    // Can be made with the propper size
    diff.scale(1 / size)

    // Set the points of the resulting polygon
    // Order is (Upper left, Upper right, Down right, Down left)
    const points = [
      Vector.create(),
      Vector.create(diff.x),
      Vector.create(diff.x, diff.y),
      Vector.create(0, diff.y)
    ]

    // Clone the minimum which will be the center of the new Polygon
    // Avoids having a read-only value that changes the original minimum
    const min = this.min.clone()

    // Return the new Polygon with all the properties
    return Polygon.create(min, points, density, size)
  }

  /**
   * Creates a new Box without having to use the 'new' keyword
   * @param {Vector} min - The upper left constraint
   * @param {Vector} max - The lower right constraint
   * @returns {Box} The new instanceof Box
   * @static
   */
  static create (min, max) {
    return new Box(min, max)
  }
}
