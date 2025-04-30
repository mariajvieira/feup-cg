import { CGFappearance, CGFobject } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyCylinder } from './MyCylinder.js';

export class MyTree extends CGFobject {

    constructor(scene, angle, axis, trunkRadius, height, crownColor) {
        super(scene);

        this.angle = angle * Math.PI / 180;
        this.axis = axis.toLowerCase();
        this.trunkRadius = trunkRadius;
        this.height = height;

        this.trunkHeight = this.height * 0.2;
        this.crownHeight = this.height * 0.8;

        this.numPyramids = Math.max(2, Math.floor(this.crownHeight / 2));

        this.pyramidHeight = this.crownHeight / this.numPyramids;

        this.trunk = new MyCylinder(scene, 16);
        this.pyramid = new MyCone(scene, 4, 1);

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

            const baseScale = 2.0;
            const stepScale = 0.25;
            const pyramidRadius = this.trunkRadius * (baseScale + (this.numPyramids - i - 1) * stepScale);

            this.scene.scale(pyramidRadius, this.pyramidHeight * 0.6, pyramidRadius);

            this.pyramid.display();

            this.scene.popMatrix();

            currentHeight += this.pyramidHeight * 0.25;
        }

        this.scene.popMatrix();
    }
}