"use strict";
class Transform_Orient2 {
    constructor(orientation) {
        this.orientation = orientation;
        this._components =
            [
                Coords.create(), Coords.create(), Coords.create()
            ];
    }
    overwriteWith(other) {
        return this; // todo
    }
    transform(transformable) {
        return transformable.transform(this);
    }
    transformCoords(coordsToTransform) {
        var components = this._components;
        var ori = this.orientation;
        coordsToTransform.overwriteWith(components[0].overwriteWith(ori.forward).multiplyScalar(0 - coordsToTransform.x).add(components[1].overwriteWith(ori.right).multiplyScalar(0 - coordsToTransform.y).add(components[2].overwriteWith(ori.down).multiplyScalar(coordsToTransform.z))));
        return coordsToTransform;
    }
}
