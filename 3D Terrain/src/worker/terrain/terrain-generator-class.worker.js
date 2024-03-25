importScripts('/libs/noise.js');

const temp1 = new Float32Array(3);
const temp2 = new Float32Array(3);

class TerrainGenerator {
  constructor({
    depth,
    triangleSize,
    width,
    position,
    maxHeight,
    minNoiseHeight,
    noiseFineness,
    noiseSeed,
    noiseSlope,
    noiseOffset,
    lacunarity,
    persistance,
    octaves,
    regions,
    heightCurve = [
      [0, 0],
      [1, 1]
    ]
  }) {
    this.depth = depth + 1;
    this.width = width + 1;
    this.triangleSize = triangleSize;
    this.maxHeight = maxHeight;
    this.minNoiseHeight = minNoiseHeight;
    this.noiseFineness = noiseFineness;
    this.noiseSlope = noiseSlope;
    this.lacunarity = lacunarity;
    this.persistance = persistance;
    this.octaves = octaves;
    this.heightCurve = heightCurve;

    this.totalWidth = this.width * this.triangleSize;
    this.totalDepth = this.depth * this.triangleSize;
    this.position = [
      position[0] - this.totalWidth / 2,
      position[1] - this.totalDepth / 2
    ];

    this.regions = regions.sort((a, b) => a.height - b.height);
    this.heightScalar = this.getHeightScalar();

    this.noiseFactor = 1 / noiseFineness;
    this.noise = this.createNoiseFunction(noiseSeed, 'simplex', 2);
    this.noiseOffset = noiseOffset;
    
    this.generate();
  }
  
  generate() {
    this.generateFlat(this.generateVertices());
    this.generateFlatIndices();
  }
  
  generateFlat(oldVertices) {
    const width = this.width;
    const depth = this.depth + 1;
    const arrayLength = (width - 1) * (depth - 1) * 6;
    
    this.arrayBuffers = {
      vertices: new ArrayBuffer(arrayLength * Float32Array.BYTES_PER_ELEMENT),
      colors: new ArrayBuffer(arrayLength * Float32Array.BYTES_PER_ELEMENT),
      normals: new ArrayBuffer(arrayLength * Float32Array.BYTES_PER_ELEMENT)
    };
    
    const vertices = new Float32Array(this.arrayBuffers.vertices);
    const colors = new Float32Array(this.arrayBuffers.colors);
    const normals = new Float32Array(this.arrayBuffers.normals);
    
    let vpointer = 0;
    let cpointer = 0;
    let npointer = 0;
    
    for (let z = 0; z < depth - 1; z++) {
      for (let x = 0; x < width - 1; x++) {
        const a = x + z * width;
        const b = a + 1;
        const c = a + width;
        const d = c + 1;
        
        const normal1 = this.getNormal(oldVertices, a * 3, c * 3, d * 3);
        const color1 = this.getColor(oldVertices, a * 3, c * 3, d * 3);
        
        normals[npointer++] = normal1[0];
        normals[npointer++] = normal1[1];
        normals[npointer++] = normal1[2];
        
        vertices[vpointer++] = oldVertices[a * 3 + 0];
        vertices[vpointer++] = oldVertices[a * 3 + 1];
        vertices[vpointer++] = oldVertices[a * 3 + 2];
        
        colors[cpointer++] = color1[0];
        colors[cpointer++] = color1[1];
        colors[cpointer++] = color1[2];
        
        const normal2 = this.getNormal(oldVertices, b * 3, a * 3, d * 3);
        const color2 = this.getColor(oldVertices, b * 3, a * 3, d * 3);
        
        normals[npointer++] = normal2[0];
        normals[npointer++] = normal2[1];
        normals[npointer++] = normal2[2];
        
        vertices[vpointer++] = oldVertices[b * 3 + 0];
        vertices[vpointer++] = oldVertices[b * 3 + 1];
        vertices[vpointer++] = oldVertices[b * 3 + 2];
        
        colors[cpointer++] = color2[0];
        colors[cpointer++] = color2[1];
        colors[cpointer++] = color2[2];
      }
    }
    
    this.vertices = vertices;
    this.colors = colors;
    this.normals = normals;
  }
  
  generateFlatIndices() {
    const { width, depth } = this;
    const arrayLength = (width - 1) * (depth - 1) * 6;
    
    this.arrayBuffers.indices = new ArrayBuffer(arrayLength * Uint16Array.BYTES_PER_ELEMENT);
    this.indices = new Uint16Array(this.arrayBuffers.indices);
    
    const indices = this.indices;
    const rowLength = (width - 1) * 2;
    
    let pointer = 0;
    
    for (let z = 0; z < depth - 1; z++) {
      for (let x = 0; x < width - 1; x++) {
        const a = x * 2 + z * rowLength;
        const b = a + 1;
        const c = a + rowLength;
        const d = c + 1;
        
        indices[pointer++] = c;
        indices[pointer++] = d;
        indices[pointer++] = a;
        
        indices[pointer++] = a;
        indices[pointer++] = d;
        indices[pointer++] = b;
      }
    }
  }
  
