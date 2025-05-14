import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
  constructor(scene, rows, cols, areaWidth, areaDepth) {
    super(scene);
    this.rows = rows;
    this.cols = cols;
    this.areaWidth = areaWidth;
    this.areaDepth = areaDepth;

    // Calculate cell dimensions
    this.cellW = areaWidth / cols;
    this.cellD = areaDepth / rows;

    this.trees = [];
    
    // Create a tree for each cell in the grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Random tree parameters
        const angle = Math.random() * 30 - 15;           // Random angle between -15 and 15 degrees
        const axis = Math.random() < 0.5 ? 'x' : 'z';     // Random axis (x or z)
        const trunkRadius = 0.2 + Math.random() * 0.3;    // Random trunk radius between 0.2 and 0.5
        const height = 5 + Math.random() * 10;            // Random height between 5 and 15
        
        // Random crown color (variations of green)
        const crownColor = [
          0.1 + Math.random() * 0.2,  // R component (0.1-0.3)
          0.5 + Math.random() * 0.5,  // G component (0.5-1.0)
          0.1 + Math.random() * 0.2   // B component (0.1-0.3)
        ];
        
        // Calculate position with small random offset
        const dx = (Math.random() * 0.4 - 0.2) * this.cellW;  // Offset between -0.2 and 0.2 of cell width
        const dz = (Math.random() * 0.4 - 0.2) * this.cellD;  // Offset between -0.2 and 0.2 of cell depth
        
        // Calculate final position (centered in the area)
        const x = -areaWidth/2 + (c + 0.5) * this.cellW + dx;
        const z = -areaDepth/2 + (r + 0.5) * this.cellD + dz;
        
        // Create the tree and store its position
        const tree = new MyTree(scene, angle, axis, trunkRadius, height, crownColor);
        tree.pos = { x, z };
        this.trees.push(tree);
      }
    }
  }

  display() {
    // Display all trees at their positions
    for (let tree of this.trees) {
      this.scene.pushMatrix();
        this.scene.translate(tree.pos.x, 0, tree.pos.z);
        tree.display();
      this.scene.popMatrix();
    }
  }
}