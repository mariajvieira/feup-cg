import { CGFappearance, CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MySphere } from './MySphere.js';
import { MyCircle } from './MyCircle.js';


export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);


        this.position = { x: 0, y: 0, z: 0 };  // posição no mundo
        this.rotation = 0;                     // rotação em torno de Y (direção)
        this.speed = 0;                        // velocidade atual
        this.mainRotorAngle = 0;               // ângulo da hélice principal
        this.tailRotorAngle = 0;               // ângulo da hélice traseira
        this.bucketAttached = true;            // se o balde está pendurado
        this.bucketLength = 1.5;               // comprimento do cabo

        this.bodyLength = 6;
        this.bodyWidth = 2;
        this.bodyHeight = 1.8;
        this.tailLength = 4;
        
        this.initComponents();
        
        this.initMaterials();
    }
    
    initComponents() {
        this.sphere = new MySphere(this.scene, 16, 8);
        this.cylinder = new MyCylinder(this.scene, 16);
        this.circle = new MyCircle(this.scene, 16);
        
    }
    
    initMaterials() {
        this.cabinMaterial = new CGFappearance(this.scene);
        this.cabinMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.cabinMaterial.setDiffuse(0.9, 0.1, 0.1, 1.0); 
        this.cabinMaterial.setSpecular(0.8, 0.8, 0.8, 1.0);
        this.cabinMaterial.setShininess(30);
        
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setAmbient(0.1, 0.1, 0.2, 0.8);
        this.glassMaterial.setDiffuse(0.1, 0.1, 0.3, 0.8); 
        this.glassMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.glassMaterial.setShininess(100);
        
        this.rotorMaterial = new CGFappearance(this.scene);
        this.rotorMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.rotorMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0); 
        this.rotorMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.rotorMaterial.setShininess(20);
        
        this.bucketMaterial = new CGFappearance(this.scene);
        this.bucketMaterial.setAmbient(0.1, 0.1, 0.1, 1.0);
        this.bucketMaterial.setDiffuse(0.3, 0.6, 0.9, 1.0); 
        this.bucketMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.bucketMaterial.setShininess(10);
        
        this.cabinTexture = new CGFtexture(this.scene, 'images/heli_body.jpg');
        this.cabinMaterial.setTexture(this.cabinTexture);
    }

    update(t) {
        const baseMainRotorSpeed = 2.0;
        const baseTailRotorSpeed = 3.0;
        
        this.mainRotorAngle += (baseMainRotorSpeed + Math.abs(this.speed)) * 0.1;
        this.tailRotorAngle += (baseTailRotorSpeed + Math.abs(this.speed)) * 0.2;
        
        this.mainRotorAngle %= Math.PI * 2;
        this.tailRotorAngle %= Math.PI * 2;
    }

    drawCabin() {
        this.scene.pushMatrix();
            this.cabinMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.scale(this.bodyLength/2, this.bodyHeight/2, this.bodyWidth/2);
                this.sphere.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
                this.scene.translate(this.bodyLength/2 * 0.7, this.bodyHeight/2 * 0.3, 0);
                this.scene.scale(this.bodyLength/4, this.bodyHeight/2.5, this.bodyWidth/2.5);
                this.scene.rotate(Math.PI/4, 0, 0, 1); // inclinação
                this.glassMaterial.apply();
                this.sphere.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    drawTail() {
        this.scene.pushMatrix();
            this.cabinMaterial.apply();
            
            this.scene.pushMatrix();
                this.scene.translate(-this.bodyLength/3, 0, 0);
                this.scene.rotate(Math.PI/2, 0, 1, 0); // apontar para trás
                this.scene.scale(this.bodyWidth/3, this.bodyHeight/3, this.tailLength);
                this.cylinder.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
                this.scene.translate(-this.bodyLength/2 - this.tailLength*0.8, this.bodyHeight/2, 0);
                this.scene.scale(this.tailLength/4, this.bodyHeight/1.5, 0.1);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    drawMainRotor() {
        const bladeLength = this.bodyLength * 0.8;
        const bladeWidth = 0.4;
        
        this.scene.pushMatrix();
            this.scene.pushMatrix();
                this.scene.translate(0, this.bodyHeight/2 + 0.2, 0);
                this.scene.rotate(Math.PI/2, 1, 0, 0); // vertical
                this.scene.scale(0.2, 0.2, 0.4);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
                this.scene.translate(0, this.bodyHeight/2 + 0.4, 0);
                this.scene.rotate(this.mainRotorAngle, 0, 1, 0); 
                
                for (let i = 0; i < 4; i++) {
                    this.scene.pushMatrix();
                        this.scene.rotate(i * Math.PI/2, 0, 1, 0);
                        this.scene.translate(bladeLength/2, 0, 0);
                        this.scene.scale(bladeLength, 0.05, bladeWidth);
                        this.rotorMaterial.apply();
                        this.cylinder.display();
                    this.scene.popMatrix();
                }
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    drawTailRotor() {
        const bladeLength = this.bodyWidth;
        
        this.scene.pushMatrix();
            this.scene.translate(-this.bodyLength/2 - this.tailLength*0.9, 0, this.bodyWidth/2.5);
            
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2, 0, 0, 1); 
                this.scene.scale(0.1, 0.1, 0.2);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
                this.scene.translate(0, 0, 0.15);
                this.scene.rotate(this.tailRotorAngle, 0, 0, 1); 
                
                for (let i = 0; i < 3; i++) {
                    this.scene.pushMatrix();
                        this.scene.rotate(i * Math.PI * 2/3, 0, 0, 1);
                        this.scene.translate(0, bladeLength/2, 0);
                        this.scene.scale(0.1, bladeLength, 0.02);
                        this.rotorMaterial.apply();
                        this.cylinder.display();
                    this.scene.popMatrix();
                }
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    drawLandingGear() {
        this.scene.pushMatrix();
            this.rotorMaterial.apply();
            
            for (let side of [-1, 1]) {
                this.scene.pushMatrix();
                    this.scene.translate(this.bodyLength/4, -this.bodyHeight/2, side * this.bodyWidth/2);
                    this.scene.rotate(Math.PI/2, 1, 0, 0);
                    this.scene.scale(0.15, 0.15, this.bodyHeight/2);
                    this.cylinder.display();
                this.scene.popMatrix();
                
                this.scene.pushMatrix();
                    this.scene.translate(-this.bodyLength/4, -this.bodyHeight/2, side * this.bodyWidth/2);
                    this.scene.rotate(Math.PI/2, 1, 0, 0);
                    this.scene.scale(0.15, 0.15, this.bodyHeight/2);
                    this.cylinder.display();
                this.scene.popMatrix();
                
                this.scene.pushMatrix();
                    this.scene.translate(0, -this.bodyHeight/1.5, side * this.bodyWidth/1.8);
                    this.scene.rotate(Math.PI/2, 0, 1, 0);
                    this.scene.scale(0.15, 0.15, this.bodyLength/1.5);
                    this.cylinder.display();
                this.scene.popMatrix();
            }
        this.scene.popMatrix();
    }
    
    drawBucket() {
        if (!this.bucketAttached) return;
        
        this.scene.pushMatrix();
            this.scene.pushMatrix();
                this.scene.translate(0, -this.bodyHeight/2, 0);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.scale(0.1, 0.1, this.bucketLength);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
            
            this.scene.pushMatrix();
                this.scene.translate(0, -this.bodyHeight/2 - this.bucketLength, 0);
                
                this.scene.pushMatrix();
                    this.scene.rotate(Math.PI/2, 1, 0, 0);
                    this.scene.scale(0.6, 0.6, 0.8);
                    this.bucketMaterial.apply();
                    this.cylinder.display();
                this.scene.popMatrix();
                
                this.scene.pushMatrix();
                    this.scene.translate(0, -0.8, 0);
                    this.scene.rotate(-Math.PI/2, 1, 0, 0);
                    this.scene.scale(0.6, 0.6, 1);
                    this.bucketMaterial.apply();
                    this.circle.display();
                this.scene.popMatrix();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.position.x, this.position.y, this.position.z);
            this.scene.rotate(this.rotation, 0, 1, 0);
            
            this.drawCabin();
            this.drawTail();
            this.drawMainRotor();
            this.drawTailRotor();
            this.drawLandingGear();
            this.drawBucket();
        this.scene.popMatrix();
    }
    
}