import { CGFappearance, CGFobject, CGFtexture } from '../lib/CGF.js';

export class MyLake extends CGFobject {
    constructor(scene, width, depth, detail) {
        super(scene);
        this.width = width || 20;  
        this.depth = depth || 15;  
        this.detail = detail || 32; 

        this.initBuffers();
        this.initMaterials();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.vertices.push(0, 0, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.detail; i++) {
            const angle = (i / this.detail) * Math.PI * 2;
            
            const x = Math.cos(angle) * this.width;
            const z = Math.sin(angle) * this.depth;

            this.vertices.push(x, 0, z);
            this.normals.push(0, 1, 0);
            
            const u = 0.5 + 0.5 * Math.cos(angle);
            const v = 0.5 + 0.5 * Math.sin(angle);
            this.texCoords.push(u, v);
            
            if (i < this.detail) {
                this.indices.push(0, i+1, i+2);
            }
        }
        
        this.indices.push(0, this.detail, 1);
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    initMaterials() {
        this.waterMaterial = new CGFappearance(this.scene);
        this.waterMaterial.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.waterMaterial.setDiffuse(0.2, 0.6, 0.9, 1.0);
        this.waterMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.waterMaterial.setShininess(120);
        
        this.waterTexture = new CGFtexture(this.scene, 'images/water.png');
        this.waterMaterial.setTexture(this.waterTexture);
        this.waterMaterial.setTextureWrap('REPEAT', 'REPEAT');
    }
    
    display() {
        this.scene.pushMatrix();
            this.waterMaterial.apply();
            super.display();
        this.scene.popMatrix();
    }
}