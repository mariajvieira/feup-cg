import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        let angle = (2 * Math.PI) / this.slices;
        let stackHeight = 1 / this.stacks;

        for (let stack = 0; stack <= this.stacks; stack++) {
            let z = stack * stackHeight;

            for (let i = 0; i < this.slices; i++) {
                let slice = i * angle;

                let x = Math.cos(slice);
                let y = Math.sin(slice);

                this.vertices.push(x, y, z);

                this.normals.push(x, y, 0);
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let i = 0; i < this.slices; i++) {
                let current = stack * this.slices + i;
                let next = (i + 1) % this.slices + stack * this.slices;
                let upper = current + this.slices;
                let upperNext = next + this.slices;

                this.indices.push(current, next, upper);
                this.indices.push(next, upperNext, upper);
            }
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
