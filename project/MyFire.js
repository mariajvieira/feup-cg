import {CGFappearance, CGFobject, CGFtexture} from '../lib/CGF.js';

export class MyFire extends CGFobject {
    constructor(scene, size, intensity) {
        super(scene);
        this.size = size || 3.0;
        this.intensity = intensity || 2.0;
        this.numFlames = 20;
        this.flames = [];
        
        this.initMaterials();
        this.initBuffers();
    }
    
    initMaterials() {
        this.flameMaterial = new CGFappearance(this.scene);
        this.flameMaterial.setAmbient(0.9, 0.3, 0.0, 1.0);
        this.flameMaterial.setDiffuse(0.9, 0.2, 0.0, 1.0);
        this.flameMaterial.setSpecular(1.0, 0.5, 0.0, 1.0);
        this.flameMaterial.setEmission(0.9, 0.4, 0.1, 1.0);
        this.flameMaterial.setShininess(50);
        
        this.flameTexture = new CGFtexture(this.scene, 'images/fire.png');
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
            
            const heightVariation = 0.5 + Math.random() * 1.5; // Varia entre 0.5 e 2.0
            const height = this.size * this.intensity * heightVariation;
            
            const baseWidth = 0.2 + Math.random() * 0.4;
            
            this.flames.push({
                x, z, 
                baseWidth,
                height
            });
            
            const baseIdx = this.vertices.length / 3;
            const flame = this.flames[i];
            
            this.vertices.push(x - flame.baseWidth/2, 0, z);
            this.vertices.push(x + flame.baseWidth/2, 0, z);
            this.vertices.push(x, flame.height, z);
            
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            
            this.texCoords.push(0, 1);
            this.texCoords.push(1, 1);
            this.texCoords.push(0.5, 0);
            
            this.indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
            
            this.vertices.push(x - flame.baseWidth/2, 0, z);
            this.vertices.push(x + flame.baseWidth/2, 0, z);
            this.vertices.push(x, flame.height, z);
            
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
    
    display() {
        this.scene.pushMatrix();
        this.flameMaterial.apply();
        const gl = this.scene.gl;
        gl.disable(gl.CULL_FACE);
        super.display();                
        gl.enable(gl.CULL_FACE);
        this.scene.popMatrix();
    }
}