import { CGFappearance, CGFobject } from '../lib/CGF.js';
import { MyPyramid } from './MyPyramid.js';
import { MyCylinder } from './MyCylinder.js';

export class MyTree extends CGFobject {
    /**
     * Tree constructor - Creates a procedural tree with cylindrical trunk and layered pyramid crown
     * @param {Object} scene - CGF scene reference
     * @param {number} angle - Tree rotation angle in degrees
     * @param {string} axis - Rotation axis ('x' or 'z')
     * @param {number} trunkRadius - Radius of the tree trunk
     * @param {number} height - Total tree height
     * @param {Array} crownColor - RGB color array for tree foliage
     */
    constructor(scene, angle, axis, trunkRadius, height, crownColor) {
        super(scene);

        // Tree orientation and geometry parameters
        this.angle = angle * Math.PI / 180;  // Convert degrees to radians
        this.axis = axis;                    // Rotation axis for tree orientation
        this.trunkRadius = trunkRadius;
        this.height = height;

        // Calculate proportional dimensions (trunk 20%, crown 80% of total height)
        this.trunkHeight = this.height * 0.2;
        this.crownHeight = this.height * 0.8;

        // Determine number of pyramid layers for crown complexity
        const step = 1.0;
        this.numPyramids = Math.max(2, Math.ceil(this.crownHeight / step));

        // Calculate overlap between pyramid layers for natural appearance
        const overlap = 0.04 * height;

        // Calculate individual pyramid dimensions
        this.pyramidHeight = (this.crownHeight + (this.numPyramids - 1) * overlap) / this.numPyramids;
        this.shift = this.pyramidHeight - overlap;  // Vertical spacing between pyramids

        // Initialize geometric components
        this.trunk = new MyCylinder(scene, 16);     // 16-sided cylinder for smooth trunk
        this.pyramid = new MyPyramid(scene, 6, 1);  // 6-sided pyramid for foliage

        // Material loading control
        this.texturesLoaded = false;
        this.initMaterials(crownColor);
        this.texturesLoaded = true;
    }

    /**
     * Setup materials for trunk and crown with different textures and colors
     * @param {Array} crownColor - RGB color values for foliage
     */
    initMaterials(crownColor) {
        // Brown bark material for trunk
        this.trunkMaterial = new CGFappearance(this.scene);
        this.trunkMaterial.setAmbient(0.2, 0.1, 0.0, 1.0);   // Dark brown ambient
        this.trunkMaterial.setDiffuse(0.4, 0.2, 0.1, 1.0);   // Medium brown diffuse
        this.trunkMaterial.setSpecular(0.05, 0.05, 0.05, 1.0); // Low specularity (rough bark)
        this.trunkMaterial.setShininess(5);

        // Apply bark texture with tiling
        this.trunkMaterial.loadTexture('images/tree_stem.jpg');
        this.trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // Foliage material with customizable color
        this.crownMaterial = new CGFappearance(this.scene);
        this.crownMaterial.setAmbient(crownColor[0] * 0.4, crownColor[1] * 0.4, crownColor[2] * 0.4, 1.0);
        this.crownMaterial.setDiffuse(crownColor[0], crownColor[1], crownColor[2], 1.0);
        this.crownMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);  // Slight specularity for leaves
        this.crownMaterial.setShininess(10);

        // Apply foliage texture with tiling
        this.crownMaterial.loadTexture('images/tree.jpg');
        this.crownMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }

    /**
     * Render complete tree with trunk and layered crown
     */
    display() {
        if (!this.texturesLoaded) return;  // Wait for textures to load
        
        this.scene.pushMatrix();

        // Apply tree orientation based on specified axis and angle
        if (this.axis === 'x') {
            this.scene.rotate(this.angle, 1, 0, 0);
        } else if (this.axis === 'z') {
            this.scene.rotate(this.angle, 0, 0, 1);
        }

        // Render cylindrical trunk
        this.scene.pushMatrix();
            this.trunkMaterial.apply();
            this.scene.translate(0, this.trunkHeight / 2, 0);  // Center trunk vertically
            this.scene.scale(this.trunkRadius, this.trunkHeight, this.trunkRadius);
            this.trunk.display();
        this.scene.popMatrix();

        // Render layered crown using multiple pyramids
        this.crownMaterial.apply();
        let currentHeight = this.trunkHeight;  // Start crown at top of trunk

        for (let i = 0; i < this.numPyramids; i++) {
            this.scene.pushMatrix();
                this.scene.translate(0, currentHeight, 0);

                // Calculate pyramid size (larger at bottom, smaller at top)
                const baseScale = 1.5;
                const stepScale = 0.4;
                const pyramidRadius = this.trunkRadius * (baseScale + (this.numPyramids - i - 1) * stepScale);

                this.scene.scale(pyramidRadius, this.pyramidHeight, pyramidRadius);
                this.pyramid.display();
            this.scene.popMatrix();
            
            currentHeight += this.shift;  // Move up for next pyramid layer
        }

        this.scene.popMatrix();
    }
}