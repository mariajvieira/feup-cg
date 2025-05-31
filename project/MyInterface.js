import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        super.init(application);
        this.gui = new dat.GUI();

        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene, 'selectedObject', this.scene.objectIDs).name('Selected Object');
        
        this.gui.add(this.scene.heli, 'speedFactor', 0.1, 3.0).name('Speed Factor');
        
        this.initKeys();

        return true;
    }

    initKeys() {
        this.scene.gui = this;

        this.processKeyboard = function(){};

        this.activeKeys = {};
    }
    processKeyDown(event) {

        this.activeKeys[event.code] = true;
    }

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

}