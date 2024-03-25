export const TriangleProjection = {
  textureTriangle(
    context, texture,
    x0, x1, x2,
    y0, y1, y2,
    u0, u1, u2,
    v0, v1, v2
  ) {
    context.save();
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.closePath();
    context.clip();
    
    x1 -= x0;
    y1 -= y0;
    x2 -= x0;
    y2 -= y0;
    u1 -= u0;
    v1 -= v0;
    u2 -= u0;
    v2 -= v0;
    
    const id = 1 / (u1 * v2 - u2 * v1);
    const a = id * (v2 * x1 - v1 * x2);
    const b = id * (v2 * y1 - v1 * y2);
    const c = id * (u1 * x2 - u2 * x1);
    const d = id * (u1 * y2 - u2 * y1);
    const e = x0 - a * u0 - c * v0;
    const f = y0 - b * u0 - d * v0;
    
    context.transform(a, b, c, d, e, f);
    context.drawImage(texture, 0, 0);
    
    context.restore();
  }
};

const createTexture = (x, y, u, v) => ({ x, y, u, v });

const lerp = (a, b, p) => {
  const ax = 'x' in a ? a.x : a[0];
  const ay = 'y' in a ? a.y : a[1];
  const bx = 'x' in b ? b.x : b[0];
  const by = 'y' in b ? b.y : b[1];
  
  return [
    ax + (bx - ax) * p,
    ay + (by - ay) * p
  ];
};

export const SquareProjection = {
  formTextures(grid) {
    const textures = [];
    
    for (let i = 0; i < grid.length - 1; i++) {
      for (let j = 0; j < grid[i].length - 1; j++) {
        const tl = grid[i][j];
        const tr = grid[i + 1][j];
        const bl = grid[i][j + 1];
        const br = grid[i + 1][j + 1];
        
        textures.push([
          createTexture.apply(createTexture, tl),
          createTexture.apply(createTexture, tr),
          createTexture.apply(createTexture, br),
          createTexture.apply(createTexture, bl)
        ]);
      }
    }
    
    return textures;
  },
  
  subdivide(a, b, c, d, ax, ay) {
    const right = this.subdivideLine(b, c, ay);
    const left = this.subdivideLine(a, d, ay);
    
    const grid = [];
    
    for (let i = 0; i <= ax; i++) {
      grid[i] = [];
      const iP = i / ax;
  
      for (let j = 0; j <= ay; j++) {
        const jP = j / ay;
        const lerped = lerp(left[j], right[j], iP);
        
        grid[i][j] = [
          lerped[0],
          lerped[1],
          jP, iP
        ];
      }
    }
    
    return this.formTextures(grid);
  },
  
  subdivideLine(a, b, amount) {
    let points = [];
    
    for (let i = 0; i <= amount; i++) {
      points.push(lerp(a, b, i / amount));
    }
    
    return points;
  },
  
  textureSquare(context, texture, pts) {
    const tris = [[0, 1, 2], [2, 3, 0]];
    const { width, height } = texture;
    
    for (let t = 0; t < 2; t++) {
      const pp = tris[t];
    
      const p0 = pts[pp[0]];
      const p1 = pts[pp[1]];
      const p2 = pts[pp[2]];
      
      TriangleProjection.textureTriangle(
        context, texture,
        p0.x, p1.x, p2.x,
        p0.y, p1.y, p2.y,
        p0.u * width, p1.u * width, p2.u * width,
        p0.v * height, p1.v * height, p2.v * height);
    }
  },
  
  renderTexture(context, texture, w0, w1, w2, w3) {
    const { width, height } = texture;
    const minSize = 80;
    const minAmount = 1;
    const maxAmount = 2;
    
    const ax = Math.max(Math.min(Math.round(Math.max(
      Math.abs(w1.y - w0.y),
      Math.abs(w2.y - w3.y))
    / minSize), maxAmount), minAmount);
    
    const ay = Math.max(Math.min(Math.round(Math.max(
      Math.abs(w3.x - w0.x),
      Math.abs(w2.x - w1.x))
    / minSize), maxAmount), minAmount);
    
    if (ax === 1 && ay === 1) {
      this.textureSquare(context, texture, [
        createTexture(w0.x, w0.y, 0, 0),
        createTexture(w1.x, w1.y, 0, 1),
        createTexture(w2.x, w2.y, 1, 1),
        createTexture(w3.x, w3.y, 1, 0)
      ]);
    } else {
      const textures = this.subdivide(w0, w1, w2, w3, ax, ay);
      
      for (let i = 0; i < textures.length; i++) {
        this.textureSquare(context, texture, textures[i]);
      }
    }
  }
};
