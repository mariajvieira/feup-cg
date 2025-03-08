import { CGFobject } from '../lib/CGF.js';

/**
 * MyUnitCube
 * @constructor
 * @param scene - Referência ao objeto MyScene
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            // Frente
            -0.5, -0.5,  0.5,   // 0
             0.5, -0.5,  0.5,   // 1
             0.5,  0.5,  0.5,   // 2
            -0.5,  0.5,  0.5,   // 3

            // Trás
            -0.5, -0.5, -0.5,   // 4
             0.5, -0.5, -0.5,   // 5
             0.5,  0.5, -0.5,   // 6
            -0.5,  0.5, -0.5,   // 7

            // Esquerda
            -0.5, -0.5, -0.5,   // 8
            -0.5, -0.5,  0.5,   // 9
            -0.5,  0.5,  0.5,   // 10
            -0.5,  0.5, -0.5,   // 11

            // Direita
             0.5, -0.5, -0.5,   // 12
             0.5, -0.5,  0.5,   // 13
             0.5,  0.5,  0.5,   // 14
             0.5,  0.5, -0.5,   // 15

            // Topo
            -0.5,  0.5,  0.5,   // 16
             0.5,  0.5,  0.5,   // 17
             0.5,  0.5, -0.5,   // 18
            -0.5,  0.5, -0.5,   // 19

            // Fundo
            -0.5, -0.5,  0.5,   // 20
             0.5, -0.5,  0.5,   // 21
             0.5, -0.5, -0.5,   // 22
            -0.5, -0.5, -0.5    // 23
        ];

        this.indices = [
            // Frente
            0, 1, 2,
            2, 3, 0,
            // Trás
            4, 6, 5,
            6, 4, 7,
            // Esquerda
            8, 9, 10,
            10, 11, 8,
            // Direita
            12, 14, 13,
            14, 12, 15,
            // Topo
            16, 17, 18,
            18, 19, 16,
            // Fundo
            20, 22, 21,
            22, 20, 23
        ];

        this.normals = [
            // Frente (0, 0, 1)
            0, 0, 1,  0, 0, 1,  0, 0, 1,  0, 0, 1,
            // Trás (0, 0, -1)
            0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
            // Esquerda (-1, 0, 0)
            -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
            // Direita (1, 0, 0)
            1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
            // Topo (0, 1, 0)
            0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
            // Fundo (0, -1, 0)
            0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
