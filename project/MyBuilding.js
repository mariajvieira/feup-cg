import { CGFobject } from '../lib/CGF.js';

export class MyBuilding extends CGFobject {
    constructor(scene, floors) {
        super(scene);
        this.floors = floors;  // Center module height = floors
        this.width = 6;        // module width
        this.depth = 5.5;      // module depth
        this.initBuffers();
    }

    initBuffers() {
        const w = this.width;
        const d = this.depth;
        const h = this.floors;

        this.vertices = [
            // Front face (z = 0)
            0, 0, 0,   // v0: bottom left
            w, 0, 0,   // v1: bottom right
            w, h, 0,   // v2: top right
            0, h, 0,   // v3: top left

            // Right face (x = w)
            w, 0, 0,   // v4: bottom left
            w, 0, d,   // v5: bottom right
            w, h, d,   // v6: top right
            w, h, 0,   // v7: top left

            // Back face (z = d)
            w, 0, d,   // v8: bottom left
            0, 0, d,   // v9: bottom right
            0, h, d,   // v10: top right
            w, h, d,   // v11: top left

            // Left face (x = 0)
            0, 0, d,   // v12: bottom left
            0, 0, 0,   // v13: bottom right
            0, h, 0,   // v14: top right
            0, h, d,   // v15: top left

            // Top face (y = h)
            0, h, 0,   // v16: front left
            w, h, 0,   // v17: front right
            w, h, d,   // v18: back right
            0, h, d,   // v19: back left

            // Bottom face (y = 0)
            0, 0, 0,   // v20: front left
            w, 0, 0,   // v21: front right
            w, 0, d,   // v22: back right
            0, 0, d    // v23: back left
        ];

        this.indices = [
            // Front face
            0, 1, 2,   0, 2, 3,
            // Right face
            4, 5, 6,   4, 6, 7,
            // Back face
            8, 9, 10,  8, 10, 11,
            // Left face
            12, 13, 14, 12, 14, 15,
            // Top face
            16, 17, 18, 16, 18, 19,
            // Bottom face
            20, 21, 22, 20, 22, 23
        ];

        this.normals = [
            // Front face (pointing towards negative Z)
            0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,
            // Right face (pointing towards positive X)
            1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,
            // Back face (pointing towards positive Z)
            0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,
            // Left face (pointing towards negative X)
            -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
            // Top face (pointing up)
            0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,
            // Bottom face (pointing down)
            0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0
        ];

        this.texCoords = [
            // Front face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Right face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Back face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Left face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Top face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Bottom face
            0, 1,  1, 1,  1, 0,  0, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    display() {
        // Calculate scaling factors for the lateral modules:
        // Height scale for sides (one floor less)
        const scaleYSide = (this.floors - 1) / this.floors;
        // Depth scale for sides (one unit less in depth)
        const scaleZSide = (this.depth - 1) / this.depth;
        
        // Left module:
        this.scene.pushMatrix();
            // Translate left by the full module width:
            this.scene.translate(-this.width, 0, 0);
            // Scale Y and Z for side module:
            this.scene.scale(1, scaleYSide, scaleZSide);
            super.display();
        this.scene.popMatrix();

        // Center module (original building):
        this.scene.pushMatrix();
            super.display();
        this.scene.popMatrix();

        // Right module:
        this.scene.pushMatrix();
            // Translate right by the full module width:
            this.scene.translate(this.width, 0, 0);
            // Scale Y and Z for side module:
            this.scene.scale(1, scaleYSide, scaleZSide);
            super.display();
        this.scene.popMatrix();
    }
}
