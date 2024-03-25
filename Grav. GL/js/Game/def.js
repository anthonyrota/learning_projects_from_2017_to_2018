const Def = class {
  constructor(options = {}) {
    this.set(options)
  }

  set (options) {
    const defaults = {
      vel: Vector.create(),
      angle: 0,
      rotate: 0,
      fillColor: '#000',
      strokeColor: RGBA.random(1),
      strokeWidth: 8,
      oscilate: false,
      oscilationStrength: 0,
      minOscilatonSize: 0,
      oscilationSpeed: 0,
      restitution: 0.9,
      shrinkSpeed: 0.95,
      enemy: false,
      lifespan: false
    }

    for (let value in defaults) {
      if (value in options) {
        this[value] = options[value]
      } else {
        this[value] = defaults[value]
      }
    }

    return this
  }

  clone () {
    let clone = {}

    for (let value in this) {
      clone[value] = ((v) => {
        if (v instanceof Vector) return v.clone()
        if (v instanceof RGBA) return v.copy()
        return v
      })(this[value])
    }

    return clone
  }

  reset () {
    this.set({})
    return this
  }

  static create (options) {
    return new Def(options)
  }
}

// const Def = class {
//     constructor(options = {}) {
//         this.set(options);
//     }
//
//     static create(options) {
//         return new Def(options);
//     }
// };
