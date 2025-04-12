import { CGFobject } from '../lib/CGF.js';

export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, inverted = false) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.inverted = inverted;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        for (let stack = 0; stack <= this.stacks; stack++) {
            let phi = Math.PI * stack / this.stacks;  // de 0 (pólo Norte) a PI (pólo Sul)
            let y = Math.cos(phi);
            let sinPhi = Math.sin(phi);
            for (let slice = 0; slice <= this.slices; slice++) {
                let theta = 2 * Math.PI * slice / this.slices;  // de 0 a 2PI
                let x = sinPhi * Math.cos(theta);
                let z = sinPhi * Math.sin(theta);
                this.vertices.push(x, y, -z);
                this.normals.push(x, y, z);
                this.texCoords.push(slice / this.slices, stack / this.stacks);
            }
        }
        
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                let first = stack * (this.slices + 1) + slice;
                let second = first + this.slices + 1;
                if (!this.inverted) {
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second, second + 1, first + 1);
                } else {
                    this.indices.push(first, first + 1, second);
                    this.indices.push(second, first + 1, second + 1);
                }
            }
        }
        
        if (this.inverted) {
            for (let i = 0; i < this.normals.length; i += 3) {
                this.normals[i] = -this.normals[i];
                this.normals[i+1] = -this.normals[i+1];
                this.normals[i+2] = -this.normals[i+2];
            }
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
