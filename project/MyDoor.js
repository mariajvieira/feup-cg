import { CGFobject, CGFappearance } from '../lib/CGF.js';

export class MyDoor extends CGFobject {
  /**
   * @param scene
   * @param width  largura da porta
   * @param height altura da porta
   * @param texture caminho da textura
   */
  constructor(scene, width, height, texture) {
    super(scene);
    this.width   = width;
    this.height  = height;
    this.texture = 'images/door.png';
    this.appearance = new CGFappearance(scene);
    this.appearance.setAmbient(1, 1, 1, 1);
    this.appearance.setDiffuse(1, 1, 1, 1);
    this.appearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.appearance.setShininess(10);
    this.appearance.loadTexture(this.texture);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      0,          0,         0,  // bottom left
      this.width, 0,         0,  // bottom right
      0,          this.height,0, // top left
      this.width, this.height,0  // top right
    ];

    this.indices = [
      0, 1, 2,
      1, 3, 2
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.texCoords = [
      0, 1,
      1, 1,
      0, 0,
      1, 0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  display() {
    this.appearance.apply();
    super.display();
  }
}