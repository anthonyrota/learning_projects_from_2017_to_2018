/**
 * Class representing the SAT object, used for collision detection
 * @class SAT
 * @classdesc Is a namespace for a collision tester
 */
class SAT {
  /**
   * Creates a new instance of SAT
   */
  constructor () {
    /**
     * An array of Vectors to avoid allocating memory
     * @name SAT#TVECS
     * @type {Vector[]}
     * @instance
     */
    this.TVECS = []

    // fill with 10 Vectors
    for (let i = 0; i < 10; i++) {
      this.TVECS.push(Vector.create())
    }
  }

  /**
   * Gets the minimum and maximum points on an axis
   * @param {Vector[]} points The points to test on
   * @param {Vector} normal The normalized axis
   * @param {number[]} result The array which the values will be stored in
   */
  flattenPointsOn (points, normal, result) {
    // set min and max as Infinity and -Infinity
    let min = Number.MAX_VALUE
    let max = -min

    for (let i = 0; i < points.length; i++) {
      // get the dot and if smaller or larger store it
      const dot = points[i].dot(normal)
      if (dot < min) min = dot
      if (dot > max) max = dot
    }

    // store the results
    result[0] = min
    result[1] = max
  }

  /**
   * Decides whether an axis separates two sets of points
   * @param {Vector} aPos The position of Polygon A
   * @param {Vector} bPos The position of Polygon B
   * @param {Vector[]} aPoints The points of Polygon A
   * @param {Vector[]} bPoints The points of Polygon B
   * @param {Vector} axis The normalized axis to test on
   * @param {Manifold} manifold The manifold for the result to be outputed
   * @param {boolean=} isCircle Whether Shape B is a circle
   * @param {number=} radius How big the circle is if it is a circle
   * @returns {boolean} Whether there is a separating axis
   */
  isSeparatingAxis (aPos, bPos, aPoints, bPoints, axis, manifold, isCircle, radius) {
    // init ranges
    let rangeA = [0, 0]
    let rangeB = [0, 0]

    // get min and max
    this.flattenPointsOn(aPoints, axis, rangeA)
    this.flattenPointsOn(bPoints, axis, rangeB)

    // deal with whether it is a circle
    if (isCircle) {
      rangeB[0] -= radius
      rangeB[1] += radius
    }

    // set shorthand vars
    const [ minA, maxA ] = rangeA
    const [ minB, maxB ] = rangeB

    // early escape
    if (minA > maxB || minB > maxA) return true

    // init vars
    let overlap = 0
    let option1
    let option2

    // calculate overlap based off of a tree of options
    if (minA < minB) {
      if (maxA < maxB) {
        overlap = maxA - minB
      } else {
        option1 = maxA - minB
        option2 = maxB - minA
        overlap = option1 < option2 ? option1 : -option2
      }
    } else {
      if (maxA > maxB) {
        overlap = minA - maxB
      } else {
        option1 = maxA - minB
        option2 = maxB - minA
        overlap = option1 < option2 ? option1 : -option2
      }
    }

    // get penetration
    const penetration = abs(overlap)

    // decide if penetration is smaller, then save it
    if (penetration < manifold.penetration) {
      manifold.penetration = penetration
      manifold.normal.copy(axis)

      // if the overlap is negative reverse the normal
      if (overlap < 0) manifold.normal.reverse()
    }

    // there was no separating axis
    return false
  }

  /**
   * Decides if two AABBs collide
   * @param {Box} a The first AABB
   * @param {Box} b The second AABB
   * @returns {boolean} Whether they collide
   */
  AABB (a, b) {
    return !(
      a.min.x > b.max.x ||
      a.max.x < b.min.x ||
      a.min.y > b.max.y ||
      a.max.y < b.min.y
    )
  }
  
  /**
   * Decides whether two circles are colliding
   * @param {Circle} a The first Circle
   * @param {Circle} b The second Circle
   * @param {Manifold} manifold The manifold to store the collision data
   * @returns {boolean} Whether the two circles are colliding
   */
  circleCircle (a, b, manifold) {
    // get the separation vector and distance
    // as well as total radius
    const distV = this.TVECS.pop().copy(b.pos).sub(a.pos)
    const totalR = a.r + b.r
    const totalRSq = totalR ** 2
    const distSq = distV.len2()

    this.TVECS.push(distV)

    // if the distance is greater than the radii then
    // they are not colliding
    if (distSq > totalRSq) return false

    // calculate real distance
    const dist = Math.sqrt(dist2)

    // store collision data
    manifold.penetration = totalR - dist
    manifold.normal.copy(distV.normalize())
    manifold.exitV.copy(distV).scale(manifold.penetration)
    
    // they have collided
    return true
  }

  /**
   * Decides whether a Polygon is colliding with a Circle
   * @param {Polygon} polygon The Polygon
   * @param {Circle} circle The Circle
   * @param {Manifold} manifold The manifold to hold the collision data
   * @returns {boolean} Whether they have collided
   */
  polygonCircle (polygon, circle, manifold) {
    // early escape if AABBs are not touching
    if (!this.AABB(polygon.AABB, circle.AABB)) return false

    // aliases
    const points = polygon.calcPoints
    const normals = polygon.normals
    const len = points.length
    const pPos = polygon.pos
    const cPos = circle.pos
    const r = circle.r
    const cPoints = [cPos]

    let distSq = 0
    let axis = this.TVECS.pop()
    let bestAxis = this.TVECS.pop()
    let bestDist = Number.MAX_VALUE

    // loop through points and get least distance
    for (let i = 0; i < len; i++) {
      axis.copy(cPos).sub(points[i])
      distSq = axis.len2()

      if (distSq < bestDist) {
        bestDist = distSq
        bestAxis.copy(axis)
      }
    }
    
    // normalize the axis
    bestAxis.normalize()

    this.TVECS.push(axis)
    this.TVECS.push(bestAxis)

    // test the centerToClosestPoint axis and if there is early escape
    if (this.isSeparatingAxis(pPos, cPos, points, cPoints, bestAxis, manifold, true, r)) return false

    // loop through Polygons axis and test against
    for (let i = 0; i < len; i++) {
      if (this.isSeparatingAxis(pPos, cPos, points, cPoints, normals[i], manifold, true, r)) return false
    }

    // get data as they have collided
    manifold.exitV.copy(manifold.normal).scale(manifold.penetration * 1.1)
    return true
  }

