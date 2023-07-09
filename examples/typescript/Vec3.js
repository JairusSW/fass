"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quadrant = exports.Vec3 = void 0;
class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static __FASS_SERIALIZE(output, input) {
        output.setUint8(0, input.x);
        output.setUint8(1, input.y);
        output.setUint8(2, input.z);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.x = input.getUint8(0);
        output.y = input.getUint8(1);
        output.z = input.getUint8(2);
    }
}
exports.Vec3 = Vec3;
Vec3.__FASS_SIZE = 3;
var Quadrant;
(function (Quadrant) {
    Quadrant[Quadrant["TL"] = 1] = "TL";
    Quadrant[Quadrant["TR"] = 2] = "TR";
    Quadrant[Quadrant["BL"] = 3] = "BL";
    Quadrant[Quadrant["BR"] = 4] = "BR";
})(Quadrant = exports.Quadrant || (exports.Quadrant = {}));
