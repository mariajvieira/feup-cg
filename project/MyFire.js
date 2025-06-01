import {CGFappearance, CGFobject, CGFtexture} from '../lib/CGF.js';

export class MyFire extends CGFobject {
    /**
     * Fire constructor - Creates animated fire effect with multiple flame billboards
     * @param {Object} scene - CGF scene reference
     * @param {number} size - Fire size multiplier
     * @param {number} intensity - Fire intensity affecting height
     */
    constructor(scene, size, intensity) {
        super(scene);
        this.size = size || 3.0;           // Overall fire size
        this.intensity = intensity || 2.0;  // Fire intensity (affects height)
        this.numFlames = 15;               // Number of individual flame triangles
        this.flames = [];                  // Array to store flame properties
        
        // Animation control variables
        this.time = 0;
        this.animationSpeed = 0.01;
        this.maxRippleAmount = 0.8;
        
        this.initMaterials();
        this.initBuffers();
    }
    
    /**
     * Setup fire material with emissive properties for glowing effect
     */
    initMaterials() {
        this.flameMaterial = new CGFappearance(this.scene);
        this.flameMaterial.setAmbient(0.9, 0.3, 0.0, 1.0);   // Orange ambient
        this.flameMaterial.setDiffuse(0.9, 0.2, 0.0, 1.0);   // Orange diffuse
        this.flameMaterial.setSpecular(1.0, 0.5, 0.0, 1.0);  // Orange specular
        this.flameMaterial.setEmission(0.9, 0.4, 0.1, 1.0);  // Self-illumination for glow
        this.flameMaterial.setShininess(50);
        
        // Apply fire texture
        this.flameTexture = new CGFtexture(this.scene, 'images/fire.png');
        this.flameMaterial.setTexture(this.flameTexture);
    }
    
    /**
     * Generate flame geometry as billboarded triangles positioned randomly in a circle
     */
    initBuffers() {
        this.originalVertices = []; // Store original positions for animation reference
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        // Create multiple flame triangles
        for (let i = 0; i < this.numFlames; i++) {
            const angle = (i / this.numFlames) * Math.PI * 2;
            const radius = 0.5 * this.size * (0.5 + Math.random() * 0.5);
            
            // Position flames in a circular pattern with random radius variation
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            // Random height and width variations for each flame
            const heightVariation = 0.5 + Math.random() * 1.5;
            const height = this.size * this.intensity * heightVariation;
            const baseWidth = 0.2 + Math.random() * 0.4;
            
            // Store flame properties for animation
            this.flames.push({
                x, z, 
                baseWidth,
                height,
                rippleSpeed: 1 + Math.random() * 2,      // Individual animation speed
                rippleOffset: Math.random() * Math.PI * 2 // Phase offset for variation
            });
            
            const baseIdx = this.vertices.length / 3;
            const flame = this.flames[i];
            
            // Front-facing triangle (flame billboard)
            this.originalVertices.push(
                x - flame.baseWidth/2, 0, z,  // Bottom left
                x + flame.baseWidth/2, 0, z,  // Bottom right
                x, flame.height, z             // Top center
            );
            
            this.vertices.push(x - flame.baseWidth/2, 0, z);
            this.vertices.push(x + flame.baseWidth/2, 0, z);
            this.vertices.push(x, flame.height, z);
            
            // All normals point forward for front face
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            this.normals.push(0, 0, 1);
            
            // Texture coordinates for triangle
            this.texCoords.push(0, 1);    // Bottom left
            this.texCoords.push(1, 1);    // Bottom right
            this.texCoords.push(0.5, 0);  // Top center
            
            this.indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
            
            // Back-facing triangle (for visibility from all angles)
            this.originalVertices.push(
                x - flame.baseWidth/2, 0, z,
                x + flame.baseWidth/2, 0, z,
                x, flame.height, z
            );
            
            this.vertices.push(x - flame.baseWidth/2, 0, z);
            this.vertices.push(x + flame.baseWidth/2, 0, z);
            this.vertices.push(x, flame.height, z);
            
            // Normals point backward for back face
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            this.normals.push(0, 0, -1);
            
            this.texCoords.push(0, 1);
            this.texCoords.push(1, 1);
            this.texCoords.push(0.5, 0);
            
            // Reverse winding order for back face
            const backIdx = baseIdx + 3;
            this.indices.push(backIdx + 2, backIdx + 1, backIdx);
        }
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    
    /**
     * Animate fire by applying sinusoidal ripple effects to vertices
     * @param {number} t - Current time (not used, internal timer preferred)
     */
    update(t) {
        this.time += this.animationSpeed;
        
        // Update each vertex position based on original position + ripple effect
        for (let i = 0; i < this.originalVertices.length / 3; i++) {
            const flameIndex = Math.floor(i / 6);  // 6 vertices per flame (front + back)
            const flame = this.flames[flameIndex];
            
            const vertexType = i % 3;  // 0: left base, 1: right base, 2: top
            
            // Get original vertex position
            const origX = this.originalVertices[i * 3];
            const origY = this.originalVertices[i * 3 + 1];
            const origZ = this.originalVertices[i * 3 + 2];
            
            // Different ripple amounts for different vertex types
            let rippleAmount = 0;
            if (vertexType === 2) {  // Top vertex gets more movement
                rippleAmount = this.maxRippleAmount * 1.5;
            } else {  // Base vertices get less movement
                rippleAmount = this.maxRippleAmount * 0.5;
            }
            
            // Phase offsets for different vertices to create natural flame motion
            const rippleOffset = (vertexType === 0) ? 0 : 
                               (vertexType === 1) ? Math.PI/2 : 
                               Math.PI/4;
            
            // Calculate ripple displacement using sinusoidal functions
            const rippleX = rippleAmount * Math.sin(this.time * flame.rippleSpeed + flame.rippleOffset + rippleOffset);
            const rippleY = rippleAmount * Math.sin(this.time * flame.rippleSpeed * 1.3 + flame.rippleOffset + rippleOffset);
            
            // Apply ripple to vertex position
            this.vertices[i * 3] = origX + rippleX;
            this.vertices[i * 3 + 1] = origY + rippleY + (vertexType === 2 ? rippleY * 2 : 0); // Extra Y movement for top
            this.vertices[i * 3 + 2] = origZ + rippleX * 0.5; // Slight Z movement for 3D effect
        }
        
        this.updateVertices();
    }
    
    /**
     * Update vertex buffer with new animated positions
     */
    updateVertices() {
        if (!this.vertexBuffer) {
            this.initGLBuffers(); 
            return;
        }
        
        // Update GPU buffer with new vertex data
        const gl = this.scene.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    }
    
    /**
     * Render fire with proper blending and culling settings
     */
    display() {
        this.scene.pushMatrix();
        this.flameMaterial.apply();
        
        // Disable face culling so fire is visible from all angles
        const gl = this.scene.gl;
        gl.disable(gl.CULL_FACE);
        super.display();                
        gl.enable(gl.CULL_FACE);
        
        this.scene.popMatrix();
    }
}