  /**
   * Decides whether a Circle is colliding with a Polygon
   * @param {Circle} a The Circle
   * @param {Polygon} b The Polygon
   * @param {Manifold} manifold The manifold to hold the collision data
   * @returns {boolean} Whether they have collided
   */
  circlePolygon (a, b, manifold) {
    const result = this.polygonCircle(b, a, manifold)

    // reverse data and return result
    manifold.normal.reverse()
    manifold.exitV.reverse()
    return result
  }

  /**
   * Decides whether two polygons are colliding
   * @param {Polygon} a The first Polygon
   * @param {Polygon} b The second Polygon
   * @param {Manifold} manifold The manifold to store the collision data
   * @returns {boolean} Whether they have collided
   */
  polygonPolygon (a, b, manifold) {
    // early escape if AABBs are not colliding
    if (!this.AABB(a.AABB, b.AABB)) return false

    // aliases
    const aPoints = a.calcPoints
    const bPoints = b.calcPoints
    const aPos = a.pos
    const bPos = b.pos
    const aNormals = a.normals
    const bNormals = b.normals

    // loop through Polygon a axis and test for separation
    for (let i = 0; i < aPoints.length; i++) {
      if (this.isSeparatingAxis(aPos, bPos, aPoints, bPoints, aNormals[i], manifold)) return false
    }

    // loop through Polygon b axis and test for separation
    for (let i = 0; i < bPoints.length; i++) {
      if (this.isSeparatingAxis(aPos, bPos, aPoints, bPoints, bNormals[i], manifold)) return false
    }

    // they are colliding so calculate escape Vector and return
    manifold.exitV.copy(manifold.normal).scale(manifold.penetration * 1.1)
    return true
  }

  /**
   * Decides whether two shapes are colliding
   * @param {Polygon|Circle} a The first shape
   * @param {Polygon|Circle} b The second shape
   * @param {Manifold} manifold The object that will hold the collision data
   * @returns {boolean} Whether the two shapes have collided or not
   */
  collision (a, b, manifold) {
    // decide which type each one is
    const aIsPolygon = a.type === TYPE_POLYGON
    const bIsPolygon = b.type === TYPE_POLYGON

    // go through each possibility and return the result
    if (aIsPolygon) {
      if (bIsPolygon) {
        // A is polygon and B is polygon
        return this.polygonPolygon(a, b, manifold)
      }
      // A is polygon and B is circle
      return this.polygonCircle(a, b, manifold)
    }
    if (bIsPolygon) {
      // A is circle and B is polygon
      return this.circlePolygon(a, b, manifold)
    }
    // A is circle and B is circle
    return this.circleCircle(a, b, manifold)
  }

  /**
   * Solves a collision between two bodies
   * @param {Body} mover The body that will be pushed out of the way and
   *   who will be tested against the other body
   * @param {Body} body The static body that will be tested against
   *   the mover
   * @param {Manifold} manifold The object to hold the collision data
   * @param {boolean=} noRotate Whether the mover can not rotate or can rotate
   * @returns {boolean} Whether they have collided
   */
  solveCollision (mover, body, manifold, noRotate) {
    manifold.reset()

    // get relative velovity and position
    const relativeVelocity = this.TVECS.pop().copy(mover.vel).sub(body.vel)
    const relativePosition = this.TVECS.pop().copy(mover.shape.pos).sub(body.shape.pos)

    // decide if they are moving towards eachother
    const dotProduct = relativeVelocity.dot(relativePosition)
    const isMovingTowards = dotProduct < 0

    this.TVECS.push(relativeVelocity)
    this.TVECS.push(relativePosition)

    // get collision data
    const result = this.collision(mover.shape, body.shape, manifold)

    // only solve collision if they have collided
    if (result) {
      // move the mover out of the path
      mover.shape.pos.sub(manifold.exitV)

      // only if they are moving towards eachother
      // and the mover is not involved in a collision
      if (isMovingTowards && !mover.inCollision) {
        // only if the mover can rotate do the rotation
        if (noRotate) {
          // if cant rotate than just reflect against the normal
          mover.vel.reflectN(manifold.normal.perp())
        } else {
          // get velocity and collision normal
          let vel = this.TVECS.pop().copy(mover.vel)
          let normal = manifold.normal.perp()

          // calculate differences in angles
          const befAngle = vel.getAngle()
          const aftAngle = vel.reflectN(normal).getAngle()

          let angle = aftAngle - befAngle

          // constrain angles
          if (angle > PI) angle -= TWO_PI
          else if (angle < -PI) angle += TWO_PI

          // update mover data and collision
          mover.vel.scale(mover.restitution)
          mover.rotate(angle)
          mover.inCollision = true

          this.TVECS.push(vel)
        }
      }

      // they have collided so return true
      return true
    }

    // they have not collided so return false
    return false
  }

  /**
   * Creates a new instanceof the SAT class without having to use the 'new' keyword
   * @returns {SAT} The new SAT class
   * @static
   */
  static create () {
    return new SAT()
  }
}
