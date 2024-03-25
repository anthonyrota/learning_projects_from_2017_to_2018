/**
 * @prop {Vector[]} RegularPolygonPoints The array to be referenced for the Regular Polygons points
 * @global
 * @final
 */
const RegularPolygonPoints = ((amount) => {
  /**
   * A function to generate Regular Polygon Points given a number of points
   * @param {number} numberSides The number of sides
   * @returns {Vector[]} The calculated points
   * @private
   * @function
   */
  const _generatePolygonPoints = (numberSides) => {
    // get the difference to add in angle
    const da = TWO_PI / numberSides

    let points = []
    let v
    let x
    let y

    // for each angle:
    for (let a = 0; a < TWO_PI; a += da) {
      // use polar conversion to cartesian for x, y values
      x = Math.cos(a)
      y = Math.sin(a)

      // get the vector and add to points
      v = Vector.create(x, y)
      points.push(v)
    }
    return points
  }

  // constant array for polygons points
  const array = []
  let points

  // loop through untill the amount specified and fill
  // that array spot with generated points
  for (let i = 3; i < amount; i++) {
    points = _generatePolygonPoints(i)
    array[i] = points
  }

  return array
})(50)

/**
 * Class representing the RegularPolygon object, used in the game
 * @class RegularPolygon
 * @classdesc Creates a new RegularPolygon and returns a normal Polygon
 */
class RegularPolygon {
  /**
   * Creates a RegularPolygon
   * @param {Vector} pos The position of the Polygon
   * @param {number} numberSides The number of sides
   * @param {number=} density The density of the circle
   * @param {number=} size The size of the Polygon
   * @param {number=} angle The initial angle of the Polygon
   * @return {Polygon} The calculated polygon
   */
  constructor (pos, numberSides = 5, density = 1, size = 1, angle = 0) {
    // get the points
    const vertices = RegularPolygonPoints[numberSides]
    const points = cloneVectorArray(vertices)
    
    // return the polygon
    return Polygon.create(pos, points, density, size, angle)
  }

  /**
   * Creates a RegularPolygon without having to use the new keyword
   * @param {Vector} p The position of the Polygon
   * @param {number} n The number of sides
   * @param {number=} d The density of the circle
   * @param {number=} s The size of the Polygon
   * @param {number=} a The initial angle of the Polygon
   * @returns {Polygon} The calculated polygon
   * @static
   */
  static create (p, n, d, s, a) {
    return new RegularPolygon(p, n, d, s, a)
  }
}
