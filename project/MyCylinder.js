import { CGFobject } from '../lib/CGF.js';

export class MyCylinder extends CGFobject {
    constructor(scene, slices) {
        super(scene);
        this.slices = slices;
        this.initBuffers();
    }

    initBuffers() {
        const angleStep = 2 * Math.PI / this.slices;

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Criar vértices das paredes laterais
        for (let i = 0; i <= this.slices; i++) {
            const angle = i * angleStep;
            const x = Math.cos(angle);
            const z = Math.sin(angle);

            // Vértice da base
            this.vertices.push(x, 0, z);
            this.normals.push(x, 0, z);
            this.texCoords.push(i / this.slices, 1);

            // Vértice do topo
            this.vertices.push(x, 1, z);
            this.normals.push(x, 0, z);
            this.texCoords.push(i / this.slices, 0);
        }

        // Criar faces laterais
        for (let i = 0; i < this.slices; i++) {
            const idx = i * 2;
            this.indices.push(idx, idx + 1, idx + 2);
            this.indices.push(idx + 1, idx + 3, idx + 2);
        }

        // Adicionar centro da base
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        // Criar apenas a face da base (sem a face do topo)
        for (let i = 0; i < this.slices; i++) {
            const next = (i + 1) % this.slices;
            const b0 = i * 2;
            const b1 = next * 2;

            // Apenas a face da base
            this.indices.push(baseCenterIndex, b1, b0);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
