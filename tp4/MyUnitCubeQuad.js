import {CGFobject} from '../lib/CGF.js';
import { MyQuad } from "./MyQuad.js";

/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyUnitCubeQuad object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, texture_top, texture_front, texture_right, texture_back, texture_left, texture_bottom) {
        super(scene);
        this.quad = new MyQuad(this.scene);
        this.texture_top = texture_top;
        this.texture_front = texture_front;
        this.texture_right = texture_right;
        this.texture_back = texture_back;
        this.texture_left = texture_left;
        this.texture_bottom = texture_bottom;
    }


    display() {

        this.scene.pushMatrix();
        this.scene.translate(0,0, -0.5);
        //this.texture_top.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0, 0.5);
        //this.texture_top.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,0.5,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        //this.texture_top.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,-0.5,0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        //this.texture_top.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.5,0,0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        //this.texture_top.bind();
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.5,0,0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        //this.texture_top.bind();
        this.quad.display();
        this.scene.popMatrix();

    }
}



