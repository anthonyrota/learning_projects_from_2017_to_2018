import { BufferData } from '../view/shaders/buffer.js';
import { WaterChunk } from '../view/water-chunk.js';
import { Bounds } from './bounds.js';
import { getTriangleNormal } from '../math/triangle-normal.js';

export class TerrainChunk {
  constructor({
    args,
    terrainGenerator,
    scene,
    position,
    width,
    depth,
    waterColor,
    waterLevel,
    maxHeight,
    waterBufferData,
    renderDistance,
    specularReflectivity,
    triangleSize,
    shineDamping
  }) {
    this.terrainPosition = position;
    this.width = width;
    this.depth = depth;
    this.maxHeight = maxHeight;
    this.waterColor = waterColor;
    this.waterLevel = waterLevel;
    this.waterBufferData = waterBufferData;
    this.renderDistance = renderDistance;
    this.specularReflectivity = specularReflectivity;
    this.shineDamping = shineDamping;
    this.triangleSize = triangleSize;
    this.scene = scene;

    this.bounds = new Bounds(
      vec3.fromValues(-this.width / 2, -this.maxHeight / 2, -this.depth / 2),
      vec3.fromValues( this.width / 2,  this.maxHeight / 2,  this.depth / 2)
    );
    this.bounds.offset([
      this.terrainPosition[0], 0, this.terrainPosition[1]
    ]);
    
    this.request(args, terrainGenerator);
  }
  
  update(playerPosition) {
    if (this.waterChunk) {
      this.waterChunk.update(playerPosition);
    }
  }
  
  request(args, terrainGenerator) {
    terrainGenerator
      .generate(this.scene, Object.assign(args, { position: this.terrainPosition }))
      .then(data => this.generate(data));
  }
  
  generate(result) {
    this.hasReceivedGeometry = true;
    this.indicesLength = result.indices.length;
    
    this.createBufferData(result);
    this.createWaterChunk();
  }
  
  createBufferData({ colors, normals, vertices, indices }) {
    this.vertices = vertices;
    this.normals = normals;
    this.bufferData = new BufferData({
      color: {
        type: 'ARRAY_BUFFER',
        data: colors
      },
      position: {
        type: 'ARRAY_BUFFER',
        data: vertices
      },
      normal: {
        type: 'ARRAY_BUFFER',
        data: normals
      },
      indices: {
        type: 'ELEMENT_ARRAY_BUFFER',
        data: indices
      }
    });
    
    this.bufferData.bindBuffers(this.scene.getGlContext());
  }
  
  createWaterChunk() {
    this.waterChunk = new WaterChunk({
      position: vec3.fromValues(
        this.terrainPosition[0],
        this.waterLevel,
        this.terrainPosition[1]
      ),
      color: this.waterColor,
      waterBuffer: this.waterBufferData,
      renderDistance: this.renderDistance,
      width: this.width,
      depth: this.depth
    });
  }
  
  getNormalizedTriangleAndPositionAt(position) {
    const {
      vertices,
      terrainPosition,
      triangleSize
    } = this;
    
    const width = this.width + triangleSize;
    const depth = this.depth + triangleSize;
    
    const relativeX = position[0] - terrainPosition[0];
    const relativeZ = position[2] - terrainPosition[1];
    
    const trianglesX = width / triangleSize;
    const trianglesZ = depth / triangleSize;
    
    const x = Math.floor(relativeX / triangleSize + trianglesX / 2);
    const z = Math.floor(relativeZ / triangleSize + trianglesZ / 2);
    
    const rowLength = (trianglesX - 1) * 2;
    
    const a = x * 2 + z * rowLength;
    const b = a + 1;
    const c = a + rowLength;
    const d = c + 1;
    
    const ay = vertices[a * 3 + 1];
    const by = vertices[b * 3 + 1];
    const cy = vertices[c * 3 + 1];
    const dy = vertices[d * 3 + 1];
    
    // if (cy === undefined || dy === undefined) {
    //   cy = ay;
    //   dy = by;
    // }
    
    const positionX = (relativeX + width / 2) / triangleSize % 1;
    const positionZ = (relativeZ + depth / 2) / triangleSize % 1;
    
    if (positionX <= (1 - positionZ)) {
      return [
        [0, ay, 0],
        [1, by, 0],
        [0, cy, 1],
        [positionX, positionZ]
      ];
    }
    
    return [
      [1, by, 0],
      [1, dy, 1],
      [0, cy, 1],
      [positionX, positionZ]
    ];
  }
  
  getHeightAt(position) {
    const [
      t1,
      t2,
      t3,
      normalizedPosition
    ] = this.getNormalizedTriangleAndPositionAt(position);
    
    return this.barryCentric(t1, t2, t3, normalizedPosition);
  }
  
  getNormalAt(position) {
    const triangle = this.getNormalizedTriangleAndPositionAt(position);
    
    return getTriangleNormal(triangle);
  }
  
  barryCentric(p1, p2, p3, pos) {
		const det = (p2[2] - p3[2]) * (p1[0] - p3[0]) + (p3[0] - p2[0]) * (p1[2] - p3[2]);
		
		const l1 = ((p2[2] - p3[2]) * (pos[0] - p3[0]) + (p3[0] - p2[0]) * (pos[1] - p3[2])) / det;
		const l2 = ((p3[2] - p1[2]) * (pos[0] - p3[0]) + (p1[0] - p3[0]) * (pos[1] - p3[2])) / det;
		const l3 = 1 - l1 - l2;
		
		return l1 * p1[1] + l2 * p2[1] + l3 * p3[1];
  }
  
  getSpecularReflectivity() {
    return this.specularReflectivity;
  }
  
  getShineDamping() {
    return this.shineDamping;
  }
  
  getWater() {
    return this.waterChunk;
  }
  
  getBuffer(bufferName) {
    return this.bufferData.getBuffer(bufferName);
  }
  
  getIndicesLength() {
    return this.indicesLength;
  }

  alreadyHasGeometry() {
    return this.hasReceivedGeometry;
  }

  isVisibleInCameraFrustum(camera) {
    return camera.getFrustum().collidesWithBounds(this.bounds);
  }
}
