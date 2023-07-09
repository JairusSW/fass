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
        store(changetype(output), input.x, 0);
        store(changetype(output), input.y, 1);
        store(changetype(output), input.z, 2);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.x = load(changetype(input), 0);
        output.y = load(changetype(input), 1);
        output.z = load(changetype(input), 2);
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
