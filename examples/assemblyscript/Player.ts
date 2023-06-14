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
    static __FASS_SIZE: u32 = 41;
    static __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output) + <usize>1);
        store<u64>(changetype<usize>(output), input.id, 9);
        store<u8>(changetype<usize>(output), input.pos.x, 17);
        store<u8>(changetype<usize>(output), input.pos.y, 18);
        store<u8>(changetype<usize>(output), input.pos.z, 19);
        store<bool>(changetype<usize>(output), input.movement.moving, 20);
        store<f32>(changetype<usize>(output), input.movement.speed, 21);
        store<f32>(changetype<usize>(output), input.movement.direction.pitch, 25);
        store<f32>(changetype<usize>(output), input.movement.direction.yaw, 29);
        store<f32>(changetype<usize>(output), input.movement.direction.facing, 33);
        store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.data)), 37);
    }
    static __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>1, 8);
        output.id = load<u64>(changetype<usize>(input), 9);
        output.pos.x = load<u8>(changetype<usize>(input), 17);
        output.pos.y = load<u8>(changetype<usize>(input), 18);
        output.pos.z = load<u8>(changetype<usize>(input), 19);
        output.movement.moving = load<bool>(changetype<usize>(input), 20);
        output.movement.speed = load<f32>(changetype<usize>(input), 21);
        output.movement.direction.pitch = load<f32>(changetype<usize>(input), 25);
        output.movement.direction.yaw = load<f32>(changetype<usize>(input), 29);
        output.movement.direction.facing = load<f32>(changetype<usize>(input), 33);
        store<u32>(changetype<usize>(output.data), load<u32>(changetype<usize>(input), 37));
    }
}