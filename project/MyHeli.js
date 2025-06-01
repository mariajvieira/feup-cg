import { CGFappearance, CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MySphere } from './MySphere.js';
import { MyCircle } from './MyCircle.js';

export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);
        // Helicopter position and orientation
        this.position = { x: 0, y: 0, z: 0 };  
        this.rotation = 0;                    
        this.speed = 0;                        
        this.mainRotorAngle = 0;              
        this.tailRotorAngle = 0;               
        this.bucketAttached = false;          
        this.bucketLength = 1;              
        this.pitchAngle = 0;                   
        
        // Helicopter physical dimensions
        this.bodyLength = 6;
        this.bodyWidth = 2;
        this.bodyHeight = 1.8;
        this.tailLength = 4;
        
        // Flight state management
        this.isFlying = false;                 
        this.isLanding = false;                
        this.isTakingOff = false;              
        this.isFillingBucket = false;          
        this.cruiseAltitude = 15;              
        
        // Important location references for navigation
        this.helipadPosition = { x: 0, y: 0, z: 0 }; 
        this.lakePosition = { x: 20, y: -20, z: 20 }; 
        this.forestPosition = { x: 100, y: -50, z: -100 }; 
        this.forestScale = 5;
        this.forestRadius = 200;
        this.bucketFilled = false;
        this.savedAltitude = 0;
        this.lakeRadius = 10;
        this.fireRadius = 15;
        this.isReturningToAltitude = false;
        
        // Lake interaction state machine
        this.isDescendingToLake = false;
        this.isWaitingAtLake = false;
        this.isAscendingFromLake = false;
    
        // Movement parameters
        this.verticalSpeed = 0.2;
        this.maxSpeed = 0.5;                   
        this.speedFactor = 1.0;                
        
        // Water dropping mechanics
        this.waterDropped = false;
        this.waterDropTimer = 0;

        this.initComponents();
        this.initMaterials();
    }
    
    /**
     * Initialize geometric components for helicopter parts
     */
    initComponents() {
        this.sphere = new MySphere(this.scene, 16, 8);
        this.cylinder = new MyCylinder(this.scene, 16);
        this.circle = new MyCircle(this.scene, 16);
    }
    
    /**
     * Setup material appearances for different helicopter components
     */
    initMaterials() {
        // Red cabin material
        this.cabinMaterial = new CGFappearance(this.scene);
        this.cabinMaterial.setAmbient(0.6, 0.1, 0.1, 1.0); 
        this.cabinMaterial.setDiffuse(0.9, 0.2, 0.2, 1.0); 
        this.cabinMaterial.setSpecular(0.3, 0.3, 0.3, 1.0); 
        this.cabinMaterial.setShininess(10);
        
        // Transparent glass material for cockpit
        this.glassMaterial = new CGFappearance(this.scene);
        this.glassMaterial.setAmbient(0.1, 0.1, 0.2, 0.8);
        this.glassMaterial.setDiffuse(0.1, 0.1, 0.3, 0.8); 
        this.glassMaterial.setSpecular(1.0, 1.0, 1.0, 1.0);
        this.glassMaterial.setShininess(100);
        
        // Metallic rotor material
        this.rotorMaterial = new CGFappearance(this.scene);
        this.rotorMaterial.setAmbient(0.2, 0.2, 0.2, 1.0);
        this.rotorMaterial.setDiffuse(0.3, 0.3, 0.3, 1.0); 
        this.rotorMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.rotorMaterial.setShininess(20);
        
        // Red bucket material (empty state)
        this.bucketEmptyMaterial = new CGFappearance(this.scene);
        this.bucketEmptyMaterial.setAmbient(0.8, 0.1, 0.1, 1.0);
        this.bucketEmptyMaterial.setDiffuse(0.9, 0.2, 0.2, 1.0); 
        this.bucketEmptyMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.bucketEmptyMaterial.setShininess(10);
        
        // Blue bucket material (filled with water)
        this.bucketFilledMaterial = new CGFappearance(this.scene);
        this.bucketFilledMaterial.setAmbient(0.1, 0.4, 0.8, 1.0);
        this.bucketFilledMaterial.setDiffuse(0.2, 0.6, 0.9, 1.0); 
        this.bucketFilledMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.bucketFilledMaterial.setShininess(10);
    }

    /**
     * Update helicopter animations and state machine
     * @param {number} t - Current time for animations
     */
    update(t) {
        const baseMainRotorSpeed = 2.0;
        const baseTailRotorSpeed = 3.0;
        
        // Animate rotor blades based on flight state
        if (this.isFlying || this.isTakingOff || this.isDescendingToLake || this.isAscendingFromLake) {
            this.mainRotorAngle += (baseMainRotorSpeed + Math.abs(this.speed)) * 0.1;
            this.tailRotorAngle += (baseTailRotorSpeed + Math.abs(this.speed)) * 0.2;
        } else {
            // Gradual rotor slowdown when landed
            if (this.mainRotorAngle > 0.01) {
                this.mainRotorAngle += baseMainRotorSpeed * 0.05;
            } else {
                this.mainRotorAngle = 0;
            }
            
            if (this.tailRotorAngle > 0.01) {
                this.tailRotorAngle += baseTailRotorSpeed * 0.05;
            } else {
                this.tailRotorAngle = 0;
            }
        }
        
        this.mainRotorAngle %= Math.PI * 2;
        this.tailRotorAngle %= Math.PI * 2;
        
        // Handle forward/backward movement when flying
        if (this.isFlying) {
            const dirX = Math.cos(this.rotation);
            const dirZ = -Math.sin(this.rotation);
            
            this.position.x += dirX * this.speed * this.speedFactor;
            this.position.z += dirZ * this.speed * this.speedFactor;
            this.pitchAngle = this.speed * -0.5; // Pitch forward when accelerating
        }
        
        // Takeoff sequence automation
        if (this.isTakingOff) {
            if (this.position.y < this.cruiseAltitude) {
                this.position.y += this.verticalSpeed;
                
                // Attach bucket when halfway up
                if (this.position.y > this.helipadPosition.y + this.cruiseAltitude/2) {
                    this.bucketAttached = true;
                }
            } else {
                this.position.y = this.cruiseAltitude;
                this.isTakingOff = false;
                this.isFlying = true;
            }
        }
        
        // Landing sequence automation
        if (this.isLanding) {
            const dx = this.helipadPosition.x - this.position.x;
            const dz = this.helipadPosition.z - this.position.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            // Navigate to helipad horizontally first
            if (dist > 0.5) {
                this.rotation = Math.atan2(dx, -dz);
                this.position.x += dx * 0.05;
                this.position.z += dz * 0.05;
            } else {
                // Descend when over helipad
                if (this.position.y > this.helipadPosition.y + 0.1) {
                    this.position.y -= this.verticalSpeed;
                    
                    // Detach bucket when close to ground
                    if (this.position.y < this.helipadPosition.y + 2) {
                        this.bucketAttached = false;
                    }
                } else {
                    // Complete landing
                    this.position.y = this.helipadPosition.y;
                    this.isLanding = false;
                    this.isFlying = false;
                    this.speed = 0;
                    this.pitchAngle = 0;
                    this.bucketFilled = false;
                }
            }
        }
        
        // Lake water collection sequence
        if (this.isDescendingToLake) {
            const targetY = this.lakePosition.y + 0.5;
            if (this.position.y > targetY) {
                this.position.y -= this.verticalSpeed;
            } else {
                this.position.y = targetY;
                this.isDescendingToLake = false;
                this.isWaitingAtLake = true;
                this.bucketFilled = true; 
                this.speed = 0;
                console.log("Bucket filled! Press P to ascend.");
            }
        }
        
        // Ascending from lake after water collection
        if (this.isAscendingFromLake) {
            if (this.position.y < this.savedAltitude) {
                this.position.y += this.verticalSpeed;
            } else {
                this.position.y = this.savedAltitude;
                this.isAscendingFromLake = false;
                this.isFlying = true;
                this.speed = 0; 
                console.log("Cruise altitude reached. Use W/S/A/D to fly.");
            }
        }
        
        // Legacy bucket filling mechanism
        if (this.isFillingBucket) {
            if (this.position.y > this.lakePosition.y) {
                this.position.y -= this.verticalSpeed;
            } else {
                setTimeout(() => {
                    this.bucketFilled = true;
                    this.isFillingBucket = false;
                    this.targetAltitude = this.savedAltitude;
                    this.isReturningToAltitude = true;
                }, 2000);
            }
        }
        
        if (this.isReturningToAltitude) {
            if (this.position.y < this.targetAltitude) {
                this.position.y += this.verticalSpeed;
            } else {
                this.position.y = this.targetAltitude;
                this.isReturningToAltitude = false;
                this.isFlying = true;
            }
        }
        
        // Water drop effect timer
        if (this.waterDropped) {
            this.waterDropTimer += 50; 
            if (this.waterDropTimer > 2000) { 
                this.waterDropped = false;
                this.waterDropTimer = 0;
            }
        }
    }
    
    // Movement controls
    accelerate(val) {
        this.speed += val * this.speedFactor;
        
        if (this.speed > this.maxSpeed) {
            this.speed = this.maxSpeed;
        } else if (this.speed < -this.maxSpeed / 2) {
            this.speed = -this.maxSpeed / 2; 
        }
    }
    
    turn(val) {
        this.rotation += val * this.speedFactor;
        this.rotation %= Math.PI * 2;
    }
    
    /**
     * Initiate takeoff sequence or ascend from lake
     */
    takeOff() {
        if (!this.ascendFromLake()) {
            if (!this.isFlying && !this.isTakingOff) {
                this.isTakingOff = true;
            } else if (this.isFillingBucket) {
                this.isFillingBucket = false;
                this.isTakingOff = true;
            }
        }
    }
    
    /**
     * Initiate landing sequence or water collection
     */
    land() {
        if (this.isFlying) {
            const dx = this.lakePosition.x - this.position.x;
            const dz = this.lakePosition.z - this.position.z;
            const distToLake = Math.sqrt(dx*dx + dz*dz);
            
            if (distToLake < 10 && !this.bucketFilled) {
                this.isFillingBucket = true;
                this.isFlying = false;
            } else {
                this.isLanding = true;
                this.isFlying = false;
            }
        }
    }
    
    /**
     * Check if helicopter is positioned over the lake
     */
    isOverLake() {
        const dx = this.position.x - this.lakePosition.x;
        const dz = this.position.z - this.position.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        return distance <= this.lakeRadius;
    }
    
    /**
     * Check if helicopter is positioned over the forest
     */
    isOverForest() {
        const dx = this.position.x - this.forestPosition.x;
        const dz = this.position.z - this.forestPosition.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        return distance <= this.forestRadius;
    }

    /**
     * Initiate water collection sequence at lake
     */
    descendToLake() {
        if (this.isFlying && this.isOverLake() && this.bucketAttached && !this.bucketFilled) {
            console.log("Descending to lake to fill bucket...");
            this.savedAltitude = this.position.y; 
            this.isDescendingToLake = true;
            this.isFlying = false;
            this.speed = 0; 
            return true;
        } else {
            if (!this.isOverLake()) {
                console.log("Not over the lake!");
            } else if (!this.bucketAttached) {
                console.log("Bucket not attached!");
            } else if (this.bucketFilled) {
                console.log("Bucket already full!");
            } else if (!this.isFlying) {
                console.log("Helicopter not flying!");
            }
            return false;
        }
    }
    
    /**
     * Ascend from lake after water collection
     */
    ascendFromLake() {
        if (this.isWaitingAtLake) {
            console.log("Ascending from lake with water...");
            this.isWaitingAtLake = false;
            this.isAscendingFromLake = true;
            return true;
        }
        return false;
    }
    
    /**
     * Check if helicopter is over any fire instances
     */
    isOverFire() {
        if (!this.scene.fireInstances || this.scene.fireInstances.length === 0) {
            return { isOver: false, fireIndex: -1 };
        }
        
        for (let i = 0; i < this.scene.fireInstances.length; i++) {
            const fireInst = this.scene.fireInstances[i];
            
            // Transform fire position to world coordinates
            const fireWorldX = (fireInst.tree.pos.x + fireInst.offsetX) * 5 + 130;
            const fireWorldZ = (fireInst.tree.pos.z + fireInst.offsetZ) * 5 + (-300);
            
            const dx = this.position.x - fireWorldX;
            const dz = this.position.z - fireWorldZ;
            const distance = Math.sqrt(dx*dx + dz*dz);
            
            console.log(`Fire ${i}: position (${fireWorldX.toFixed(1)}, ${fireWorldZ.toFixed(1)}), Heli: (${this.position.x.toFixed(1)}, ${this.position.z.toFixed(1)}), Distance: ${distance.toFixed(1)}`);
            
            if (distance < 20) { 
                return { isOver: true, fireIndex: i };
            }
        }
        
        return { isOver: false, fireIndex: -1 };
    }
    
    /**
     * Drop water to extinguish fires
     */
    dropWater() {
        console.log(`Attempting to drop water - Flying: ${this.isFlying}, Bucket full: ${this.bucketFilled}, Over forest: ${this.isOverForest()}`);
        
        if (this.isFlying && this.bucketFilled && this.isOverForest()) {
            console.log("Water dropped over forest!");
            this.bucketFilled = false;
            this.waterDropped = true;
            this.waterDropTimer = 0;
            
            // Extinguish all fires in the scene
            if (this.scene.fireInstances && this.scene.fireInstances.length > 0) {
                const extinguishedFires = this.scene.fireInstances.length;
                this.scene.fireInstances = []; 
                console.log(`${extinguishedFires} fires extinguished! Forest saved!`);
                return true;
            }
        } else {
            if (!this.bucketFilled) {
                console.log("Bucket is empty!");
            } else if (!this.isOverForest()) {
                console.log("Not over the forest!");
            } else if (!this.isFlying) {
                console.log("Helicopter not flying!");
            }
        }
        return false;
    }
    
    /**
     * Reset helicopter to initial state
     */
    reset() {
        this.position = { ...this.helipadPosition };
        this.rotation = 0;
        this.speed = 0;
        this.pitchAngle = 0;
        this.isFlying = false;
        this.isLanding = false;
        this.isTakingOff = false;
        this.isFillingBucket = false;
        this.bucketAttached = false;
        this.bucketFilled = false;
        this.savedAltitude = 0;
        this.isReturningToAltitude = false;
        this.isDescendingToLake = false;
        this.isWaitingAtLake = false;
        this.isAscendingFromLake = false;
    }
    
    setSpeedFactor(val) {
        this.speedFactor = val;
    }
    
    /**
     * Render helicopter main cabin with cockpit
     */
    drawCabin() {
        this.scene.pushMatrix();
            this.cabinMaterial.apply();
            
            // Main cabin body
            this.scene.pushMatrix();
                this.scene.scale(this.bodyLength/2, this.bodyHeight/2, this.bodyWidth/2);
                this.sphere.display();
            this.scene.popMatrix();
            
            // Cockpit glass
            this.scene.pushMatrix();
                this.scene.translate(this.bodyLength/2 * 0.7, this.bodyHeight/2 * 0.3, 0);
                this.scene.scale(this.bodyLength/4, this.bodyHeight/2.5, this.bodyWidth/2.5);
                this.scene.rotate(Math.PI/4, 0, 0, 1);
                this.glassMaterial.apply();
                this.sphere.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    /**
     * Render helicopter tail boom and vertical stabilizer
     */
    drawTail() {
        this.scene.pushMatrix();
            this.cabinMaterial.apply();
            
            // Tail boom
            this.scene.pushMatrix();
                this.scene.translate(-this.bodyLength/3, 0, 0);
                this.scene.rotate(Math.PI/2, 0, 1, 0); 
                this.scene.scale(this.bodyWidth/3, this.bodyHeight/3, this.tailLength);
                this.cylinder.display();
            this.scene.popMatrix();
            
            // Vertical stabilizer
            this.scene.pushMatrix();
                this.scene.translate(-this.bodyLength/2 - this.tailLength*0.8, this.bodyHeight/2, 0);
                this.scene.scale(this.tailLength/4, this.bodyHeight/1.5, 0.1);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    /**
     * Render animated main rotor with four blades
     */
    drawMainRotor() {
        const bladeLength = this.bodyLength * 0.8;
        const bladeWidth = 0.4;
        
        this.scene.pushMatrix();
            // Rotor mast
            this.scene.pushMatrix();
                this.scene.translate(0, this.bodyHeight/2 + 0.2, 0);
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.scale(0.2, 0.2, 0.4);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
            
            // Rotating rotor blades
            this.scene.gl.disable(this.scene.gl.CULL_FACE);
            this.scene.pushMatrix();
                this.scene.translate(0, this.bodyHeight/2 + 0.4, 0);
                this.scene.rotate(this.mainRotorAngle, 0, 1, 0); 
                
                for (let i = 0; i < 4; i++) {
                    this.scene.pushMatrix();
                        this.scene.rotate(i * Math.PI/2, 0, 1, 0);
                        this.scene.translate(bladeLength/2, 0, 0);
                        this.scene.scale(bladeLength, 0.1, bladeWidth); 
                        this.rotorMaterial.apply();
                        this.cylinder.display();
                    this.scene.popMatrix();
                }
            this.scene.popMatrix();
            this.scene.gl.enable(this.scene.gl.CULL_FACE);
        this.scene.popMatrix();
    }
    
    /**
     * Render animated tail rotor with three blades
     */
    drawTailRotor() {
        const bladeLength = this.bodyWidth;
        
        this.scene.pushMatrix();
            this.scene.translate(-this.bodyLength/2 - this.tailLength*0.9, 0, this.bodyWidth/2.5);
            
            // Tail rotor hub
            this.scene.pushMatrix();
                this.scene.rotate(Math.PI/2, 0, 0, 1); 
                this.scene.scale(0.1, 0.1, 0.2);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
            
            // Rotating tail rotor blades
            this.scene.gl.disable(this.scene.gl.CULL_FACE);
            this.scene.pushMatrix();
                this.scene.translate(0, 0, 0.15);
                this.scene.rotate(this.tailRotorAngle, 0, 0, 1); 
                
                for (let i = 0; i < 3; i++) {
                    this.scene.pushMatrix();
                        this.scene.rotate(i * Math.PI * 2/3, 0, 0, 1);
                        this.scene.translate(0, bladeLength/2, 0);
                        this.scene.scale(0.15, bladeLength, 0.05); 
                        this.rotorMaterial.apply();
                        this.cylinder.display();
                    this.scene.popMatrix();
                }
            this.scene.popMatrix();
            this.scene.gl.enable(this.scene.gl.CULL_FACE);
        this.scene.popMatrix();
    }
    
    /**
     * Render helicopter landing skids
     */
    drawLandingGear() {
        this.scene.pushMatrix();
            this.rotorMaterial.apply();
            
            // Create landing gear on both sides
            for (let side of [-1, 1]) {
                // Front strut
                this.scene.pushMatrix();
                    this.scene.translate(this.bodyLength/4, -this.bodyHeight/2, side * this.bodyWidth/2);
                    this.scene.rotate(Math.PI/2, 1, 0, 0);
                    this.scene.scale(0.15, 0.15, this.bodyHeight/2);
                    this.cylinder.display();
                this.scene.popMatrix();
                
                // Rear strut
                this.scene.pushMatrix();
                    this.scene.translate(-this.bodyLength/4, -this.bodyHeight/2, side * this.bodyWidth/2);
                    this.scene.rotate(Math.PI/2, 1, 0, 0);
                    this.scene.scale(0.15, 0.15, this.bodyHeight/2);
                    this.cylinder.display();
                this.scene.popMatrix();
                
                // Landing skid
                this.scene.pushMatrix();
                    this.scene.translate(0, -this.bodyHeight/1.5, side * this.bodyWidth/1.8);
                    this.scene.rotate(Math.PI/2, 0, 1, 0);
                    this.scene.scale(0.15, 0.15, this.bodyLength/1.5);
                    this.cylinder.display();
                this.scene.popMatrix();
            }
        this.scene.popMatrix();
    }
    
    /**
     * Render water bucket when attached (changes color based on fill state)
     */
    drawBucket() {
        if (!this.bucketAttached) return;
    
        this.scene.pushMatrix();
            // Bucket cable/rope
            this.scene.pushMatrix();
                this.scene.translate(0, -this.bodyHeight, 0);
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.scene.scale(0.1, 0.1, 2*this.bucketLength);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
    
            // Bucket container
            this.scene.pushMatrix();
                this.scene.translate(0, -this.bodyHeight - 3*this.bucketLength, 0);
                
                this.scene.gl.disable(this.scene.gl.CULL_FACE);
    
                this.scene.pushMatrix();
                    this.scene.scale(1, 2, 1); 
                    // Change bucket color based on water content
                    if (this.bucketFilled) {
                        this.bucketFilledMaterial.apply();
                    } else {
                        this.bucketEmptyMaterial.apply();
                    }
                    this.cylinder.display();
                this.scene.popMatrix();
    
                /*this.scene.pushMatrix();
                    this.scene.translate(0, 0, -0.8); 
                    this.scene.scale(0.5, 0.5, 1);
                    this.bucketMaterial.apply();
                    this.circle.display();
                this.scene.popMatrix();*/
                
                this.scene.gl.enable(this.scene.gl.CULL_FACE);
            this.scene.popMatrix();
        this.scene.popMatrix();
    }
    
    /**
     * Main display method - renders complete helicopter
     */
    display() {
        this.scene.pushMatrix();
            // Apply helicopter position and orientation
            this.scene.translate(this.position.x, this.position.y, this.position.z);
            this.scene.rotate(this.rotation, 0, 1, 0);
            this.scene.rotate(this.pitchAngle, 0, 0, 1);
            
            // Render all helicopter components
            this.drawCabin();
            this.drawTail();
            this.drawMainRotor();
            this.drawTailRotor();
            this.drawLandingGear();
            if (this.bucketAttached) {
                this.drawBucket();
            }
        this.scene.popMatrix();
    }
}