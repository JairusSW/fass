export class Movement {
    moving!: bool;
    speed!: f32;
    direction!: Direction;
    public __FASS_SIZE: u32 = 5;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Movement): void {
        store<bool>(changetype<usize>(output), input.moving, 0);
        store<f32>(changetype<usize>(output), input.speed, 1);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Movement): void {
        output.moving = load<bool>(changetype<usize>(input), 0);
        output.speed = load<f32>(changetype<usize>(input), 1);
    }
}

export class Direction {
    pitch!: f32;
    yaw!: f32;
    facing!: f32;
    public __FASS_SIZE: u32 = 12;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Direction): void {
        store<f32>(changetype<usize>(output), input.pitch, 0);
        store<f32>(changetype<usize>(output), input.yaw, 4);
        store<f32>(changetype<usize>(output), input.facing, 8);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Direction): void {
        output.pitch = load<f32>(changetype<usize>(input), 0);
        output.yaw = load<f32>(changetype<usize>(input), 4);
        output.facing = load<f32>(changetype<usize>(input), 8);
    }
}