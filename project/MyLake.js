import {CGFappearance, CGFobject, CGFtexture} from '../lib/CGF.js';
import {MyPlane} from './MyPlane.js';

export class MyLake extends CGFobject {
    constructor(scene, width, depth) {
        super(scene);
        this.width = width || 20;
        this.depth = depth || 20;
        
        this.plane = new MyPlane(scene, 20, 0, 5, 0, 5);
        this.initMaterials();
    }
    
    initMaterials() {
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.waterMaterial.setDiffuse(0.2, 0.4, 0.8, 0.8);
        this.waterMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.waterMaterial.setShininess(120);
        
        this.waterTexture = new CGFtexture(this.scene, 'images/water.png');
        this.waterMaterial.setTexture(this.waterTexture);
        this.waterMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    display() {
        this.scene.pushMatrix();
            this.waterMaterial.apply();
            
            this.scene.translate(0, 0.02, 0);
            this.scene.scale(this.width, 1, this.depth);
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            
            this.plane.display();
        this.scene.popMatrix();
    }
}