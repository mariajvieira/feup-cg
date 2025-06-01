import { CGFappearance, CGFobject, CGFtexture } from '../lib/CGF.js';

export class MyLake extends CGFobject {
    /**
     * Lake constructor - Creates an elliptical water surface
     * @param {Object} scene - CGF scene reference
     * @param {number} width - Lake width (radius in X direction)
     * @param {number} depth - Lake depth (radius in Z direction)
     * @param {number} detail - Number of segments for circular approximation
     */
    constructor(scene, width, depth, detail) {
        super(scene);
        this.width = width || 20;   // Default lake width
        this.depth = depth || 15;   // Default lake depth
        this.detail = detail || 32; // Default tessellation detail

        this.initBuffers();
        this.initMaterials();
    }

    /**
     * Generate lake geometry as a triangle fan creating an elliptical shape
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Center vertex of the lake (origin point for triangle fan)
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 1, 0);        // Normal pointing up
        this.texCoords.push(0.5, 0.5);     // Center texture coordinate

        // Generate perimeter vertices in a circular pattern
        for (let i = 0; i <= this.detail; i++) {
            const angle = (i / this.detail) * Math.PI * 2;
            
            // Create elliptical shape using different radii for width and depth
            const x = Math.cos(angle) * this.width;
            const z = Math.sin(angle) * this.depth;

            this.vertices.push(x, 0, z);
            this.normals.push(0, 1, 0);     // All normals point upward (flat surface)
            
            // Map circular coordinates to texture space (0-1 range)
            const u = 0.5 + 0.5 * Math.cos(angle);
            const v = 0.5 + 0.5 * Math.sin(angle);
            this.texCoords.push(u, v);
            
            // Create triangles connecting center to perimeter (triangle fan)
            if (i < this.detail) {
                this.indices.push(0, i+1, i+2);
            }
        }
        
        // Close the fan by connecting last vertex back to first
        this.indices.push(0, this.detail, 1);
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    /**
     * Setup water material with reflective properties and texture
     */
    initMaterials() {
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.2, 0.4, 0.8, 1.0);   // Blue ambient light
        this.waterMaterial.setDiffuse(0.2, 0.6, 0.9, 1.0);   // Blue diffuse reflection
        this.waterMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);  // White specular highlights
        this.waterMaterial.setShininess(120);                 // High shininess for water reflection
        
        // Apply water texture with repeating pattern
        this.waterTexture = new CGFtexture(this.scene, 'images/water.png');
        this.waterMaterial.setTexture(this.waterTexture);
        this.waterMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    /**
     * Render the lake surface
     */
    display() {
        this.scene.pushMatrix();
            this.waterMaterial.apply();
            super.display();
        this.scene.popMatrix();
    }
}