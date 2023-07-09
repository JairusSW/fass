"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Quadrant = exports.Vec3 = void 0;
class Vec3 {
    constructor(x, y, z) {
        this.__FASS_SIZE = 12;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    __FASS_SERIALIZE(output, input) {
        store(changetype(output), input.x, 0);
        store(changetype(output), load(changetype(input), 4), 4);
    }
    __FASS_DESERIALIZE(input, output) {
        output.x = load(changetype(input), 0);
        store(changetype(output), load(changetype(input), 4), 4);
        output.z = load(changetype(input), 8);
    }
}
__decorate([
    inline
], Vec3.prototype, "__FASS_SERIALIZE", null);
__decorate([
    inline
], Vec3.prototype, "__FASS_DESERIALIZE", null);
exports.Vec3 = Vec3;
var Quadrant;
(function (Quadrant) {
    Quadrant[Quadrant["TL"] = 1] = "TL";
    Quadrant[Quadrant["TR"] = 2] = "TR";
    Quadrant[Quadrant["BL"] = 3] = "BL";
    Quadrant[Quadrant["BR"] = 4] = "BR";
})(Quadrant = exports.Quadrant || (exports.Quadrant = {}));
