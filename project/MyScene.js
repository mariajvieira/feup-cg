import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./MySphere.js";

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

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    //Initialize scene objects
    this.axis = new CGFaxis(this, 20, 1);
    this.plane = new MyPlane(this, 64);
    this.sphere = new MySphere(this, 16, 8);

    // Plane appearance
    this.planeAppearance = new CGFappearance(this);
    this.planeAppearance.setAmbient(0.3, 0.3, 0.3, 1);
    this.planeAppearance.setDiffuse(0.7, 0.7, 0.7, 1);
    this.planeAppearance.setSpecular(0.0, 0.0, 0.0, 1);
    this.planeAppearance.setShininess(10);

    // Textures
    this.texture1 = new CGFtexture(this, 'images/grass.jpg');
    this.texture2 = new CGFtexture(this, 'images/earth.jpg');
 

    this.displayAxis = true;
    this.displayPlane = true;
    this.scaleFactor = 1;
    this.selectedTexture = 0;

    this.textures = [this.texture1, this.texture2];
    this.textureIds = { 'Grass': 0, 'Earth': 1}

    this.selectedObject = 0;
    this.objectIDs = { 'Plane': 0, 'Sphere': 1 };
 
 
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
      vec3.fromValues(200, 200, 200),
      vec3.fromValues(0, 0, 0)
    );
  }

  updateAppliedTexture() {
     this.setTexture(this.textures[this.selectedTexture]);
  }

  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }

  update(t) {
    this.checkKeys();
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

    // Desenhar eixo
    this.pushMatrix();
      if (this.displayAxis)
        this.axis.display();
    this.popMatrix();

    this.pushMatrix();
      if (this.selectedObject === 0) {
          // Desenhar o plano
          this.planeAppearance.setTexture(this.textures[this.selectedTexture]);
          this.planeAppearance.apply();

          // Transformação para posicionar o plano
          this.scale(400, 1, 400);
          this.rotate(-Math.PI / 2, 1, 0, 0);
          this.plane.display();
      }
      else if (this.selectedObject === 1) {
          // Desenhar a esfera
          // Se desejar, aplique uma aparência padrão ou uma específica para a esfera
          this.setDefaultAppearance();

          // A esfera sendo unitária, escalone (e posicione) para que fique visível
          this.scale(50, 50, 50);
          this.sphere.display();
      }
    this.popMatrix();

    this.setDefaultAppearance();
  }
}
