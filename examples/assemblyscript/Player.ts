import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

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
    public __FASS_SIZE: u32 = 50;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output) + <usize>1);
        store<u64>(changetype<usize>(output), input.id, 9);
        store<f32>(changetype<usize>(output), input.pos.x, 17);
        store<f32>(changetype<usize>(output), input.pos.y, 21);
        store<f32>(changetype<usize>(output), input.pos.z, 25);
        store<bool>(changetype<usize>(output), input.movement.moving, 29);
        store<f32>(changetype<usize>(output), input.movement.speed, 30);
        store<f32>(changetype<usize>(output), input.movement.direction.pitch, 34);
        store<f32>(changetype<usize>(output), input.movement.direction.yaw, 38);
        store<f32>(changetype<usize>(output), input.movement.direction.facing, 42);
        store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.data)), 46);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>1, 8);
        output.id = load<u64>(changetype<usize>(input), 9);
        output.pos.x = load<f32>(changetype<usize>(input), 17);
        output.pos.y = load<f32>(changetype<usize>(input), 21);
        output.pos.z = load<f32>(changetype<usize>(input), 25);
        output.movement.moving = load<bool>(changetype<usize>(input), 29);
        output.movement.speed = load<f32>(changetype<usize>(input), 30);
        output.movement.direction.pitch = load<f32>(changetype<usize>(input), 34);
        output.movement.direction.yaw = load<f32>(changetype<usize>(input), 38);
        output.movement.direction.facing = load<f32>(changetype<usize>(input), 42);
        store<u32>(changetype<usize>(output.data), load<u32>(changetype<usize>(input), 46));
    }
}