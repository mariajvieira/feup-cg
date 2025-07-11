import { CGFobject, CGFappearance, CGFtexture } from '../lib/CGF.js';
import { MyWindow } from './MyWindow.js';
import { MyDoor }   from './MyDoor.js';
import { MyCircle } from './MyCircle.js';
import { MySphere } from './MySphere.js';  

export class MyBuilding extends CGFobject {
  /**
   * Building constructor - Creates a modular building with variable floors and windows
   * @param scene - CGF scene reference
   * @param floors - Number of floors in the building
   * @param windowsPerFloor - Number of windows per floor
   * @param windowCoords - Texture coordinates for windows
   * @param windowTexture - Window texture file path
   * @param width - Building width
   * @param depth - Building depth
   * @param color - Building color as RGBA array
   */
    constructor(scene, floors, windowsPerFloor, windowCoords, windowTexture, width, depth, color) {
    super(scene);
    // Store building parameters
    this.floors          = floors;
    this.windowsPerFloor = windowsPerFloor;
    this.windowCoords    = windowCoords;
    this.windowTexture   = windowTexture;
    this.width           = width;
    this.depth           = depth;

    // Door configuration
    this.doorWidth   = 0.75;
    this.doorHeight  = 0.75;
    this.doorTexture = 'images/door.png';
    this.door        = new MyDoor(scene, this.doorWidth, this.doorHeight, this.doorTexture);

    // Building material appearance
    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(color[0], color[1], color[2], color[3]);
    this.appearance.setDiffuse(color[0], color[1], color[2], color[3]);
    this.appearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.appearance.setShininess(10);

    // Window material appearance
    this.windowAppearance = new CGFappearance(scene);
    this.windowAppearance.setAmbient(1, 1, 1, 1);
    this.windowAppearance.setDiffuse(1, 1, 1, 1);
    this.windowAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.windowAppearance.setShininess(10);
    this.windowAppearance.loadTexture(this.windowTexture);

    // Building sign material
    this.signAppearance = new CGFappearance(scene);
    this.signAppearance.setAmbient(1, 1, 1, 1);
    this.signAppearance.setDiffuse(1, 1, 1, 1);
    this.signAppearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.signAppearance.setShininess(10);
    this.signAppearance.loadTexture('images/letreiro.png');

    // Helipad material and texture system
    this.heliAppearance = new CGFappearance(scene);
    this.heliAppearance.setAmbient(1.2, 1.2, 1.2, 1); 
    this.heliAppearance.setDiffuse(1.5, 1.5, 1.5, 1);
    this.heliAppearance.setSpecular(0.5, 0.5, 0.5, 1);
    this.heliAppearance.setShininess(20);
    this.heliAppearance.loadTexture('images/helipad.png');
    
    // Store different helipad textures for different states
    this.heliNormalTexture = this.heliAppearance.texture;
    this.heliTakeoffTexture = new CGFtexture(this.scene, 'images/helipad_up.png');
    this.heliLandingTexture = new CGFtexture(this.scene, 'images/helipad_down.png');

    // Helipad animation control variables
    this.heliLightIntensity = 0;
    this.heliLightPulseSpeed = 0.15;
    this.heliManeuverState = 'none'; // States: 'none', 'takeoff', 'landing'
    this.textureBlinkTimer = 0;
    this.textureBlinkInterval = 1.5; 
    
    // Helipad warning lights material (yellow emission)
    this.heliLightMaterial = new CGFappearance(scene);
    this.heliLightMaterial.setAmbient(1.0, 1.0, 0.0, 1.0);
    this.heliLightMaterial.setDiffuse(1.0, 1.0, 0.0, 1.0);
    this.heliLightMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.heliLightMaterial.setShininess(100);
    this.heliLightMaterial.setEmission(1.0, 1.0, 0.0, 1.0);

    this.initBuffers();
    this.initWindows();
    }

    /**
     * Calculate window positions for the modular building structure
     * Creates a three-module building with different heights
     */
    initWindows() {
    this.windowPositionsSide = [];
    this.windowPositionsCenter = [];
    const sideFloors = this.floors - 1;
    
    // Define the three building modules (left wing, center, right wing)
    const modules = [
        { floors: sideFloors, x0: -this.width },  // Left wing (shorter)
        { floors: this.floors,  x0:  0         }, // Center module (full height)
        { floors: sideFloors, x0:  this.width }   // Right wing (shorter)
    ];
    
    for (let m of modules) {
        for (let f = 0; f < m.floors; f++) {
            if (m.x0 === 0 && f === 0) continue;  // Skip ground floor center (for door)
            for (let i = 0; i < this.windowsPerFloor; i++) {
                const x = m.x0 - this.width/2 + (i+1)*(this.width/(this.windowsPerFloor+1));
                const y = 0.5 + f * 1.0;          
                if (m.x0 === 0)
                    this.windowPositionsCenter.push({ x, y });
                else
                    this.windowPositionsSide.push({ x, y });
            }
        }
    }
    }

