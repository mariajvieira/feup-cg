import {CGFappearance, CGFobject, CGFtexture} from '../lib/CGF.js';

export class MyFire extends CGFobject {
    constructor(scene, size, intensity) {
        super(scene);
        this.size = size || 3.0;
        this.intensity = intensity || 2.0;
        this.numFlames = 15;
        this.flames = [];
        
        this.time = 0;
        this.animationSpeed = 0.01;
        this.maxRippleAmount = 0.8;
        
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
        this.originalVertices = []; 
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        for (let i = 0; i < this.numFlames; i++) {
            const angle = (i / this.numFlames) * Math.PI * 2;
            const radius = 0.5 * this.size * (0.5 + Math.random() * 0.5);
            
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            const heightVariation = 0.5 + Math.random() * 1.5;
            const height = this.size * this.intensity * heightVariation;
            
            const baseWidth = 0.2 + Math.random() * 0.4;
            
            this.flames.push({
                x, z, 
                baseWidth,
                height,
                rippleSpeed: 1 + Math.random() * 2, 
                rippleOffset: Math.random() * Math.PI * 2 
            });
            
            const baseIdx = this.vertices.length / 3;
            const flame = this.flames[i];
            
            this.originalVertices.push(
                x - flame.baseWidth/2, 0, z,
                x + flame.baseWidth/2, 0, z,
                x, flame.height, z
            );
            
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
            
            this.originalVertices.push(
                x - flame.baseWidth/2, 0, z,
                x + flame.baseWidth/2, 0, z,
                x, flame.height, z
            );
            
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
    
    update(t) {
        this.time += this.animationSpeed;
        
        for (let i = 0; i < this.originalVertices.length / 3; i++) {
            const flameIndex = Math.floor(i / 6);
            const flame = this.flames[flameIndex];
            
            const vertexType = i % 3; 
            
            const origX = this.originalVertices[i * 3];
            const origY = this.originalVertices[i * 3 + 1];
            const origZ = this.originalVertices[i * 3 + 2];
            
            let rippleAmount = 0;
            
            if (vertexType === 2) { 
                rippleAmount = this.maxRippleAmount * 1.5;
            } else { 
                rippleAmount = this.maxRippleAmount * 0.5;
            }
            
            const rippleOffset = (vertexType === 0) ? 0 : 
                               (vertexType === 1) ? Math.PI/2 : 
                               Math.PI/4;
            
            const rippleX = rippleAmount * Math.sin(this.time * flame.rippleSpeed + flame.rippleOffset + rippleOffset);
            const rippleY = rippleAmount * Math.sin(this.time * flame.rippleSpeed * 1.3 + flame.rippleOffset + rippleOffset);
            
            this.vertices[i * 3] = origX + rippleX;
            this.vertices[i * 3 + 1] = origY + rippleY + (vertexType === 2 ? rippleY * 2 : 0); 
            this.vertices[i * 3 + 2] = origZ + rippleX * 0.5; 
        }
        
        this.updateVertices();
    }
    
    updateVertices() {
        if (!this.vertexBuffer) {
            this.initGLBuffers(); 
            return;
        }
        
        const gl = this.scene.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
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