import {CGFobject, CGFappearance, CGFtexture} from '../lib/CGF.js';
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
        // Create the diamond texture material
        this.diamondMaterial = new CGFappearance(this.scene);
        this.diamondMaterial.setAmbient(0.1, 0.1, 0.1, 1);
        this.diamondMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
        this.diamondMaterial.setSpecular(0.1, 0.1, 0.1, 1);
        this.diamondMaterial.setShininess(10.0);
        
        // Load and apply the tangram texture
        this.tangramTexture = new CGFtexture(this.scene, 'images/tangram.png');
        this.diamondMaterial.setTexture(this.tangramTexture);
        this.diamondMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    display() {
        // green diamond
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
        
        // Apply the diamond material with texture instead of just setting diffuse color
        this.diamondMaterial.apply();
        this.greenDiamond.display();
        this.scene.popMatrix();
    
        // Restore default material for other pieces
        this.scene.setDefaultAppearance();
        
        // orange triangle
        this.scene.pushMatrix();
        this.scene.translate(-1.4,1.4,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.scene.setDiffuse(1, 0.5, 0, 1);
        this.orangeTriangle.display();
        this.scene.popMatrix();
    

        // blue triangle
        this.scene.pushMatrix();
        this.scene.translate(1.4,-0.5,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.scene.setDiffuse(0, 0.4, 1.0, 1);
        this.blueTriangle.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();
        this.scene.translate(2.2,0.3,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.setDiffuse(1, 0.5, 0.8, 1);
        this.pinkTriangle.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();
        this.scene.translate(3.5,1.6,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.scene.setDiffuse(1, 0, 0, 1);
        this.redTriangle.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();
        this.scene.translate(0.98,-0.92,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.scale(-1,1,1);
        this.scene.setDiffuse(1, 1, 0, 1);
        this.yellowParallelogram.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();
        this.scene.translate(-0.4,-4.3,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.scene.setDiffuse(0.5, 0, 0.5, 1);
        this.purpleTriangle.display();
        this.scene.popMatrix();

    }
}

