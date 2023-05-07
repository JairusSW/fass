import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

export class Player {
    active!: bool;
    name!: string;
    id!: u64;
    pos!: Vec3;
    movement!: Movement;
    data!: StaticArray<u8>;
    public __FASS_SIZE: u32 = -1;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output) + <usize>1);
        store<u64>(changetype<usize>(output), input.id, 9);
        store<u8>(changetype<usize>(output), input.pos.quad, 17);
        store<f32>(changetype<usize>(output), input.pos.x, 18);
        store<f32>(changetype<usize>(output), input.pos.y, 22);
        store<f32>(changetype<usize>(output), input.pos.z, 26);
        store<bool>(changetype<usize>(output), input.movement.moving, 30);
        store<f32>(changetype<usize>(output), input.movement.speed, 31);
        store<f32>(changetype<usize>(output), input.movement.direction.pitch, 35);
        store<f32>(changetype<usize>(output), input.movement.direction.yaw, 39);
        store<f32>(changetype<usize>(output), input.movement.direction.facing, 43);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>1, 8);
        output.id = load<u64>(changetype<usize>(input), 9);
        output.pos.quad = load<u8>(changetype<usize>(input), 17);
        output.pos.x = load<f32>(changetype<usize>(input), 18);
        output.pos.y = load<f32>(changetype<usize>(input), 22);
        output.pos.z = load<f32>(changetype<usize>(input), 26);
        output.movement.moving = load<bool>(changetype<usize>(input), 30);
        output.movement.speed = load<f32>(changetype<usize>(input), 31);
        output.movement.direction.pitch = load<f32>(changetype<usize>(input), 35);
        output.movement.direction.yaw = load<f32>(changetype<usize>(input), 39);
        output.movement.direction.facing = load<f32>(changetype<usize>(input), 43);
    }
}