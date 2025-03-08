import {CGFobject, CGFappearance} from '../lib/CGF.js';
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
        this.orangeTriangle = new MyTriangleBig(this.scene);
        this.blueTriangle = new MyTriangleBig(this.scene);
        this.pinkTriangle = new MyTriangle(this.scene);
        this.redTriangle = new MyTriangleSmall(this.scene);
        this.yellowParallelogram = new MyParallelogram(this.scene);
        this.greenDiamond = new MyDiamond(this.scene);
        this.purpleTriangle = new MyTriangleSmall(this.scene);
        
        this.initMaterials();
    }

    initMaterials() {  
        this.materialOrange = new CGFappearance(this.scene);
        this.materialOrange.setAmbient(0.2, 0.1, 0.0, 1.0);
        this.materialOrange.setDiffuse(1, 0.5, 0, 1);
        this.materialOrange.setSpecular(1, 1, 1, 1);
        this.materialOrange.setShininess(10.0);
    
        this.materialBlue = new CGFappearance(this.scene);
        this.materialBlue.setAmbient(0.0, 0.2, 0.3, 1.0);
        this.materialBlue.setDiffuse(0, 0.4, 1.0, 1);
        this.materialBlue.setSpecular(1, 1, 1, 1);
        this.materialBlue.setShininess(10.0);
    
        this.materialPink = new CGFappearance(this.scene);
        this.materialPink.setAmbient(0.2, 0.1, 0.3, 1.0);
        this.materialPink.setDiffuse(1, 0.5, 0.8, 1);
        this.materialPink.setSpecular(1, 1, 1, 1);
        this.materialPink.setShininess(10.0);
    
        this.materialRed = new CGFappearance(this.scene);
        this.materialRed.setAmbient(0.2, 0.0, 0.0, 1.0);
        this.materialRed.setDiffuse(1, 0, 0, 1);
        this.materialRed.setSpecular(1, 1, 1, 1);
        this.materialRed.setShininess(10.0);
    
        this.materialYellow = new CGFappearance(this.scene);
        this.materialYellow.setAmbient(0.2, 0.2, 0.0, 1.0);
        this.materialYellow.setDiffuse(1, 1, 0, 1);
        this.materialYellow.setSpecular(1, 1, 1, 1);
        this.materialYellow.setShininess(10.0);
    
        this.materialGreen = new CGFappearance(this.scene);
        this.materialGreen.setAmbient(0.0, 0.2, 0.0, 1.0);
        this.materialGreen.setDiffuse(0, 1, 0, 1);
        this.materialGreen.setSpecular(1, 1, 1, 1);
        this.materialGreen.setShininess(10.0);
    
        this.materialPurple = new CGFappearance(this.scene);
        this.materialPurple.setAmbient(0.2, 0.0, 0.2, 1.0);
        this.materialPurple.setDiffuse(0.5, 0, 0.5, 1);
        this.materialPurple.setSpecular(1, 1, 1, 1);
        this.materialPurple.setShininess(10.0);
    }
    
    
    display() {

        this.scene.pushMatrix();
        let translationMatrix =
        [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -1.8, 2.3, 0, 1
        ];
        this.scene.multMatrix(translationMatrix);
        this.scene.rotate(Math.PI/8, 0,0,1);
        this.scene.materials[4].apply();
        this.greenDiamond.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.4,1.4,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.materialOrange.apply();
        this.orangeTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.4,-0.5,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.materialBlue.apply();
        this.blueTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(2.2,0.3,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.materialPink.apply();
        this.pinkTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(3.5,1.6,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.materialRed.apply();
        this.redTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0.98,-0.92,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.scale(-1,1,1);
        this.materialYellow.apply();
        this.yellowParallelogram.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-0.4,-4.3,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.materialPurple.apply();
        this.purpleTriangle.display();
        this.scene.popMatrix();
    }
    
}
