export class Vec3 {
    public x: f32;
    public y: f32;
    public z: f32;
    constructor(x: f32, y: f32, z: f32) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public __FASS_SIZE: u32 = 12;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        store<f32>(changetype<usize>(output), input.x, 0);
        store<u64>(changetype<usize>(output), load<u64>(changetype<usize>(input), 4), 4);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.x = load<f32>(changetype<usize>(input), 0);
        store<u64>(changetype<usize>(output), load<u64>(changetype<usize>(input), 4), 4);
        output.z = load<f32>(changetype<usize>(input), 8);
    }
}

export enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}