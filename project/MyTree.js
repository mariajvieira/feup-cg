import { CGFappearance, CGFobject } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';
import { MyCylinder } from './MyCylinder.js';

export class MyTree extends CGFobject {

    constructor(scene, angle, axis, trunkRadius, height, crownColor) {
        super(scene);

        this.angle = angle * Math.PI / 180;
        this.trunkRadius = trunkRadius;
        this.height = height;

        this.trunkHeight = this.height * 0.2;
        this.crownHeight = this.height * 0.8;

        const step = 1.0;
        this.numPyramids = Math.max(2, Math.ceil(this.crownHeight / step));

        const overlap = 0.04*height;

        this.pyramidHeight = (this.crownHeight + (this.numPyramids - 1) * overlap) / this.numPyramids;
        this.shift = this.pyramidHeight - overlap;


        this.trunk = new MyCylinder(scene, 16);
        this.pyramid = new MyPyramid(scene, 6, 1);

        this.initMaterials(crownColor);
    }

    initMaterials(crownColor) {
        this.trunkMaterial = new CGFappearance(this.scene);
        this.trunkMaterial.setAmbient(0.4, 0.2, 0.0, 1.0);
        this.trunkMaterial.setDiffuse(0.6, 0.3, 0.1, 1.0);
        this.trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.trunkMaterial.setShininess(5);

        this.crownMaterial = new CGFappearance(this.scene);
        this.crownMaterial.setAmbient(crownColor[0] * 0.4, crownColor[1] * 0.4, crownColor[2] * 0.4, 1.0);
        this.crownMaterial.setDiffuse(crownColor[0], crownColor[1], crownColor[2], 1.0);
        this.crownMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.crownMaterial.setShininess(10);
    }

    display() {
        this.scene.pushMatrix();

        if (this.axis === 'x') {
            this.scene.rotate(this.angle, 1, 0, 0);
        } else if (this.axis === 'z') {
            this.scene.rotate(this.angle, 0, 0, 1);
        }

        this.scene.pushMatrix();
        this.trunkMaterial.apply();
        this.scene.translate(0, this.trunkHeight / 2, 0);
        this.scene.scale(this.trunkRadius, this.trunkHeight, this.trunkRadius);
        this.trunk.display();

        this.scene.popMatrix();

        this.crownMaterial.apply();

        let currentHeight = this.trunkHeight;

        for (let i = 0; i < this.numPyramids; i++) {
            this.scene.pushMatrix();

            this.scene.translate(0, currentHeight, 0);

            const baseScale = 1.5;
            const stepScale = 0.4;
            const pyramidRadius = this.trunkRadius * (baseScale + (this.numPyramids - i - 1) * stepScale);

            this.scene.scale(pyramidRadius, this.pyramidHeight, pyramidRadius);

            this.pyramid.display();

            this.scene.popMatrix();

            currentHeight += this.shift;
        }

        this.scene.popMatrix();
    }
}