    /**
     * Initialize building geometry buffers (cube-based structure)
     */
    initBuffers() {
        const w = this.width;
        const d = this.depth;
        const h = this.floors;

        // Define vertices for a rectangular building
        this.vertices = [
            // Front face (z = 0)
            0, 0, 0,   // v0: bottom left
            w, 0, 0,   // v1: bottom right
            w, h, 0,   // v2: top right
            0, h, 0,   // v3: top left

            // Right face (x = w)
            w, 0, 0,   // v4: bottom left
            w, 0, d,   // v5: bottom right
            w, h, d,   // v6: top right
            w, h, 0,   // v7: top left

            // Back face (z = d)
            w, 0, d,   // v8: bottom left
            0, 0, d,   // v9: bottom right
            0, h, d,   // v10: top right
            w, h, d,   // v11: top left

            // Left face (x = 0)
            0, 0, d,   // v12: bottom left
            0, 0, 0,   // v13: bottom right
            0, h, 0,   // v14: top right
            0, h, d,   // v15: top left

            // Top face (y = h)
            0, h, 0,   // v16: front left
            w, h, 0,   // v17: front right
            w, h, d,   // v18: back right
            0, h, d,   // v19: back left

            // Bottom face (y = 0)
            0, 0, 0,   // v20: front left
            w, 0, 0,   // v21: front right
            w, 0, d,   // v22: back right
            0, 0, d    // v23: back left
        ];

        // Define triangle indices (counterclockwise winding for correct normals)
        this.indices = [
            // Front face
            0, 2, 1,   0, 3, 2,
            // Right face  
            4, 6, 5,   4, 7, 6,
            // Back face
            8, 10, 9,  8, 11, 10,
            // Left face
            12, 14, 13, 12, 15, 14,
            // Top face
            16, 18, 17, 16, 19, 18,
            // Bottom face
            20, 22, 21, 20, 23, 22
        ];

        // Define surface normals for proper lighting
        this.normals = [
            // Front face (pointing towards negative Z)
            0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,
            // Right face (pointing towards positive X)
            1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0,
            // Back face (pointing towards positive Z)
            0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,
            // Left face (pointing towards negative X)
            -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
            // Top face (pointing up)
            0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0,
            // Bottom face (pointing down)
            0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0
        ];

        // Define texture coordinates for each face
        this.texCoords = [
            // Front face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Right face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Back face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Left face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Top face
            0, 1,  1, 1,  1, 0,  0, 0,
            // Bottom face
            0, 1,  1, 1,  1, 0,  0, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Update building animations (helipad lights and texture blinking)
     * @param {number} t - Current time for animation calculations
     */
    update(t) {
        // Animate helipad warning lights with sinusoidal pulsing
        this.heliLightIntensity = 0.5 + 0.5 * Math.sin(t * this.heliLightPulseSpeed);
        this.heliLightMaterial.setEmission(
            this.heliLightIntensity, 
            this.heliLightIntensity, 
            0.0, 
            1.0
        );
        
        // Handle helipad texture blinking during maneuvers
        if (this.heliManeuverState !== 'none') {
            this.textureBlinkTimer += 0.05; 
            if (this.textureBlinkTimer > this.textureBlinkInterval) {
                this.textureBlinkTimer = 0;
                // Toggle between normal and maneuver-specific textures
                if (this.heliManeuverState === 'takeoff') {
                    if (this.heliAppearance.texture === this.heliNormalTexture) {
                        this.heliAppearance.setTexture(this.heliTakeoffTexture);
                    } else {
                        this.heliAppearance.setTexture(this.heliNormalTexture);
                    }
                } else if (this.heliManeuverState === 'landing') {
                    if (this.heliAppearance.texture === this.heliNormalTexture) {
                        this.heliAppearance.setTexture(this.heliLandingTexture);
                    } else {
                        this.heliAppearance.setTexture(this.heliNormalTexture);
                    }
                }
            }
        }
    }

    // Helipad state control methods
    setHelipadNormal() {
        this.heliManeuverState = 'none';
        this.heliAppearance.setTexture(this.heliNormalTexture);
    }

    setHelipadTakeoff() {
        this.heliManeuverState = 'takeoff';
        this.textureBlinkTimer = 0;
        this.heliAppearance.setTexture(this.heliTakeoffTexture);
    }

    setHelipadLanding() {
        this.heliManeuverState = 'landing';
        this.textureBlinkTimer = 0;
        this.heliAppearance.setTexture(this.heliLandingTexture);
    }

    /**
     * Render the complete building with all components
     */
    display() {
        // Calculate scaling factors for side wings
        const scaleYSide = (this.floors - 1) / this.floors;
        const scaleZSide = (this.depth - 1) / this.depth;
        const w = this.width;
        const helipadRadius = this.width * 0.4;
        const lightRadius = helipadRadius * 0.8;

        // Apply building base material
        this.appearance.apply();

        // Render left wing (shorter height)
        this.scene.pushMatrix();
            this.scene.translate(-this.width, 0, 0);
            this.scene.scale(1, scaleYSide, scaleZSide);
            super.display();
        this.scene.popMatrix();
        
        // Render center module (full height)
        this.scene.pushMatrix();
            super.display();
        this.scene.popMatrix();

        // Render right wing (shorter height)
        this.scene.pushMatrix();
            this.scene.translate(this.width, 0, 0);
            this.scene.scale(1, scaleYSide, scaleZSide);
            super.display();
        this.scene.popMatrix();

        // Render windows with appropriate material
        this.windowAppearance.apply();
        
        // Separate windows by building section
        const leftSideWindows = this.windowPositionsSide.filter(wp => wp.x < 0);
        const rightSideWindows = this.windowPositionsSide.filter(wp => wp.x >= 0);

        // Render left wing windows
        for (let wp of leftSideWindows) {
            this.scene.pushMatrix();
                this.scene.translate(wp.x + 0.5 * this.width, wp.y, this.depth - 1 + 0.02);
                this.scene.scale(0.5, 0.5, 0.5);
                new MyWindow(this.scene, this.windowCoords).display();
            this.scene.popMatrix();
        }

        // Render right wing windows
        for (let wp of rightSideWindows) {
            this.scene.pushMatrix();
                this.scene.translate(wp.x + this.width / 2, wp.y, this.depth - 1 + 0.02);
                this.scene.scale(0.5, 0.5, 0.5);
                new MyWindow(this.scene, this.windowCoords).display();
            this.scene.popMatrix();
        }

        // Render center module windows
        for (let wp of this.windowPositionsCenter) {
            this.scene.pushMatrix();
                this.scene.translate(wp.x + this.width / 2, wp.y, this.depth + 0.02);
                this.scene.scale(0.5, 0.5, 0.5);
                new MyWindow(this.scene, this.windowCoords).display();
            this.scene.popMatrix();
        }

        // Render main entrance door
        this.scene.pushMatrix();
            this.scene.translate((w - this.doorWidth)/2, 0, this.depth + 0.02);
            this.door.display();
        this.scene.popMatrix();

        // Render building sign above entrance
        const signW = this.doorWidth * 1.5;
        const signH = this.doorHeight * 0.4;
        this.scene.pushMatrix();
            this.scene.translate(
                w/2,
                this.doorHeight + signH/2 + 0.1,
                this.depth + 0.02
            );
            this.scene.scale(signW, signH, 1);
            this.signAppearance.apply();
            new MyWindow(this.scene, [0, 0, 1, 1]).display();
        this.scene.popMatrix();

        // Render helipad on building roof
        this.scene.pushMatrix();
            this.scene.translate(
                this.width/2,
                this.floors + 0.01,
                this.depth/2
            );
            this.scene.rotate(-Math.PI/2, 1, 0, 0);
            this.scene.scale(helipadRadius, helipadRadius, 0.1);
            this.heliAppearance.apply();
            new MyCircle(this.scene, 32).display();
        this.scene.popMatrix();

        // Render helipad warning lights at four corners
        const lightPositions = [
            {x: this.width/2 + lightRadius, y: this.floors + 0.1, z: this.depth/2 + lightRadius},
            {x: this.width/2 - lightRadius, y: this.floors + 0.1, z: this.depth/2 + lightRadius},
            {x: this.width/2 + lightRadius, y: this.floors + 0.1, z: this.depth/2 - lightRadius},
            {x: this.width/2 - lightRadius, y: this.floors + 0.1, z: this.depth/2 - lightRadius}
        ];
    
        for (const pos of lightPositions) {
            this.scene.pushMatrix();
                this.heliLightMaterial.apply();
                this.scene.translate(pos.x, pos.y, pos.z);
                this.scene.scale(0.3, 0.1, 0.3);
                new MySphere(this.scene, 16, 8).display();
            this.scene.popMatrix();
        }
    }
}
