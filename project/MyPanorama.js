import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MySphere } from "./MySphere.js";

export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.texture = texture;
        this.sphere = new MySphere(scene, 64, 32, true);
        
        this.appearance = new CGFappearance(scene);
        this.appearance.setAmbient(0, 0, 0, 1);
        this.appearance.setDiffuse(0, 0, 0, 1);
        this.appearance.setSpecular(0, 0, 0, 1);
        this.appearance.setEmission(1, 1, 1, 1);
        this.appearance.setTexture(texture);
        this.appearance.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    display() {
        this.appearance.apply();
        this.scene.gl.disable(this.scene.gl.LIGHTING);
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        
        this.scene.pushMatrix();
            let camPos = this.scene.camera.position;
            // Posicionar o panorama mais abaixo para esconder as casas
            this.scene.translate(camPos[0], camPos[1]-40, camPos[2]);
            
            this.scene.scale(200, 200, 200);
            this.scene.scale(-1, 1, 1); 
            
            this.sphere.display();
        this.scene.popMatrix();
        
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
        this.scene.gl.enable(this.scene.gl.LIGHTING);
    }
}