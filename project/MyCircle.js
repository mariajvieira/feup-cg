import { CGFobject } from '../lib/CGF.js';

export class MyCircle extends CGFobject {
    /**
     * @param scene
     * @param slices número de divisões do círculo
     */
    constructor(scene, slices) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5);

        const alphaInc = 2 * Math.PI / this.slices;
        
        for (let i = 0; i <= this.slices; i++) {
            const alpha = i * alphaInc;
            const x = Math.cos(alpha);
            const y = Math.sin(alpha);
            
            this.vertices.push(x, y, 0);
            this.normals.push(0, 0, 1);
            
            const s = (x + 1) / 2;
            const t = 1 - (y + 1) / 2;  
            this.texCoords.push(s, t);
        }

        for (let i = 0; i < this.slices; i++) {
            this.indices.push(0, i + 1, i + 2);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}