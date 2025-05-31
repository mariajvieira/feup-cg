import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import {MyFire} from "./MyFire.js";
import { MyLake } from "./MyLake.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();

    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    // Objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64, 0, 100, 0, 100);
    this.sphere = new MySphere(this, 64, 32);
    
    const windowCoords    = [0, 0, 1, 1];
     const windowTexture   = 'images/window.jpg';
     const sideFloors      = 4;
     const windowsPerFloor = 2;
     const width           = 3;
     const depth           = 5.5;
     const color           = [1, 1, 1, 1];
     this.building = new MyBuilding(
         this,
         sideFloors,
         windowsPerFloor,
         windowCoords,
         windowTexture,
         width,
         depth,
         color
     );
    this.forest = new MyForest(this, 2, 2, 5, 5);     
    this.heli = new MyHeli(this, 0, 'x', 0.7, 10, [0.2, 0.8, 0.2]);
    this.lake = new MyLake(this, 20, 15, 32);    
    this.fire = new MyFire(this, 1, 1);

    this.fireInstances = [];
    for (const tree of this.forest.trees) {
      if (Math.random() < 0.7) {
        const offsetX = (Math.random() - 0.5) * 3;
        const offsetZ = (Math.random() - 0.5) * 3;
        const scale   = 1.0 + Math.random() * 1.0;
        this.fireInstances.push({ tree, offsetX, offsetZ, scale });
      }
    }


    this.planeAppearance = new CGFappearance(this);
    this.planeAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.planeAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.planeAppearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.planeAppearance.setShininess(10);
    
    // Textures
    this.texture1 = new CGFtexture(this, 'images/grass.jpg');
    this.texture2 = new CGFtexture(this, 'images/earth.jpg');
    this.panoramaTexture = new CGFtexture(this, "images/panoramic.png");
    this.panorama = new MyPanorama(this, this.panoramaTexture);
    
    this.planeAppearance.setTexture(this.texture1);
    this.planeAppearance.setTextureWrap('REPEAT', 'REPEAT');
    this.sphereAppearance = new CGFappearance(this);
    this.sphereAppearance.setAmbient(1.0, 1.0, 1.0, 1.0); 
    this.sphereAppearance.setDiffuse(0.7, 0.7, 0.7, 1.0);
    this.sphereAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.sphereAppearance.setShininess(10);

    this.buildingAppearance = new CGFappearance(this);
    this.buildingAppearance.setAmbient(1.0, 1.0, 1.0, 1.0);
    this.buildingAppearance.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.buildingAppearance.setSpecular(0.0, 0.0, 0.0, 1.0);
    this.buildingAppearance.setShininess(10);

    this.windowMaterial = new CGFappearance(this);
    this.windowMaterial.setAmbient(0.5, 0.5, 0.5, 1);
     this.windowMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
     this.windowMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.windowMaterial.loadTexture('images/window.jpg');
     this.windowMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.displayAxis = true;
    this.displayPlane = true;
    this.scaleFactor = 1;

    this.selectedObject = 0;
    this.objectIDs = { 'Panorama': 0, 'Sphere': 1 };

  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      1000,
      vec3.fromValues(200, 200, 60),
      vec3.fromValues(0, 0, 0)
    );
  }

  updateAppliedTexture() {
     this.setTexture(this.textures[this.selectedTexture]);
  }

  updateTexCoords() {
    this.quad.updateTexCoords(this.texCoords);
  }

  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;
 
    if (this.gui.isKeyPressed("KeyW")) {
       text += " W ";
       keysPressed = true;
       this.heli.accelerate(0.01); 
   }

   if (this.gui.isKeyPressed("KeyS")) {
       text += " S ";
       keysPressed = true;
       this.heli.accelerate(-0.01);
   }
  
   if (this.gui.isKeyPressed("KeyA")) {
       text += " A ";
       keysPressed = true;
       this.heli.turn(-0.05); 
   }
  
   if (this.gui.isKeyPressed("KeyD")) {
       text += " D ";
       keysPressed = true;
       this.heli.turn(0.05);
   }
   
    if (this.gui.isKeyPressed("KeyR")) {
        text += " R ";
        keysPressed = true;
        this.heli.reset();
    }
   
    if (this.gui.isKeyPressed("KeyP")) {
        text += " P ";
        keysPressed = true;
        this.heli.takeOff();  
    }
   
    if (this.gui.isKeyPressed("KeyL")) {
        text += " L ";
        keysPressed = true;
        if (!this.heli.descendToLake()) {
            if (this.heli.fillBucketAtLake()) {
                console.log("Enchendo o balde no lago...");
            } else {
                 this.heli.land();        
            }
        }
    }
    
    if (this.gui.isKeyPressed("KeyO")) {
        text += " O ";
        keysPressed = true;
        this.heli.dropWater();
    }
   
    if (keysPressed)
        console.log(text);
   }

   update(t) {
     this.checkKeys();

     this.heli.update(t);
     //this.fire.update(t);
   }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }
  display() {
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.updateProjectionMatrix();
    this.loadIdentity();
    this.applyViewMatrix();

    this.pushMatrix();
      if (this.displayAxis)
        this.axis.display();
    this.popMatrix();

    this.pushMatrix();

    //if (this.selectedObject == 0) {

        this.gl.disable(this.gl.DEPTH_TEST);
        this.gl.disable(this.gl.CULL_FACE);

        this.pushMatrix();
            this.loadIdentity();
            this.applyViewMatrix();
            this.panorama.display();
        this.popMatrix();

        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);

        this.pushMatrix();
          this.planeAppearance.setTexture(this.texture1);
          this.planeAppearance.apply();
          this.translate(0, -50, 0);
          this.scale(5000, 1, 5000);
          this.rotate(-Math.PI / 2, 1, 0, 0);
          this.plane.display();
        this.popMatrix();


        this.pushMatrix();
          this.buildingAppearance.apply();
          this.translate(0, -50, -300); 
          this.rotate(Math.PI, 0, 0, 0);
          this.scale(10, 10, 10);
          this.building.display();
        this.popMatrix();
 
        this.gl.disable(this.gl.CULL_FACE);

        this.pushMatrix();
          const roofY = -85 + this.building.floors * 20;
          this.translate(15, roofY, -270); 
          this.rotate(Math.PI, 0, 0.2, 0); 
          this.scale(2, 2, 2);
          this.heli.display();
        this.popMatrix();


        this.popMatrix();
        this.gl.enable(this.gl.CULL_FACE);


    this.pushMatrix();
        this.gl.disable(this.gl.CULL_FACE);

        this.translate(130, -50, -300);
        this.scale(5, 5, 5);
        this.forest.display();



       for (const inst of this.fireInstances) {
           this.pushMatrix();
               this.translate(
                   inst.tree.pos.x + inst.offsetX,
                   0,
                   inst.tree.pos.z + inst.offsetZ
               );
               this.scale(inst.scale, 1, inst.scale);
               this.fire.display();
           this.popMatrix();
       }
        this.gl.enable(this.gl.CULL_FACE);
    this.popMatrix();




        this.pushMatrix();
            this.translate(-50, -45, -100); 
            this.scale(3, 3, 3);
            this.gl.disable(this.gl.CULL_FACE);
            this.lake.display();

            this.gl.enable(this.gl.CULL_FACE);
        this.popMatrix();

        this.pushMatrix();

    // } else if (this.selectedObject == 1) {
    //     this.gl.disable(this.gl.CULL_FACE);

    //     this.sphereAppearance.setTexture(this.texture2);
    //     this.sphereAppearance.apply();

    //     this.scale(50, 50, 50);
    //     this.sphere.display();

    //     this.gl.enable(this.gl.CULL_FACE);
    // }
    




    this.popMatrix();

    this.setDefaultAppearance();
  }
}
