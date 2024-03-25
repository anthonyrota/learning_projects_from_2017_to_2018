/**
 * Class representing Manifold for collision testing
 * @class Manifold
 * @classdesc Stores data for after a collision took place
 */
class Manifold {
  /**
   * Creates a new Manifold
   */
  constructor () {
    this.reset()
  }

  /**
   * Resets the values of the Manifold
   */
  reset () {
    this.normal = Vector.create()
    this.exitV = Vector.create()

    this.penetration = Number.MAX_VALUE
  }

  /**
   * Creates a new Manifold without having to use the 'new' keyword
   * @returns {Manifold} The calculated Manifold
   * @static
   */
  static create () {
    return new Manifold()
  }
}
