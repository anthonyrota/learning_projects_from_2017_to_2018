class ViewLimit {
  constructor (max, w) {
    this.x = max;
    this.y = max;
    this.w = w;
  }
  
  update (camera) {
    this.minx = camera.x - this.x - this.w / 2;
    this.miny = camera.y - this.y - this.w / 2;
    
    this.maxx = 2 * this.x + this.w;
    this.maxy = 2 * this.y + this.w;
    
    this.w = 10;
  }
}