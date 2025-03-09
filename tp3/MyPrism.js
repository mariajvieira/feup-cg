import {CGFobject} from '../lib/CGF.js';
/**
 * MyPrism
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);

        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            -0.5, 0.5, 0,	//0
            0.5, 0.5, 0,	//1
            0.5, -0.5, 0,	//2
            -0.5, -0.5, 0	//3
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 3, 2,
            0, 2, 1,
            2, 3, 0,
            1, 2, 0
        ];

        this.normals = [

        ];

        let slice_size = 2* Math.PI / this.slices;

        for (let i=0; i<this.slices; i++) {

            
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

