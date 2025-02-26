import {CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";

/**
 * MyTangram
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.orangeTriangle = new MyTriangleBig(this);
        this.blueTriangle = new MyTriangleBig(this);
        this.pinkTriangle = new MyTriangle(this);
        this.redTriangle = new MyTriangleSmall(this);
        this.yellowParallelogram = new MyParallelogram(this);
        this.greendiamond = new MyDiamond(this);
        this.purpleTriangle = new MyTriangleSmall(this);
    }
    
    display() {
        // orange triangle
        this.scene.pushMatrix();
        this.scene.translate(-1.4,1.4,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.scene.setDiffuse(1, 0.5, 0, 1);
        this.scene.orangeTriangle.display();
        this.scene.popMatrix();

        // blue triangle
        this.scene.pushMatrix();
        this.scene.translate(1.4,-0.5,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.scene.setDiffuse(0, 0.4, 1.0, 1);
        this.scene.blueTriangle.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();
        this.scene.translate(2.2,0.3,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.setDiffuse(1, 0.5, 0.8, 1);
        this.scene.pinkTriangle.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();
        this.scene.translate(3.5,1.6,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.scene.setDiffuse(1, 0, 0, 1);
        this.scene.redTriangle.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();
        this.scene.translate(0.98,-0.92,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.scale(-1,1,1);
        this.scene.setDiffuse(1, 1, 0, 1);
        this.scene.yellowParallelogram.display();
        this.scene.popMatrix();

        // green diamond
        this.scene.pushMatrix();
        this.scene.translate(-1.8,2.3,0);
        this.scene.rotate(Math.PI/8, 0,0,1);
        this.scene.setDiffuse(0, 1, 0, 1);
        this.scene.greendiamond.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();
        this.scene.translate(-0.4,-4.3,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.scene.setDiffuse(0.5, 0, 0.5, 1);
        this.scene.purpleTriangle.display();
        this.scene.popMatrix();

    }
}

