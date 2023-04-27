export class Movement {
    moving!: bool;
    speed!: number;
    direction!: Direction;
    static __FASS_SIZE: number = 5;
    static __FASS_SERIALIZE(output: DataView, input: Movement): void {
        output.setUint8(0, input.moving ? 1 : 0);
        output.setFloat32(1, input.speed, true);
    }
    static __FASS_DESERIALIZE(input: DataView, output: Movement): void {
        output.moving = input.getUint8(0);
        output.speed = input.getFloat32(1, true);
    }
}

export class Direction {
    pitch!: number;
    yaw!: number;
    facing!: number;
    static __FASS_SIZE: number = 12;
    static __FASS_SERIALIZE(output: DataView, input: Direction): void {
        output.setFloat32(0, input.pitch, true);
        output.setFloat32(4, input.yaw, true);
        output.setFloat32(8, input.facing, true);
    }
    static __FASS_DESERIALIZE(input: DataView, output: Direction): void {
        output.pitch = input.getFloat32(0, true);
        output.yaw = input.getFloat32(4, true);
        output.facing = input.getFloat32(8, true);
    }
}