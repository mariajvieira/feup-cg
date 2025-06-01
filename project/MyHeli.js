import { CGFappearance, CGFobject, CGFtexture } from '../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MySphere } from './MySphere.js';
import { MyCircle } from './MyCircle.js';


export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);
        this.position = { x: 0, y: 0, z: 0 };  
        this.rotation = 0;                    
        this.speed = 0;                        
        this.mainRotorAngle = 0;              
        this.tailRotorAngle = 0;               
        this.bucketAttached = false;          
        this.bucketLength = 1;              
        this.pitchAngle = 0;                   
        
        this.bodyLength = 6;
        this.bodyWidth = 2;
        this.bodyHeight = 1.8;
        this.tailLength = 4;
        
        this.isFlying = false;                 
        this.isLanding = false;                
        this.isTakingOff = false;              
        this.isFillingBucket = false;          
        this.cruiseAltitude = 15;              
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
        
        this.isDescendingToLake = false;
        this.isWaitingAtLake = false;
        this.isAscendingFromLake = false;
    
        this.verticalSpeed = 0.2;
        this.maxSpeed = 0.5;                   
        this.speedFactor = 1.0;                
        
        this.waterDropped = false;
        this.waterDropTimer = 0;
        
        this.waterParticles = [];
        this.maxParticles = 50;
        this.particleLifetime = 3000; 
        this.isDropping = false;
        this.fireExtinguished = false; 
        this.fireExtinguishDelay = 3000; 

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
        this.cabinMaterial.setAmbient(0.6, 0.1, 0.1, 1.0); 
        this.cabinMaterial.setDiffuse(0.9, 0.2, 0.2, 1.0); 
        this.cabinMaterial.setSpecular(0.3, 0.3, 0.3, 1.0); 
        this.cabinMaterial.setShininess(10);
        
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
        
        this.bucketEmptyMaterial = new CGFappearance(this.scene);
        this.bucketEmptyMaterial.setAmbient(0.8, 0.1, 0.1, 1.0);
        this.bucketEmptyMaterial.setDiffuse(0.9, 0.2, 0.2, 1.0); 
        this.bucketEmptyMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.bucketEmptyMaterial.setShininess(10);
        
        this.bucketFilledMaterial = new CGFappearance(this.scene);
        this.bucketFilledMaterial.setAmbient(0.1, 0.4, 0.8, 1.0);
        this.bucketFilledMaterial.setDiffuse(0.2, 0.6, 0.9, 1.0); 
        this.bucketFilledMaterial.setSpecular(0.3, 0.3, 0.3, 1.0);
        this.bucketFilledMaterial.setShininess(10);
        
        this.waterParticleMaterial = new CGFappearance(this.scene);
        this.waterParticleMaterial.setAmbient(0.1, 0.4, 0.8, 0.8);
        this.waterParticleMaterial.setDiffuse(0.2, 0.6, 0.9, 0.8);
        this.waterParticleMaterial.setSpecular(0.3, 0.7, 1.0, 0.8);
        this.waterParticleMaterial.setShininess(100);
    }

    createWaterParticle() {
        const particle = {
            x: this.position.x + (Math.random() - 0.5) * 3,
            y: this.position.y - 2,
            z: this.position.z + (Math.random() - 0.5) * 3,
            vx: (Math.random() - 0.5) * 0.5,
            vy: -0.3 - Math.random() * 0.2,
            vz: (Math.random() - 0.5) * 0.5,
            life: this.particleLifetime,
            maxLife: this.particleLifetime,
            size: 0.2 + Math.random() * 0.3
        };
        return particle;
    }
    
    updateWaterParticles(deltaTime) {
        for (let i = this.waterParticles.length - 1; i >= 0; i--) {
            const particle = this.waterParticles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.z += particle.vz;
            
            particle.vy -= 0.01;
            
            particle.life -= deltaTime;
            
            if (particle.life <= 0 || particle.y <= -45) {
                this.waterParticles.splice(i, 1);
            }
        }
        
        if (this.isDropping && this.waterParticles.length < this.maxParticles) {
            for (let i = 0; i < 3; i++) {
                this.waterParticles.push(this.createWaterParticle());
            }
        }
    }

    update(t) {
        const baseMainRotorSpeed = 2.0;
        const baseTailRotorSpeed = 3.0;
        
        if (this.isFlying || this.isTakingOff || this.isDescendingToLake || this.isAscendingFromLake) {
            this.mainRotorAngle += (baseMainRotorSpeed + Math.abs(this.speed)) * 0.1;
            this.tailRotorAngle += (baseTailRotorSpeed + Math.abs(this.speed)) * 0.2;
        } else {
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
        
        if (this.isFlying) {
            const dirX = Math.cos(this.rotation);
            const dirZ = -Math.sin(this.rotation);
            
            this.position.x += dirX * this.speed * this.speedFactor;
            this.position.z += dirZ * this.speed * this.speedFactor;
            this.pitchAngle = this.speed * -0.5; 
        }
        
        if (this.isTakingOff) {
            if (this.position.y < this.cruiseAltitude) {
                this.position.y += this.verticalSpeed;
                
                if (this.position.y > this.helipadPosition.y + this.cruiseAltitude/2) {
                    this.bucketAttached = true;
                }
            } else {
                this.position.y = this.cruiseAltitude;
                this.isTakingOff = false;
                this.isFlying = true;
            }
        }
        
        if (this.isLanding) {
            const dx = this.helipadPosition.x - this.position.x;
            const dz = this.helipadPosition.z - this.position.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist > 0.5) {
                this.rotation = Math.atan2(dx, -dz);
                
                this.position.x += dx * 0.05;
                this.position.z += dz * 0.05;
            } else {
                if (this.position.y > this.helipadPosition.y + 0.1) {
                    this.position.y -= this.verticalSpeed;
                    
                    if (this.position.y < this.helipadPosition.y + 2) {
                        this.bucketAttached = false;
                    }
                } else {
                    this.position.y = this.helipadPosition.y;
                    this.isLanding = false;
                    this.isFlying = false;
                    this.speed = 0;
                    this.pitchAngle = 0;
                    this.bucketFilled = false;
                }
            }
        }
        
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
                console.log("Balde enchido! Pressione P para subir.");
            }
        }
        
        if (this.isAscendingFromLake) {
            if (this.position.y < this.savedAltitude) {
                this.position.y += this.verticalSpeed;
            } else {
                this.position.y = this.savedAltitude;
                this.isAscendingFromLake = false;
                this.isFlying = true;
                this.speed = 0; 
                console.log("Altitude de cruzeiro atingida. Use W/S/A/D para voar.");
            }
        }
        
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
        
        if (this.waterDropped) {
            this.waterDropTimer += 50; 
            if (this.waterDropTimer > 2000) { 
                this.waterDropped = false;
                this.waterDropTimer = 0;
                this.isDropping = false; 
            }
        }
        
        this.updateWaterParticles(50);
    }
    
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
    
    isOverLake() {
        const dx = this.position.x - this.lakePosition.x;
        const dz = this.position.z - this.position.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        return distance <= this.lakeRadius;
    }
    
    isOverForest() {
        const dx = this.position.x - this.forestPosition.x;
        const dz = this.position.z - this.forestPosition.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        return distance <= this.forestRadius;
    }

    
    descendToLake() {
        if (this.isFlying && this.isOverLake() && this.bucketAttached && !this.bucketFilled) {
            console.log("Descendo ao lago para encher o balde...");
            this.savedAltitude = this.position.y; 
            this.isDescendingToLake = true;
            this.isFlying = false;
            this.speed = 0; 
            return true;
        } else {
            if (!this.isOverLake()) {
                console.log("Não está sobre o lago!");
            } else if (!this.bucketAttached) {
                console.log("Balde não está anexado!");
            } else if (this.bucketFilled) {
                console.log("Balde já está cheio!");
            } else if (!this.isFlying) {
                console.log("Helicóptero não está voando!");
            }
            return false;
        }
    }
    
    ascendFromLake() {
        if (this.isWaitingAtLake) {
            console.log("Subindo do lago com água...");
            this.isWaitingAtLake = false;
            this.isAscendingFromLake = true;
            return true;
        }
        return false;
    }
    
    isOverFire() {
        if (!this.scene.fireInstances || this.scene.fireInstances.length === 0) {
            return { isOver: false, fireIndex: -1 };
        }
        
        for (let i = 0; i < this.scene.fireInstances.length; i++) {
            const fireInst = this.scene.fireInstances[i];
            
            const fireWorldX = (fireInst.tree.pos.x + fireInst.offsetX) * 5 + 130;
            const fireWorldZ = (fireInst.tree.pos.z + fireInst.offsetZ) * 5 + (-300);
            
            const dx = this.position.x - fireWorldX;
            const dz = this.position.z - fireWorldZ;
            const distance = Math.sqrt(dx*dx + dz*dz);
            
            console.log(`Fogo ${i}: posição (${fireWorldX.toFixed(1)}, ${fireWorldZ.toFixed(1)}), Heli: (${this.position.x.toFixed(1)}, ${this.position.z.toFixed(1)}), Distância: ${distance.toFixed(1)}`);
            
            if (distance < 20) { 
                return { isOver: true, fireIndex: i };
            }
        }
        
        return { isOver: false, fireIndex: -1 };
    }
    
    dropWater() {
        console.log(`Tentando despejar água - Voando: ${this.isFlying}, Balde cheio: ${this.bucketFilled}, Sobre floresta: ${this.isOverForest()}`);
        
        if (this.isFlying && this.bucketFilled && this.isOverForest()) {
            console.log("Água despejada sobre a floresta!");
            this.bucketFilled = false;
            this.waterDropped = true;
            this.waterDropTimer = 0;
            this.isDropping = true; 
            this.fireExtinguished = false;
            
            return true;
        } else {
            if (!this.bucketFilled) {
                console.log("Balde está vazio!");
            } else if (!this.isOverForest()) {
                console.log("Não está sobre a floresta!");
            } else if (!this.isFlying) {
                console.log("Helicóptero não está voando!");
            }
        }
        return false;
    }

    drawWaterParticles() {
        if (this.waterParticles.length === 0) return;
        
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        
        for (const particle of this.waterParticles) {
            this.scene.pushMatrix();
                this.scene.translate(particle.x, particle.y, particle.z);
                
                this.waterParticleMaterial.apply();
                
                this.scene.scale(particle.size, particle.size, particle.size);
                this.sphere.display();
            this.scene.popMatrix();
        }
        
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }

    update(t) {
        const baseMainRotorSpeed = 2.0;
        const baseTailRotorSpeed = 3.0;
        
        if (this.isFlying || this.isTakingOff || this.isDescendingToLake || this.isAscendingFromLake) {
            this.mainRotorAngle += (baseMainRotorSpeed + Math.abs(this.speed)) * 0.1;
            this.tailRotorAngle += (baseTailRotorSpeed + Math.abs(this.speed)) * 0.2;
        } else {
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
        
        if (this.isFlying) {
            const dirX = Math.cos(this.rotation);
            const dirZ = -Math.sin(this.rotation);
            
            this.position.x += dirX * this.speed * this.speedFactor;
            this.position.z += dirZ * this.speed * this.speedFactor;
            this.pitchAngle = this.speed * -0.5; 
        }
        
        if (this.isTakingOff) {
            if (this.position.y < this.cruiseAltitude) {
                this.position.y += this.verticalSpeed;
                
                if (this.position.y > this.helipadPosition.y + this.cruiseAltitude/2) {
                    this.bucketAttached = true;
                }
            } else {
                this.position.y = this.cruiseAltitude;
                this.isTakingOff = false;
                this.isFlying = true;
            }
        }
        
        if (this.isLanding) {
            const dx = this.helipadPosition.x - this.position.x;
            const dz = this.helipadPosition.z - this.position.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist > 0.5) {
                this.rotation = Math.atan2(dx, -dz);
                
                this.position.x += dx * 0.05;
                this.position.z += dz * 0.05;
            } else {
                if (this.position.y > this.helipadPosition.y + 0.1) {
                    this.position.y -= this.verticalSpeed;
                    
                    if (this.position.y < this.helipadPosition.y + 2) {
                        this.bucketAttached = false;
                    }
                } else {
                    this.position.y = this.helipadPosition.y;
                    this.isLanding = false;
                    this.isFlying = false;
                    this.speed = 0;
                    this.pitchAngle = 0;
                    this.bucketFilled = false;
                }
            }
        }
        
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
                console.log("Balde enchido! Pressione P para subir.");
            }
        }
        
        if (this.isAscendingFromLake) {
            if (this.position.y < this.savedAltitude) {
                this.position.y += this.verticalSpeed;
            } else {
                this.position.y = this.savedAltitude;
                this.isAscendingFromLake = false;
                this.isFlying = true;
                this.speed = 0; 
                console.log("Altitude de cruzeiro atingida. Use W/S/A/D para voar.");
            }
        }
        
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
        
        if (this.waterDropped) {
            this.waterDropTimer += 50; 
            
            if (this.waterDropTimer > this.fireExtinguishDelay && !this.fireExtinguished) {
                if (this.scene.fireInstances && this.scene.fireInstances.length > 0) {
                    const extinguishedFires = this.scene.fireInstances.length;
                    this.scene.fireInstances = []; 
                    console.log(`${extinguishedFires} fogos extintos! Floresta salva!`);
                    this.fireExtinguished = true;
                }
            }
            
            if (this.waterDropTimer > 3000) { 
                this.waterDropped = false;
                this.waterDropTimer = 0;
                this.isDropping = false; 
                this.fireExtinguished = false; 
            }
        }
        
        this.updateWaterParticles(50);
    }
    
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
    
    isOverLake() {
        const dx = this.position.x - this.lakePosition.x;
        const dz = this.position.z - this.position.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        return distance <= this.lakeRadius;
    }
    
    isOverForest() {
        const dx = this.position.x - this.forestPosition.x;
        const dz = this.position.z - this.forestPosition.z;
        const distance = Math.sqrt(dx*dx + dz*dz);
        return distance <= this.forestRadius;
    }

    
    descendToLake() {
        if (this.isFlying && this.isOverLake() && this.bucketAttached && !this.bucketFilled) {
            console.log("Descendo ao lago para encher o balde...");
            this.savedAltitude = this.position.y; 
            this.isDescendingToLake = true;
            this.isFlying = false;
            this.speed = 0; 
            return true;
        } else {
            if (!this.isOverLake()) {
                console.log("Não está sobre o lago!");
            } else if (!this.bucketAttached) {
                console.log("Balde não está anexado!");
            } else if (this.bucketFilled) {
                console.log("Balde já está cheio!");
            } else if (!this.isFlying) {
                console.log("Helicóptero não está voando!");
            }
            return false;
        }
    }
    
    ascendFromLake() {
        if (this.isWaitingAtLake) {
            console.log("Subindo do lago com água...");
            this.isWaitingAtLake = false;
            this.isAscendingFromLake = true;
            return true;
        }
        return false;
    }
    
    isOverFire() {
        if (!this.scene.fireInstances || this.scene.fireInstances.length === 0) {
            return { isOver: false, fireIndex: -1 };
        }
        
        for (let i = 0; i < this.scene.fireInstances.length; i++) {
            const fireInst = this.scene.fireInstances[i];
            
            const fireWorldX = (fireInst.tree.pos.x + fireInst.offsetX) * 5 + 130;
            const fireWorldZ = (fireInst.tree.pos.z + fireInst.offsetZ) * 5 + (-300);
            
            const dx = this.position.x - fireWorldX;
            const dz = this.position.z - fireWorldZ;
            const distance = Math.sqrt(dx*dx + dz*dz);
            
            console.log(`Fogo ${i}: posição (${fireWorldX.toFixed(1)}, ${fireWorldZ.toFixed(1)}), Heli: (${this.position.x.toFixed(1)}, ${this.position.z.toFixed(1)}), Distância: ${distance.toFixed(1)}`);
            
            if (distance < 20) { 
                return { isOver: true, fireIndex: i };
            }
        }
        
        return { isOver: false, fireIndex: -1 };
    }
    
    dropWater() {
        console.log(`Tentando despejar água - Voando: ${this.isFlying}, Balde cheio: ${this.bucketFilled}, Sobre floresta: ${this.isOverForest()}`);
        
        if (this.isFlying && this.bucketFilled && this.isOverForest()) {
            console.log("Água despejada sobre a floresta!");
            this.bucketFilled = false;
            this.waterDropped = true;
            this.waterDropTimer = 0;
            this.isDropping = true; 
            
        } else {
            if (!this.bucketFilled) {
                console.log("Balde está vazio!");
            } else if (!this.isOverForest()) {
                console.log("Não está sobre a floresta!");
            } else if (!this.isFlying) {
                console.log("Helicóptero não está voando!");
            }
        }
        return false;
    }

    drawWaterParticles() {
        if (this.waterParticles.length === 0) return;
        
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        this.scene.gl.disable(this.scene.gl.CULL_FACE);
        
        for (const particle of this.waterParticles) {
            this.scene.pushMatrix();
                this.scene.translate(particle.x, particle.y, particle.z);
                
                this.waterParticleMaterial.apply();
                
                this.scene.scale(particle.size, particle.size, particle.size);
                this.sphere.display();
            this.scene.popMatrix();
        }
        
        this.scene.gl.enable(this.scene.gl.CULL_FACE);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
    
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
                this.scene.rotate(Math.PI/4, 0, 0, 1);
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
                this.scene.rotate(Math.PI/2, 0, 1, 0); 
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
                this.scene.rotate(Math.PI/2, 1, 0, 0);
                this.scene.scale(0.2, 0.2, 0.4);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
            
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
                this.scene.translate(0, -this.bodyHeight, 0);
                this.scene.rotate(Math.PI / 2, 1, 0, 0);
                this.scene.scale(0.1, 0.1, 2*this.bucketLength);
                this.rotorMaterial.apply();
                this.cylinder.display();
            this.scene.popMatrix();
    
            this.scene.pushMatrix();
                this.scene.translate(0, -this.bodyHeight - 3*this.bucketLength, 0);
                
                this.scene.gl.disable(this.scene.gl.CULL_FACE);
    
                this.scene.pushMatrix();
                    this.scene.scale(1, 2, 1); 
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
    
    
    display() {
        this.scene.pushMatrix();
            this.scene.translate(this.position.x, this.position.y, this.position.z);
            this.scene.rotate(this.rotation, 0, 1, 0);
            this.scene.rotate(this.pitchAngle, 0, 0, 1);
            
            this.drawCabin();
            this.drawTail();
            this.drawMainRotor();
            this.drawTailRotor();
            this.drawLandingGear();
            if (this.bucketAttached) {
                this.drawBucket();
            }
        this.scene.popMatrix();
        
        this.drawWaterParticles();
    }
}