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
            // Vértices do cubo
            -0.5, -0.5,  0.5,  // 0 - Frente inferior esquerdo
            0.5, -0.5,  0.5,  // 1 - Frente inferior direito
            0.5,  0.5,  0.5,  // 2 - Frente superior direito
           -0.5,  0.5,  0.5,  // 3 - Frente superior esquerdo

           -0.5, -0.5, -0.5,  // 4 - Trás inferior esquerdo
            0.5, -0.5, -0.5,  // 5 - Trás inferior direito
            0.5,  0.5, -0.5,  // 6 - Trás superior direito
           -0.5,  0.5, -0.5 
        ];

        // Índices dos triângulos
        this.indices = [
            // Frente
            0, 1, 2,
            2, 3, 0,

            // Trás
            4, 6, 5,
            6, 4, 7,

            // Esquerda
            4, 0, 3,
            3, 7, 4,

            // Direita
            1, 5, 6,
            6, 2, 1,

            // Topo
            3, 2, 6,
            6, 7, 3,

            // Fundo
            4, 5, 1,
            1, 0, 4
        ];
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