  generateVertices() {
    const {
      lacunarity,
      persistance,
      octaves
    } = this;
    
    const vertices = new Float32Array(this.width * this.depth * 3);
    let pointer = 0;

    for (let j = 0; j < this.width; j++) {
      for (let i = 0; i < this.depth; i++) {
        const x = this.position[0] + i * this.triangleSize;
        const z = this.position[1] + j * this.triangleSize;

        let amplitude = 1;
        let frequency = 1;
        let noiseHeight = 0;

        for (let k = 0; k < octaves; k++) {
          const sampleX = x * frequency;
          const sampleZ = z * frequency;

          const noiseX = sampleX * this.noiseFactor + this.noiseOffset;
          const noiseZ = sampleZ * this.noiseFactor + this.noiseOffset;

          const rawNoiseValue = this.noise(noiseX, noiseZ);
          const normalizedValue = Math.pow((rawNoiseValue + 1) / 2, this.noiseSlope);
          const withCurveApplied = this.evaluateHeightCurve(this.heightCurve, normalizedValue);
          const mappedValue = withCurveApplied * 2 - 1;

          const noiseValue = mappedValue * this.maxHeight * this.heightScalar;

          noiseHeight += noiseValue * amplitude;
          amplitude *= persistance;
          frequency *= lacunarity;
        }

        const normalized = this.normalizeHeight(noiseHeight);
        const clamped = Math.max(normalized, this.minNoiseHeight);

        const y = this.unnormalizeHeight(clamped);

        vertices[pointer++] = x;
        vertices[pointer++] = y;
        vertices[pointer++] = z;
      }
    }
    
    return vertices;
  }
  
  getNormal(vertices, t0, t1, t2) {
    const p1x = vertices[t1 + 0] - vertices[t0 + 0];
    const p1y = vertices[t1 + 1] - vertices[t0 + 1];
    const p1z = vertices[t1 + 2] - vertices[t0 + 2];
    
    const p2x = vertices[t2 + 0] - vertices[t0 + 0];
    const p2y = vertices[t2 + 1] - vertices[t0 + 1];
    const p2z = vertices[t2 + 2] - vertices[t0 + 2];
    
    const p3x = p1y * p2z - p1z * p2y;
    const p3y = p1z * p2x - p1x * p2z;
    const p3z = p1x * p2y - p1y * p2x;
    
    const len = Math.sqrt(p3x * p3x + p3y * p3y + p3z * p3z);
    
    temp1[0] = p3x / len;
    temp1[1] = p3y / len;
    temp1[2] = p3z / len;
    
    return temp1;
  }
  
  getColor(vertices, t0, t1, t2) {
    const regions = this.regions;
    
    const y1 = vertices[t0 + 1];
    const y2 = vertices[t1 + 1];
    const y3 = vertices[t2 + 1];
    
    const y = (y1 + y2 + y3) / 3;
    const height = this.normalizeHeight(y);
    
    let isInRegion = false;

    for (let i = 0; i < regions.length; i++) {
      const region = regions[i];
      const lastRegion = regions[i - 1];

      if (height <= region.height) {
        isInRegion = true;
        
        if (lastRegion) {
          const blend = Math.min((height - lastRegion.height) / ((region.height - lastRegion.height) * region.blend), 1);
          
          const r = lastRegion.color[0] + (region.color[0] - lastRegion.color[0]) * blend;
          const g = lastRegion.color[1] + (region.color[1] - lastRegion.color[1]) * blend;
          const b = lastRegion.color[2] + (region.color[2] - lastRegion.color[2]) * blend;
          
          temp2[0] = r;
          temp2[1] = g;
          temp2[2] = b;
        } else {
          temp2[0] = region.color[0];
          temp2[1] = region.color[1];
          temp2[2] = region.color[2];
        }
        
        break;
      }
    }

    if (!isInRegion) {
      temp2[0] = 0;
      temp2[1] = 0;
      temp2[2] = 0;
    }
    
    return temp2;
  }
  
  evaluateHeightCurve(points, x) {
    const value = this.heightCurveRecursive(points, 0, points.length - 1, x);
    
    return Math.min(Math.max(value, 0), 1);
  }
  
  heightCurveRecursive(points, i, j, x) {
    if (i === j) {
      return points[i][1];
    }
    
    const a = points[j][0] - x;
    const b = this.heightCurveRecursive(points, i, j - 1, x);
    
    const c = x - points[i][0];
    const d = this.heightCurveRecursive(points, i + 1, j, x);
    
    const e = points[j][0];
    const f = points[i][0];
    
    return (a * b + c * d) / (e - f);
  }
  
  createNoiseFunction(seed, func, dimensions) {
    return (...coords) => noise[String(func) + String(dimensions)](...coords);
  }

  getHeightScalar() {
    const { persistance, octaves } = this;

    let amplitude = 1;
    let maximumPossibleHeight = 0;

    for (let i = 0; i < octaves; i++) {
      maximumPossibleHeight += amplitude;
      amplitude *= persistance;
    }

    return 1 / maximumPossibleHeight;
  }

  normalizeHeight(height) {
    return ((height / this.maxHeight) + 1) / 2;
  }

  unnormalizeHeight(height) {
    return (height * 2 - 1) * this.maxHeight;
  }

  getArrayBuffer(name) {
    return this.arrayBuffers[name];
  }
  
  getData() {
    return {
      vertices: this.vertices,
      normals: this.normals,
      indices: this.indices,
      colors: this.colors
    };
  }
}
