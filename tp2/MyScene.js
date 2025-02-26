import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall } from "./MyTriangleSmall.js";
import { MyTriangleBig } from "./MyTriangleBig.js";
import { MyTangram } from "./MyTangram.js";

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
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    //Initialize scene objects
    this.axis = new CGFaxis(this);

    this.orangeTriangle = new MyTriangleBig(this);
    this.blueTriangle = new MyTriangleBig(this);
    this.pinkTriangle = new MyTriangle(this);
    this.redTriangle = new MyTriangleSmall(this);
    this.yellowParallelogram = new MyParallelogram(this);

    this.diamond = new MyDiamond(this);
    this.tangram = new MyTangram(this);


    //Objects connected to MyInterface
    this.displayAxis = true;
    this.scaleFactor = 1;
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
    ];

    this.multMatrix(sca);

    // orange triangle
    this.pushMatrix();
    this.translate(-1.4,1.4,0);
    this.rotate(-3*Math.PI/4, 0,0,1);
    this.orangeTriangle.display();
    this.popMatrix();

    // blue triangle
    this.pushMatrix();
    this.translate(1.4,-0.5,0);
    this.rotate(Math.PI/4, 0,0,1);
    this.blueTriangle.display();
    this.popMatrix();

    // pink triangle
    this.pushMatrix();
    this.translate(2.2,0.3,0);
    this.rotate(Math.PI/2, 0,0,1);
    this.pinkTriangle.display();
    this.popMatrix();

    // red triangle
    this.pushMatrix();
    this.translate(3.5,1.6,0);
    this.rotate(Math.PI/4, 0,0,1);
    this.redTriangle.display();
    this.popMatrix();

    // yellow parallelogram
    this.pushMatrix();
    this.translate(0.98,-0.92,0);
    this.rotate(Math.PI/2, 0,0,1);
    this.scale(-1,1,1);
    this.yellowParallelogram.display();
    this.popMatrix();




    // ---- BEGIN Primitive drawing section

    //this.diamond.display();
    //this.triangle.display();
    //this.parallelogram.display();
    //this.triangleSmall.display();
    
    //this.tangram.display();

    // ---- END Primitive drawing section
  }
}
