import { CGFobject } from '../lib/CGF.js';
import { MyWindow } from './MyWindow.js';

export class MyBuilding extends CGFobject {
    constructor(scene, floors, windowsPerFloor, windowCoords, width, depth) {
        super(scene);
        this.floors = floors;      // altura do módulo central
        this.width = width;          
        this.depth = depth;        
        this.windowsPerFloor = windowsPerFloor;
        this.windowCoords = windowCoords;
        this.initBuffers();
        this.initWindows();
    }

    initWindows() {
        // Separa janelas dos módulos laterais e da parte central
        this.windowPositionsSide = [];
        this.windowPositionsCenter = [];
        const sideFloors = this.floors - 1;
        const modules = [
            { floors: sideFloors, x0: -this.width },
            { floors: this.floors,  x0:  0         },
            { floors: sideFloors, x0:  this.width }
        ];
        for (let m of modules) {
            for (let f = 0; f < m.floors; f++) {
                if (m.x0 === 0 && f === 0) continue;  // sem janelas no R/C do módulo central
                for (let i = 0; i < this.windowsPerFloor; i++) {
                    const x = m.x0 - this.width/2 + (i+1)*(this.width/(this.windowsPerFloor+1));
                    const y = 0.5 + f * 1.0;           // altura do centro da janela
                    if (m.x0 === 0)
                        this.windowPositionsCenter.push({ x, y });
                    else
                        this.windowPositionsSide.push({ x, y });
                }
            }
        }
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
        const scaleYSide = (this.floors - 1) / this.floors;
        const scaleZSide = (this.depth - 1) / this.depth;
        
        // Left (Módulo lateral esquerdo)
        this.scene.pushMatrix();
            this.scene.translate(-this.width, 0, 0);
            this.scene.scale(1, scaleYSide, scaleZSide);
            super.display();
        this.scene.popMatrix();

        // Center (Módulo central)
        this.scene.pushMatrix();
            super.display();
        this.scene.popMatrix();

        // Right (Módulo lateral direito)
        this.scene.pushMatrix();
            this.scene.translate(this.width, 0, 0);
            this.scene.scale(1, scaleYSide, scaleZSide);
            super.display();
        this.scene.popMatrix();

        // Aplica o material das janelas
        this.scene.windowMaterial.apply();

        // Separa as janelas dos módulos laterais em dois arrays
        const leftSideWindows = this.windowPositionsSide.filter(wp => wp.x < 0);
        const rightSideWindows = this.windowPositionsSide.filter(wp => wp.x >= 0);

        // Desenha as janelas do módulo lateral esquerdo
        for (let wp of leftSideWindows) {
            this.scene.pushMatrix();
                // Offset para centralizar com base em this.width
                this.scene.translate(wp.x + 0.5 * this.width, wp.y, this.depth - 1 + 0.01);
                this.scene.scale(0.5, 0.5, 0.5);
                new MyWindow(this.scene, this.windowCoords).display();
            this.scene.popMatrix();
        }

        // Desenha as janelas do módulo lateral direito
        for (let wp of rightSideWindows) {
            this.scene.pushMatrix();
                // Offset para centralizar com base em this.width
                this.scene.translate(wp.x + this.width / 2, wp.y, this.depth - 1 + 0.01);
                this.scene.scale(0.5, 0.5, 0.5);
                new MyWindow(this.scene, this.windowCoords).display();
            this.scene.popMatrix();
        }

        // Desenha as janelas do módulo central
        for (let wp of this.windowPositionsCenter) {
            this.scene.pushMatrix();
                // No módulo central, centralizamos com offset this.width/2
                this.scene.translate(wp.x + this.width / 2, wp.y, this.depth + 0.01);
                this.scene.scale(0.5, 0.5, 0.5);
                new MyWindow(this.scene, this.windowCoords).display();
            this.scene.popMatrix();
        }
    }
}
