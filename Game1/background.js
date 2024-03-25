var background = {

  data: null,
  running: null,
  currentnum: null,
  resizing: false,
  
  init: function(num) {
  this.data = JSON.parse(JSON.stringify(images.backgrounds[num]));
  var ilen = this.data.length;
  for (var i = 0; i < ilen; i++) {
    var jlen = this.data[i].length;
    for (var j = 0; j < jlen; j++) {
      this.data[i][j].img = images.backgrounds[num][i][j].img;
    }
  }
    this.currentnum = num;
    this.running = true;
    window.cancelAnimationFrame(animbackground);
    animbackground = window.requestAnimationFrame(drawbackground);
  },
  
  update: function(depth) {
    var ilen = this.data.length;
    for (var i = 0; i < ilen; i++) {
      var jlen = this.data[i].length;
      for (var j = 0; j < jlen; j++) {
        if (this.data[i][j].depth === depth) {
          this.data[i][j].width = (canvas.height/this.data[i][j].baseheight)*this.data[i][j].basewidth;
          this.data[i][j].height = canvas.height;
          ctx.drawImage(this.data[i][j].img,this.data[i][j].x,this.data[i][j].y,this.data[i][j].width,this.data[i][j].height);
          this.data[i][j].x -= (this.data[i][j].speed/1366)*canvas.width;
          
          var btempcalc = this.data[i][j].x + this.data[i][j].width;
          if (btempcalc < canvas.width && this.data[i][j].add) {
            this.data[i][j].add = false;
            this.data[i].push(addbackground(this.data[i][j].img.src, this.data[i][j].speed, this.data[i][j].basewidth, this.data[i][j].baseheight, this.data[i][j].x + this.data[i][j].width, this.data[i][j].y, this.data[i][j].depth, 0));
          }
        
          if (btempcalc < 0) {
            this.data[i].splice(j, 1);
            jlen--;
            j--;
          }
        }
      }
    }
  },
  
  end: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.running = false;
    this.data = null;
  }
};