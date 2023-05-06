import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

export class Player {
    active!: bool;
    name!: string;
    id!: u64;
    pos!: Vec3;
    movement!: Movement;
    data!: StaticArray<u8>;
    public __FASS_SIZE: u32 = 111;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output));
        store<u64>(changetype<usize>(output), input.id, 10);
        store<u8>(changetype<usize>(output), input.pos.quad, 28);
        store<f32>(changetype<usize>(output), input.pos.x, 28);
        store<f32>(changetype<usize>(output), input.pos.y, 28);
        store<f32>(changetype<usize>(output), input.pos.z, 28);
        store<bool>(changetype<usize>(output), input.movement.moving, 56);
        store<f32>(changetype<usize>(output), input.movement.speed, 56);
        store<f32>(changetype<usize>(output), input.movement.direction.pitch, 56);
        store<f32>(changetype<usize>(output), input.movement.direction.yaw, 56);
        store<f32>(changetype<usize>(output), input.movement.direction.facing, 56);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input), 8);
        output.id = load<u64>(changetype<usize>(input), 10);
        output.pos.quad = load<u8>(changetype<usize>(input), 28);
        output.pos.x = load<f32>(changetype<usize>(input), 28);
        output.pos.y = load<f32>(changetype<usize>(input), 28);
        output.pos.z = load<f32>(changetype<usize>(input), 28);
        output.movement.moving = load<bool>(changetype<usize>(input), 56);
        output.movement.speed = load<f32>(changetype<usize>(input), 56);
        output.movement.direction.pitch = load<f32>(changetype<usize>(input), 56);
        output.movement.direction.yaw = load<f32>(changetype<usize>(input), 56);
        output.movement.direction.facing = load<f32>(changetype<usize>(input), 56);
    }
}