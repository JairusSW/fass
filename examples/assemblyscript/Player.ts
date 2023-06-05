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
    public __FASS_SIZE: u32 = 58;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output) + <usize>1);
        store<u64>(changetype<usize>(output), input.id, 9);
        store<u8>(changetype<usize>(output), input.pos.quad, 17);
        store<f32>(changetype<usize>(output), input.pos.x, 25);
        store<f32>(changetype<usize>(output), input.pos.y, 29);
        store<f32>(changetype<usize>(output), input.pos.z, 33);
        store<bool>(changetype<usize>(output), input.movement.moving, 37);
        store<f32>(changetype<usize>(output), input.movement.speed, 38);
        store<f32>(changetype<usize>(output), input.movement.direction.pitch, 42);
        store<f32>(changetype<usize>(output), input.movement.direction.yaw, 46);
        store<f32>(changetype<usize>(output), input.movement.direction.facing, 50);
        store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.data)), 54);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>1, 8);
        output.id = load<u64>(changetype<usize>(input), 9);
        output.pos.quad = load<u8>(changetype<usize>(input), 17);
        output.pos.x = load<f32>(changetype<usize>(input), 25);
        output.pos.y = load<f32>(changetype<usize>(input), 29);
        output.pos.z = load<f32>(changetype<usize>(input), 33);
        output.movement.moving = load<bool>(changetype<usize>(input), 37);
        output.movement.speed = load<f32>(changetype<usize>(input), 38);
        output.movement.direction.pitch = load<f32>(changetype<usize>(input), 42);
        output.movement.direction.yaw = load<f32>(changetype<usize>(input), 46);
        output.movement.direction.facing = load<f32>(changetype<usize>(input), 50);
        store<u32>(changetype<usize>(output.data), load<u32>(changetype<usize>(input), 54));
    }
}