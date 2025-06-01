import { CGFobject } from '../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
  /**
   * Forest constructor - Creates a procedural forest with randomized trees in a grid pattern
   * @param {Object} scene - CGF scene reference
   * @param {number} rows - Number of tree rows in the forest
   * @param {number} cols - Number of tree columns in the forest
   * @param {number} areaWidth - Total width of the forest area
   * @param {number} areaDepth - Total depth of the forest area
   */
  constructor(scene, rows, cols, areaWidth, areaDepth) {
    super(scene);
    this.rows = rows;
    this.cols = cols;
    this.areaWidth = areaWidth;
    this.areaDepth = areaDepth;

    // Calculate cell dimensions for grid-based tree placement
    this.cellW = areaWidth / cols;  // Width of each grid cell
    this.cellD = areaDepth / rows;  // Depth of each grid cell

    this.trees = [];  // Array to store all tree instances

    // Generate trees in a grid pattern with randomization
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Random tree orientation parameters
        const angle = Math.random() * 30 - 15;           // Random tilt angle (-15° to +15°)
        const axis = Math.random() < 0.5 ? 'x' : 'z';    // Random tilt axis
        
        // Random tree size parameters
        const trunkRadius = 0.2 + Math.random() * 0.3;   // Trunk radius (0.2 to 0.5)
        const height = 5 + Math.random() * 10;           // Tree height (5 to 15 units)

        // Random foliage color variation (green tones)
        const crownColor = [
          0.1 + Math.random() * 0.2,  // Red component (0.1 to 0.3)
          0.5 + Math.random() * 0.5,  // Green component (0.5 to 1.0)
          0.1 + Math.random() * 0.2   // Blue component (0.1 to 0.3)
        ];

        // Add random offset within cell for natural positioning
        const dx = (Math.random() * 0.4 - 0.2) * this.cellW;  // ±20% of cell width
        const dz = (Math.random() * 0.4 - 0.2) * this.cellD;  // ±20% of cell depth

        // Calculate world position (center forest at origin)
        const x = -areaWidth/2 + (c + 0.5) * this.cellW + dx;   // X position with offset
        const z = -areaDepth/2 + (r + 0.5) * this.cellD + dz;   // Z position with offset

        // Create tree instance with randomized parameters
        const tree = new MyTree(scene, angle, axis, trunkRadius, height, crownColor);
        tree.pos = { x, z };  // Store position for rendering
        this.trees.push(tree);
      }
    }
  }

  /**
   * Render all trees in the forest at their respective positions
   */
  display() {
    for (let tree of this.trees) {
      this.scene.pushMatrix();
        // Position each tree at its calculated location
        this.scene.translate(tree.pos.x, 0, tree.pos.z);
        tree.display();
      this.scene.popMatrix();
    }
  }
}