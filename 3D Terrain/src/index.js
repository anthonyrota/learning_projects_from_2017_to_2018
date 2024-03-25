import { Scene } from './core/scene.js';
import { TerrainShader } from './view/shaders/terrain-shader.js';
import { WaterShader } from './view/shaders/water-shader.js';
import { PlayerCamera } from './view/player-camera.js';
import { FlyingCamera } from './view/flying-camera.js';
import { DirectionalLight } from './view/directional-light.js';
import { Fog } from './view/fog.js';
import { Timer } from './core/timer.js';
import { FiringEvent } from './core/events.js';
import { Curve } from './core/curve.js';
import { Entity } from './core/entity.js';
import { InfiniteTerrain } from './core/infinite-terrain.js';
import { KeyControls } from './interaction/key-controls.js';
import { EventManager } from './interaction/event-manager.js';
import { GaussianBlurShader } from './view/shaders/gaussian-blur-shader.js';
import { Framebuffer } from './view/shaders/framebuffer.js';
import { DOFShader } from './view/shaders/dof-shader.js';

const scene = new Scene('.main');

const canvas = scene.getCanvas();
const gl = scene.getGlContext();
const width = window.innerWidth;
const height = window.innerHeight;
const clippingPlanes = vec2.fromValues(0.1, 1200);
const skyColor = [1, 1, 1];

scene.setClearColor(vec4.fromValues(...skyColor, 1));
scene.setAmbientColor(vec3.fromValues(0.4, 0.4, 0.4));
scene.setDirectionalLight(new DirectionalLight({
  direction: vec3.fromValues(0, 1.6, 1.48),
  color: vec3.fromValues(0.9, 0.9, 0.9)
}));
scene.setFog(new Fog({
  distance: clippingPlanes[1],
  power: 2.1,
  color: vec3.fromValues(...skyColor)
}));
scene.setCamera(new PlayerCamera({
  horizontalSpeed: 13 / 60,
  verticalSpeed: 2.3,
  constantJumpSpeed: 0.1,
  maxFallSpeed: 2,
  gravity: 0.08,
  drag: 0.8,
  element: canvas,
  sensitivity: 200,
  fov: 75,
  aspect: width / height,
  near: clippingPlanes[0],
  far: clippingPlanes[1]
}));

const terrain = new InfiniteTerrain({
  scene,
  renderDistance: clippingPlanes[1],
  bufferDistance: clippingPlanes[1],
  waterLevel: 0.426,
  waterColor: [0.604 + 0.1, 0.867 + 0.1, 0.851 + 0.1],
  depth: 63,
  width: 63,
  lodLevels: 3,
  triangleSize: 15,
  maxHeight: 65,
  noiseFineness: 220,
  noiseSlope: 0.84,
  lacunarity: 2,
  persistance: 0.4,
  octaves: 3,
  minNoiseHeight: 0,
  specularReflectivity: 0.2,
  shineDamping: 10,
  regions: [
    {
      height: 1 / 7,
      color: [201, 178, 99].map(x => x / 255),
      blend: 0.6
    },
    {
      height: 1.5 / 7,
      color: [164, 155, 98].map(x => x / 255),
      blend: 0.6
    },
    {
      height: 2 / 7,
      color: [164, 155, 98].map(x => x / 255),
      blend: 0.6
    },
    {
      height: 2.7 / 7,
      color: [229, 219, 164].map(x => x / 255),
      blend: 0.6
    },
    {
      height: 4.1 / 7,
      color: [135, 184, 82].map(x => x / 255),
      blend: 0.6
    },
    {
      height: 5 / 7,
      color: [120, 120, 120].map(x => x / 255),
      blend: 0.6
    },
    {
      height: 7 / 7,
      color: [200, 200, 210].map(x => x / 255),
      blend: 0.6
    }
  ],
  heightCurve: [
    [0, 0],
    [1, 1]
  ]
});
const terrainShader = new TerrainShader({ gl });
const waterShader = new WaterShader({
  gl,
  scene,
  reflectionWidth: 1024,
  reflectionHeight: 1024,
  refractionWidth: 1024,
  refractionHeight: 1024,
  reflectOffset: 0.1,
  refractOffset: 1,
  waveLength: 100.0,
  waveAmplitude: 0.9,
  waveSlowdown: 8000.0,
  specularReflectivity: 0.6,
  shineDamping: 20.0,
  fresnelReflectivity: 0.4,
  minBlueness: 0.35,
  maxBlueness: 0.7,
  murkyDepth: 30.0,
  elevation: terrain.getHeightAtWater()
});
const gaussianBlur = new GaussianBlurShader({
  gl,
  scene,
  width: width,
  height: height,
  radii: [ 1, 2 ],
  blurLevel: 5
});
const framebuffer = new Framebuffer({
  gl,
  scene,
  width: width,
  height: height,
  useDepthTexture: true,
  useMultisampling: true
});
const dofShader = new DOFShader({
  gl,
  focalLength: 63,
  focalStop: 45,
  focusPoint: vec2.fromValues(0.5, 0.64),
  blurStrength: 3.5
});

