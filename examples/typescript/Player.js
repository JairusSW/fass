"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(active, name, id, pos, movement, data) {
        this.active = active;
        this.name = name;
        this.id = id;
        this.pos = pos;
        this.movement = movement;
        this.data = data;
    }
    static __FASS_SERIALIZE(output, put) {
        output.setUint8(0, Number(input.active));
        String.UTF8.encodeUnsafe(changetype(input.name), 8, changetype(output) + 1);
        output.setBigUint64(9, input.id, true);
        output.setUint8(17, input.pos.x);
        output.setUint8(18, input.pos.y);
        output.setUint8(19, input.pos.z);
        output.setUint8(20, Number(input.movement.moving));
        output.setFloat32(21, input.movement.speed, true);
        output.setFloat32(25, input.movement.direction.pitch, true);
        output.setFloat32(29, input.movement.direction.yaw, true);
        output.setFloat32(33, input.movement.direction.facing, true);
        store(changetype(output), load(changetype(input.data)), 37);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.active = Boolean(input.getUint8(0));
        output.name = String.UTF8.decodeUnsafe(changetype(input) + 1, 8);
        output.id = input.getBigUint64(9, true);
        output.pos.x = input.getUint8(17);
        output.pos.y = input.getUint8(18);
        output.pos.z = input.getUint8(19);
        output.movement.moving = Boolean(input.getUint8(20));
        output.movement.speed = input.getFloat32(21, true);
        output.movement.direction.pitch = input.getFloat32(25, true);
        output.movement.direction.yaw = input.getFloat32(29, true);
        output.movement.direction.facing = input.getFloat32(33, true);
        store(changetype(output.data), load(changetype(input), 37));
    }
}
exports.Player = Player;
Player.__FASS_SIZE = 41;
