import { WorkerManager } from '../web-worker-manager.js';

export class TerrainGenerator {
  constructor() {
    this.workerManager = new WorkerManager('src/worker/terrain/terrain-generator.worker.js');
    this.resolving = {};

    for (const worker of this.workerManager.getAllWorkers()) {
      worker.addEventListener('message', e => this.resolveCallback(e.data.id, e.data.result));
    }
  }

  resolveCallback(id, result) {
    this.resolving[id](result);
    delete this.resolving[id];
  }

  generate(scene, args) {
    return new Promise(resolve => {
      const worker = this.workerManager.getAvaliableWorker();
      const id = TerrainGenerator.uid++;

      worker.postMessage(JSON.stringify({ args, id }));

      this.resolving[id] = resolve;
    });
  }
}

TerrainGenerator.uid = 0;
