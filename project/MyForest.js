import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
  constructor(scene, rows, cols, areaWidth, areaDepth) {
    super(scene);
    this.rows = rows;
    this.cols = cols;
    this.areaWidth = areaWidth;
    this.areaDepth = areaDepth;

    this.cellW = areaWidth / cols;
    this.cellD = areaDepth / rows;

    this.trees = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const angle = Math.random() * 30 - 15;
        const axis = Math.random() < 0.5 ? 'x' : 'z';
        const trunkRadius = 0.2 + Math.random() * 0.3;
        const height = 5 + Math.random() * 10;

        const crownColor = [
          0.1 + Math.random() * 0.2,
          0.5 + Math.random() * 0.5,
          0.1 + Math.random() * 0.2
        ];

        const dx = (Math.random() * 0.4 - 0.2) * this.cellW;
        const dz = (Math.random() * 0.4 - 0.2) * this.cellD;

        const x = -areaWidth/2 + (c + 0.5) * this.cellW + dx;
        const z = -areaDepth/2 + (r + 0.5) * this.cellD + dz;

        const tree = new MyTree(scene, angle, axis, trunkRadius, height, crownColor);
        tree.pos = { x, z };
        this.trees.push(tree);
      }
    }
  }

  display() {
    for (let tree of this.trees) {
      this.scene.pushMatrix();
        this.scene.translate(tree.pos.x, 0, tree.pos.z);
        tree.display();
      this.scene.popMatrix();
    }
  }
}