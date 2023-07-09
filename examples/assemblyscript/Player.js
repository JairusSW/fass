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
    static __FASS_SERIALIZE(output, input) {
        store(changetype(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype(input.name), 8, changetype(output) + 1);
        store(changetype(output), input.id, 9);
        store(changetype(output), input.pos.x, 17);
        store(changetype(output), input.pos.y, 18);
        store(changetype(output), input.pos.z, 19);
        store(changetype(output), input.movement.moving, 20);
        store(changetype(output), input.movement.speed, 21);
        store(changetype(output), input.movement.direction.pitch, 25);
        store(changetype(output), input.movement.direction.yaw, 29);
        store(changetype(output), input.movement.direction.facing, 33);
        store(changetype(output), load(changetype(input.data)), 37);
    }
    static __FASS_DESERIALIZE(input, output) {
        output.active = load(changetype(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype(input) + 1, 8);
        output.id = load(changetype(input), 9);
        output.pos.x = load(changetype(input), 17);
        output.pos.y = load(changetype(input), 18);
        output.pos.z = load(changetype(input), 19);
        output.movement.moving = load(changetype(input), 20);
        output.movement.speed = load(changetype(input), 21);
        output.movement.direction.pitch = load(changetype(input), 25);
        output.movement.direction.yaw = load(changetype(input), 29);
        output.movement.direction.facing = load(changetype(input), 33);
        store(changetype(output.data), load(changetype(input), 37));
    }
}
exports.Player = Player;
Player.__FASS_SIZE = 41;
