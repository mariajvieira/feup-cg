import {CGFobject} from '../lib/CGF.js';

export class MyWindow extends CGFobject {
    constructor(scene, coords) {
        super(scene);
        this.initBuffers();
        if (coords != undefined)
            this.updateTexCoords(coords);
    }
    
    initBuffers() {
        this.vertices = [
            -0.5, -0.5, 0,  // bottom left
             0.5, -0.5, 0,  // bottom right
            -0.5,  0.5, 0,  // top left
             0.5,  0.5, 0   // top right
        ];

        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ];

        this.texCoords = [
            0, 1,  // bottom left
            1, 1,  // bottom right
            0, 0,  // top left
            1, 0   // top right
        ];

        this.initGLBuffers();
    }

    updateTexCoords(coords) {
        // Expecting coords as [s_min, t_min, s_max, t_max]
        this.texCoords = [
            coords[0], coords[3],
            coords[2], coords[3],
            coords[0], coords[1],
            coords[2], coords[1]
        ];
        this.updateTexCoordsGLBuffers();
    }
}

