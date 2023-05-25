import { Vec3 } from "./Vec3";

import { Movement } from "./Movement";

export class Player {
    public active: bool;
    public name: string;
    public id: u64;
    public pos: Vec3;
    public movement: Movement;
    public data: StaticArray<u8>;
    constructor(active: bool, name: string, id: u64, pos: Vec3, movement: Movement, data: StaticArray<u8>) {
        this.active = active;
        this.name = name;
        this.id = id;
        this.pos = pos;
        this.movement = movement;
        this.data = data;
    }
    public __FASS_SIZE: u32 = 52;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        store<u16>(changetype<usize>(output), input.name.length, 1);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), input.name.length, changetype<usize>(output) + <usize>1);
        store<u64>(changetype<usize>(output), input.id, 3);
        store<u8>(changetype<usize>(output), input.pos.quad, 11);
        store<f32>(changetype<usize>(output), input.pos.x, 19);
        store<f32>(changetype<usize>(output), input.pos.y, 23);
        store<f32>(changetype<usize>(output), input.pos.z, 27);
        store<bool>(changetype<usize>(output), input.movement.moving, 31);
        store<f32>(changetype<usize>(output), input.movement.speed, 32);
        store<f32>(changetype<usize>(output), input.movement.direction.pitch, 36);
        store<f32>(changetype<usize>(output), input.movement.direction.yaw, 40);
        store<f32>(changetype<usize>(output), input.movement.direction.facing, 44);
        store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.data)), 48);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>1, load<u16>(changetype<usize>(input), 1));
        output.id = load<u64>(changetype<usize>(input), 3);
        output.pos.quad = load<u8>(changetype<usize>(input), 11);
        output.pos.x = load<f32>(changetype<usize>(input), 19);
        output.pos.y = load<f32>(changetype<usize>(input), 23);
        output.pos.z = load<f32>(changetype<usize>(input), 27);
        output.movement.moving = load<bool>(changetype<usize>(input), 31);
        output.movement.speed = load<f32>(changetype<usize>(input), 32);
        output.movement.direction.pitch = load<f32>(changetype<usize>(input), 36);
        output.movement.direction.yaw = load<f32>(changetype<usize>(input), 40);
        output.movement.direction.facing = load<f32>(changetype<usize>(input), 44);
        store<u32>(changetype<usize>(output.data), load<u32>(changetype<usize>(input), 48));
    }
}