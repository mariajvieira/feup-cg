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
        this.diamondMaterial = new CGFappearance(this.scene);
        this.orangeTriangleMaterial = new CGFappearance(this.scene);
        this.blueTriangleMaterial = new CGFappearance(this.scene);
        this.pinkTriangleMaterial = new CGFappearance(this.scene);
        this.redTriangleMaterial = new CGFappearance(this.scene);
        this.yellowParallelogramMaterial = new CGFappearance(this.scene);
        this.purpleTriangleMaterial = new CGFappearance(this.scene);
        
        this.tangramTexture = new CGFtexture(this.scene, 'images/tangram.png');
        
        this.diamondMaterial.setTexture(this.tangramTexture);
        this.orangeTriangleMaterial.setTexture(this.tangramTexture);
        this.blueTriangleMaterial.setTexture(this.tangramTexture);
        this.pinkTriangleMaterial.setTexture(this.tangramTexture);
        this.redTriangleMaterial.setTexture(this.tangramTexture);
        this.yellowParallelogramMaterial.setTexture(this.tangramTexture);
        this.purpleTriangleMaterial.setTexture(this.tangramTexture);
    }
    
    display() {
        // green diamond
        this.scene.pushMatrix();
        let translationMatrix = [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            -1.8, 2.3, 0, 1
        ];
        this.scene.multMatrix(translationMatrix);
        this.scene.rotate(Math.PI/8, 0,0,1);
        this.greenDiamond.updateTexCoords([
            0, 0.5,      
            0.25, 0.75,  
            0.25, 0.25,  
            0.5, 0.5 
        ]);
        
        this.diamondMaterial.apply();
        this.greenDiamond.display();
        this.scene.popMatrix();
        
        // orange triangle
        this.scene.pushMatrix();
        this.scene.translate(-1.4,1.4,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.orangeTriangle.updateTexCoords([
            0.5, 0.5,
            1, 1 , 
            1, 0
        ]);
        this.orangeTriangleMaterial.apply();
        this.orangeTriangle.display();
        this.scene.popMatrix();
        
        // blue triangle
        this.scene.pushMatrix();
        this.scene.translate(1.4,-0.5,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.blueTriangle.updateTexCoords([
            1, 0,       
            0.5, 0,     
            0.75, 0.25 
        ]);
        this.blueTriangleMaterial.apply();
        this.blueTriangle.display();
        this.scene.popMatrix();

        // pink triangle
        this.scene.pushMatrix();
        this.scene.translate(2.2,0.3,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.pinkTriangle.updateTexCoords([
            0.5, 1,
            0, 1,
            0, 0.5
        ]);
        this.pinkTriangleMaterial.apply();
        this.pinkTriangle.display();
        this.scene.popMatrix();

        // red triangle
        this.scene.pushMatrix();
        this.scene.translate(3.5,1.6,0);
        this.scene.rotate(Math.PI/4, 0,0,1);
        this.redTriangle.updateTexCoords([
            0.5, 0.5,    
            0.75, 0.75,     
            0.25, 0.75    
        ]);
        this.redTriangleMaterial.apply();
        this.redTriangle.display();
        this.scene.popMatrix();

        // yellow parallelogram
        this.scene.pushMatrix();
        this.scene.translate(0.98,-0.92,0);
        this.scene.rotate(Math.PI/2, 0,0,1);
        this.scene.scale(-1,1,1);
        this.yellowParallelogram.updateTexCoords([
            0.25, 0.75,
            0.5, 1,
            1, 1,
            0.75, 0.75

        ]);
        this.yellowParallelogramMaterial.apply();
        this.yellowParallelogram.display();
        this.scene.popMatrix();

        // purple triangle
        this.scene.pushMatrix();
        this.scene.translate(-0.4,-4.3,0);
        this.scene.rotate(-3*Math.PI/4, 0,0,1);
        this.purpleTriangle.updateTexCoords([
            0.25, 0.25  ,
            0, 0,
            0, 0.5
        ]);
        this.purpleTriangleMaterial.apply();
        this.purpleTriangle.display();
        this.scene.popMatrix();
    }
}
