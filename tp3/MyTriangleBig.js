import {CGFobject} from '../lib/CGF.js';
/**
 * MyTriangleSmall
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleBig extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            0, 2, 0,	//0
             2, 0, 0,	//1
            -2, 0, 0   //2
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            1, 0, 2,
            2, 0, 1,
        ];

        this.normals = [
            0, 0, 1,  
            0, 0, 1,  
            0, 0, 1   
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

