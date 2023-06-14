import { Vec3 } from "./Vec3";
import { Movement } from "./Movement";
// @ts-ignore
@serializable
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
    public __FASS_SIZE: u32 = 42;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output) + <usize>1);
        store<u64>(changetype<usize>(output), input.id, 9);
        store<u8>(changetype<usize>(output), input.pos.quad, 17);
        store<u8>(changetype<usize>(output), input.pos.x, 18);
        store<u8>(changetype<usize>(output), input.pos.y, 19);
        store<u8>(changetype<usize>(output), input.pos.z, 20);
        store<bool>(changetype<usize>(output), input.movement.moving, 21);
        store<f32>(changetype<usize>(output), input.movement.speed, 22);
        store<f32>(changetype<usize>(output), input.movement.direction.pitch, 26);
        store<f32>(changetype<usize>(output), input.movement.direction.yaw, 30);
        store<f32>(changetype<usize>(output), input.movement.direction.facing, 34);
        store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.data)), 38);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>1, 8);
        output.id = load<u64>(changetype<usize>(input), 9);
        output.pos.quad = load<u8>(changetype<usize>(input), 17);
        output.pos.x = load<u8>(changetype<usize>(input), 18);
        output.pos.y = load<u8>(changetype<usize>(input), 19);
        output.pos.z = load<u8>(changetype<usize>(input), 20);
        output.movement.moving = load<bool>(changetype<usize>(input), 21);
        output.movement.speed = load<f32>(changetype<usize>(input), 22);
        output.movement.direction.pitch = load<f32>(changetype<usize>(input), 26);
        output.movement.direction.yaw = load<f32>(changetype<usize>(input), 30);
        output.movement.direction.facing = load<f32>(changetype<usize>(input), 34);
        store<u32>(changetype<usize>(output.data), load<u32>(changetype<usize>(input), 38));
    }
}