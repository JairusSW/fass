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
        store(changetype(output), input.moving, 0);
        store(changetype(output), input.speed, 1);
        store(changetype(output), input.direction.pitch, 5);
        store(changetype(output), input.direction.yaw, 9);
        store(changetype(output), input.direction.facing, 13);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.moving = load(changetype(input), 0);
        output.speed = load(changetype(input), 1);
        output.direction.pitch = load(changetype(input), 5);
        output.direction.yaw = load(changetype(input), 9);
        output.direction.facing = load(changetype(input), 13);
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
        store(changetype(output), input.pitch, 0);
        store(changetype(output), input.yaw, 4);
        store(changetype(output), input.facing, 8);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.pitch = load(changetype(input), 0);
        output.yaw = load(changetype(input), 4);
        output.facing = load(changetype(input), 8);
    }
}
exports.Direction = Direction;
Direction.__FASS_SIZE = 12;
