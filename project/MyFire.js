import {CGFappearance, CGFobject, CGFtexture} from '../lib/CGF.js';

export class MyFire extends CGFobject {
    constructor(scene, size, intensity) {
        super(scene);
        this.size = size || 1.0;
        this.intensity = intensity || 1.0;
        this.numFlames = 15; 
        this.flames = [];     
        
        this.initMaterials();
        this.initBuffers();
    }
    
    initMaterials() {
        this.flameMaterial = new CGFappearance(this.scene);
        this.flameMaterial.setAmbient(0.8, 0.4, 0.0, 1.0);
        this.flameMaterial.setDiffuse(0.9, 0.3, 0.0, 1.0);
        this.flameMaterial.setSpecular(1.0, 0.6, 0.0, 1.0);
        this.flameMaterial.setEmission(0.7, 0.3, 0.0, 1.0); 
        this.flameMaterial.setShininess(100);
        
        this.flameTexture = new CGFtexture(this.scene, 'images/fire.jpg');
        this.flameMaterial.setTexture(this.flameTexture);
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        for (let i = 0; i < this.numFlames; i++) {
            const angle = (i / this.numFlames) * Math.PI * 2;
            const radius = 0.5 * this.size * (0.5 + Math.random() * 0.5);
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const height = this.size * this.intensity * (0.8 + Math.random() * 0.7);
            
            this.flames.push({
                x, z, 
                baseWidth: 0.2 + Math.random() * 0.3,
                height,
                phase: Math.random() * Math.PI * 2
            });
            
            const baseIdx = this.vertices.length / 3;
            const flame = this.flames[i];
            
            this.vertices.push(x - flame.baseWidth/2, 0, z);
            this.vertices.push(x + flame.baseWidth/2, 0, z);
            this.vertices.push(x, height, z);
            
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            
            this.texCoords.push(0, 1);
            this.texCoords.push(1, 1);
            this.texCoords.push(0.5, 0);
            
            this.indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
            
            this.vertices.push(x - flame.baseWidth/2, 0, z);
            this.vertices.push(x + flame.baseWidth/2, 0, z);
            this.vertices.push(x, height, z);
            
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            
            this.texCoords.push(0, 1);
            this.texCoords.push(1, 1);
            this.texCoords.push(0.5, 0);
            
            const backIdx = baseIdx + 3;
            this.indices.push(backIdx + 2, backIdx + 1, backIdx);
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    update(t) {
«        this.vertices = [];
        
        for (let i = 0; i < this.flames.length; i++) {
            const flame = this.flames[i];
            
            const wobble = Math.sin(t/200 + flame.phase) * 0.1;
            const newX = flame.x + wobble;
            
            this.vertices.push(newX - flame.baseWidth/2, 0, flame.z);
            this.vertices.push(newX + flame.baseWidth/2, 0, flame.z);
            this.vertices.push(newX, flame.height, flame.z);
            
            this.vertices.push(newX - flame.baseWidth/2, 0, flame.z);
            this.vertices.push(newX + flame.baseWidth/2, 0, flame.z);
            this.vertices.push(newX, flame.height, flame.z);
        }
        
        this.updateVertexBuffer();
    }
    
    display() {
        this.scene.pushMatrix();
            this.flameMaterial.apply();
            this.scene.gl.disable(this.scene.gl.CULL_FACE);
            super.display();
            this.scene.gl.enable(this.scene.gl.CULL_FACE);a
        this.scene.popMatrix();
    }
    
    extinguish(amount) {
        this.intensity -= amount;
        if (this.intensity < 0.2) {
            this.intensity = 0.2;
        }

        for (let flame of this.flames) {
            flame.height = this.size * this.intensity * (0.8 + Math.random() * 0.7);
        }
    }
}