import { CGFobject } from '../lib/CGF.js';

export class MySphere extends CGFobject {
    /**
     * Sphere constructor - Creates a parametric sphere using spherical coordinates
     * @param {Object} scene - CGF scene reference
     * @param {number} slices - Number of vertical divisions (longitude segments)
     * @param {number} stacks - Number of horizontal divisions (latitude segments)
     * @param {boolean} inverted - Whether to invert normals for inside-out rendering
     */
    constructor(scene, slices, stacks, inverted = false) {
        super(scene);
        this.slices = slices;   // Longitudinal divisions (around Y-axis)
        this.stacks = stacks;   // Latitudinal divisions (from pole to pole)
        this.inverted = inverted; // For creating inside-out spheres (sky domes)
        this.initBuffers();
    }
    
    /**
     * Generate sphere geometry using spherical coordinate system
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        // Generate vertices using spherical coordinates
        for (let stack = 0; stack <= this.stacks; stack++) {
            let phi = Math.PI * stack / this.stacks;  // Latitude angle: 0 (North Pole) to PI (South Pole)
            let y = Math.cos(phi);                    // Y coordinate from cosine of latitude
            let sinPhi = Math.sin(phi);               // Radius at current latitude
            
            for (let slice = 0; slice <= this.slices; slice++) {
                let theta = 2 * Math.PI * slice / this.slices; // Longitude angle: 0 to 2PI
                
                // Convert spherical to cartesian coordinates
                let x = sinPhi * Math.cos(theta);
                let z = sinPhi * Math.sin(theta);
                
                this.vertices.push(x, y, -z);  // -z for correct orientation
                this.normals.push(x, y, z);    // Normal points outward from center
                
                // Map spherical coordinates to texture space (0-1 range)
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
        
        // Generate triangle indices for sphere surface
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                // Calculate vertex indices for current quad
                let first = stack * (this.slices + 1) + slice;
                let second = first + this.slices + 1;
                
                // Create two triangles per quad with proper winding order
                if (!this.inverted) {
                    // Standard outward-facing triangles
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second, second + 1, first + 1);
                } else {
                    // Inverted winding for inward-facing triangles
                    this.indices.push(first, first + 1, second);
                    this.indices.push(second, first + 1, second + 1);
                }
            }
        }
        
        // Invert normals for inside-out rendering (useful for sky domes)
        if (this.inverted) {
            for (let i = 0; i < this.normals.length; i += 3) {
                this.normals[i] = -this.normals[i];      // Invert X component
                this.normals[i+1] = -this.normals[i+1];  // Invert Y component
                this.normals[i+2] = -this.normals[i+2];  // Invert Z component
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
