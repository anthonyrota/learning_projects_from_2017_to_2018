class Ray {
  constructor(origin, direction) {
    this.origin = origin.toArray();
    this.direction = direction.toArray();
  }
  
  setOrigin(origin) {
    this.origin = origin.toArray();
  }
  
  setDirection(direction) {
    this.direction = direction.toArray();
  }
  
  set(origin, direction) {
    this.origin = origin.toArray();
    this.direction = direction.toArray();
  }
  
  distanceToBox(aabb) {
    const dims = this.origin.length;
    
    let lo = -Infinity;
    let hi = +Infinity;
  
    for (let i = 0; i < dims; i++) {
      let dimLo = (aabb[0][i] - this.origin[i]) / this.direction[i];
      let dimHi = (aabb[1][i] - this.origin[i]) / this.direction[i];
  
      if (dimLo > dimHi) {
        [dimLo, dimHi] = [dimHi, dimLo];
      }
  
      if (dimHi < lo || dimLo > hi) {
        return Infinity;
      }
  
      if (dimLo > lo) lo = dimLo;
      if (dimHi < hi) hi = dimHi;
    }
  
    return lo > hi ? Infinity : lo;
  }
}

export default Ray;
