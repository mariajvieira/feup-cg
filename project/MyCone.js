import {CGFobject} from '../lib/CGF.js';


export class MyCone extends CGFobject {
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
        this.texCoords = [];

        var alphaAng = 2*Math.PI/this.slices;

        this.vertices.push(0, 1, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0);


        for(var i = 0; i < this.slices; i++) {
            var ang = i * alphaAng;
            var x = Math.sin(ang);
            var z = Math.cos(ang);

            this.vertices.push(x, 0, z);

            var nx = x / Math.sqrt(x*x + z*z + 0.25);
            var ny = 0.5 / Math.sqrt(x*x + z*z + 0.25);
            var nz = z / Math.sqrt(x*x + z*z + 0.25);

            this.normals.push(nx, ny, nz);

            this.texCoords.push(0.5 + x*0.5, 0.5 + z*0.5);
        }

        for(var i = 0; i < this.slices; i++) {
            this.indices.push(0, i+1, ((i+1) % this.slices) + 1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity){
        this.slices = 3 + Math.round(9 * complexity);

        this.initBuffers();
        this.initNormalVizBuffers();
    }
}