import { CGFobject } from '../lib/CGF.js';

export class MyBuilding extends CGFobject {
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
                let nextslice = (i + 1) * angle;

                let x1 = Math.cos(slice);
                let y1 = Math.sin(slice);
                let x2 = Math.cos(nextslice);
                let y2 = Math.sin(nextslice);

                this.vertices.push(x1, y1, z);
                this.vertices.push(x2, y2, z);

                let normalX = Math.cos(slice + angle / 2);
                let normalY = Math.sin(slice + angle / 2);

                this.normals.push(normalX, normalY, 0);
                this.normals.push(normalX, normalY, 0);
            }
        }

        for (let stack = 0; stack < this.stacks; stack++) {
            for (let i = 0; i < this.slices; i++) {
                let current = stack * this.slices * 2 + i * 2;
                let next = current + 2;
                let upper = current + this.slices * 2;
                let upperNext = upper + 2;

                if (i === this.slices - 1) {
                    next -= this.slices * 2;
                    upperNext -= this.slices * 2;
                }

                this.indices.push(current, next, upper);
                this.indices.push(next, upperNext, upper);
            }
        }
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
