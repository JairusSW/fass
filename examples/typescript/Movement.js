"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Movement = void 0;
class Movement {
    constructor(moving, speed, direction) {
        this.moving = moving;
        this.speed = speed;
        this.direction = direction;
    }
    static __FASS_SERIALIZE(output, input) {
        output.setUint8(0, Number(input.moving));
        output.setFloat32(1, input.speed, true);
        output.setFloat32(5, input.direction.pitch, true);
        output.setFloat32(9, input.direction.yaw, true);
        output.setFloat32(13, input.direction.facing, true);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.moving = Boolean(input.getUint8(0));
        output.speed = input.getFloat32(1, true);
        output.direction.pitch = input.getFloat32(5, true);
        output.direction.yaw = input.getFloat32(9, true);
        output.direction.facing = input.getFloat32(13, true);
    }
}
exports.Movement = Movement;
Movement.__FASS_SIZE = 17;
class Direction {
    constructor(pitch, yaw, facing) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.facing = facing;
    }
    static __FASS_SERIALIZE(output, input) {
        output.setFloat32(0, input.pitch, true);
        output.setFloat32(4, input.yaw, true);
        output.setFloat32(8, input.facing, true);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.pitch = input.getFloat32(0, true);
        output.yaw = input.getFloat32(4, true);
        output.facing = input.getFloat32(8, true);
    }
}
exports.Direction = Direction;
Direction.__FASS_SIZE = 12;
