import Camera from "./Camera.js";
import Vec3 from "../math/Vec3.js";

export default class PlayerCamera extends Camera {
  constructor(...args) {
    super(...args);

    for (let code in this.keys) {
      if (this.keys[code].y) {
        delete this.keys[code];
      }
    }

    this.jumpSpeed = 0.12;
    this.maxSpeed = 0.1;
    this.gravity = 0.0063;
  }

  update(dt) {
    let movement = new Vec3(0, 0, 0);

    for (let code in this.keys) {
      if (this.eventHandler.pressed[code]) {
        movement.add(this.keys[code]);
      }
    }

    if (this.vel.y === 0 && this.eventHandler.pressed[32]) {
      this.vel.y = this.jumpSpeed;
    }

    movement.y -= this.gravity;

    this.vel.add(movement.scale(dt).rotateY(this.rotation[1]));

    const vy = this.vel.y;
    this.vel.y = 0;
    this.vel.limit(this.maxSpeed);
    this.vel.scale(Math.pow(this.drag, dt));
    this.vel.y = vy;

    this.position.add(this.vel.clone().scale(dt));

    this.scalingVel *= Math.pow(0.6, dt);
    this.zoomIn(this.scalingVel * dt);
  }
}