const postProcessingGui = {
  dof: { enabled: false }
};
{
  const gui = new dat.GUI();
  const pp = gui.addFolder('Post Processing');
  const dof = pp.addFolder('Depth Of Field');
  const dofblur = dof.addFolder('focusPoint');
  const water = gui.addFolder('Water');
  const cam = gui.addFolder('Camera');
  dof.add(postProcessingGui.dof, 'enabled');
  dof.add(dofShader, 'focalLength', 0, 100);
  dof.add(dofShader, 'focalStop', 0, 300);
  dof.add(dofShader, 'blurStrength', 0, 20);
  dofblur.add(dofShader.focusPoint, '0', 0, 1);
  dofblur.add(dofShader.focusPoint, '1', 0, 1);
  water.add(waterShader, 'waveLength', 1, 750);
  water.add(waterShader, 'waveAmplitude', 0, 5);
  water.add(waterShader, 'waveSlowdown', 100, 40000);
  water.add(waterShader, 'specularReflectivity', 0, 1);
  water.add(waterShader, 'shineDamping', 0, 75);
  water.add(waterShader, 'fresnelReflectivity', 0, 1);
  water.add(waterShader, 'minBlueness', 0, 1);
  water.add(waterShader, 'maxBlueness', 0, 1);
  water.add(waterShader, 'murkyDepth', 0, 100);
  cam.add(scene.getCamera(), 'sensitivity', 40, 400);
  cam.add(scene.getCamera(), 'fov', 1, 179).onChange(fov => scene.getCamera().setFov(fov));
}

new Timer({
  update(dt, total) {
    const ndt = dt * 60 / 1000;
    const offset = 15;
    const camera = scene.getCamera();
    
    camera.update(ndt);
    terrain.update(camera.getPosition());
    scene.update();
    
    const height = terrain.getHeightAt(camera.getPosition()) + offset;
    
    if (camera.getY() < height) {
      camera.setY(height);
      camera.enableJumping();
    } else {
      camera.disableJumping();
    }
    
    if (terrain.isUnderwater(camera.getY() - 0.2)) {
      scene.setTint([0.604 + 0.1, 0.867 + 0.1, 0.851 + 0.1]);
    } else {
      scene.setTint([1, 1, 1]);
    }
    
    if (terrain.isUnderwater(camera.getY() - offset * 0.8)) {
      if (camera.getVelocity()[1] < -0.4) {
        camera.getVelocity()[1] = -0.4;
      }
      
      camera.setHorizontalSpeed(camera.getOriginalHorizontalSpeed() / 4);
      camera.disableJumping();
    } else {
      camera.resetHorizontalSpeed();
    }
    
    if (terrain.isUnderwater(camera.getY() - offset)) {
      camera.enableConstantJumping();
    } else {
      camera.disableConstantJumping();
    }
    
    scene.enableClippingPlane();
    waterShader.bindReflectionFramebuffer(scene);
    camera.reflectY(terrain.getHeightAtWater());
    terrainShader.render(scene);
    waterShader.unbindFramebuffer();
    
    waterShader.bindRefractionFramebuffer(scene);
    camera.reflectY(terrain.getHeightAtWater());
    terrainShader.render(scene);
    waterShader.unbindFramebuffer();
    
    postProcessingGui.dof.enabled && framebuffer.bind();
    scene.disableClippingPlane();
    terrainShader.clearAll(...scene.getClearColor());
    terrainShader.render(scene);
    waterShader.render(scene);
    postProcessingGui.dof.enabled && framebuffer.unbind();
    
    if (postProcessingGui.dof.enabled) {
      gaussianBlur.render(framebuffer.getColorTexture(), false);
      dofShader.render(framebuffer.getColorTexture(), gaussianBlur.getColorTexture(), framebuffer.getDepthTexture());
    }
    
    {
      window.fps = window.fps || []
      
      if (fps.length === 10) {
        let avg = window.fps.reduce((a, b) => a + b, 0) / 10
        fps.length = 0
        
        document.querySelector('.debug').innerHTML = `
          <b>Press "C" To Toggle Debugger</b><br>
          player ${Array.from(camera.getPosition()).map(Math.round).join(' ')}<br>
          velocity ${Array.from(camera.getVelocity()).map(x => x.toFixed(4)).join(' ')}<br>
          fps ${Math.round(avg)}<br>
          entities ${scene.entities.length}<br>
          chunks ${scene.terrainChunks.length}<br>
        `;
      } else {
        fps.push(1000 / dt)
      }
    }
  }
}).init();

new EventManager({
  keycontrols: new KeyControls().listen('C', () => {
    document.querySelector('.debug').style.display =
      document.querySelector('.debug').style.display === 'none'
        ? 'block'
        : 'none';
  })
}).bind();

new FiringEvent('resize', e => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  scene.getCamera().setAspect(width / height);

  gl.canvas.width = width;
  gl.canvas.height = height;
});
