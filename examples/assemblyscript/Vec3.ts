export class Vec3 {
    public quad: Quadrant;
    public x: f32;
    public y: f32;
    public z: f32;
    constructor(quad: Quadrant, x: f32, y: f32, z: f32) {
        this.quad = quad;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public __FASS_SIZE: u32 = 20;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        store<u8>(changetype<usize>(output), input.quad, 0);
        store<f32>(changetype<usize>(output), input.x, 8);
        store<f32>(changetype<usize>(output), input.y, 12);
        store<f32>(changetype<usize>(output), input.z, 16);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.quad = load<u8>(changetype<usize>(input), 0);
        output.x = load<f32>(changetype<usize>(input), 8);
        output.y = load<f32>(changetype<usize>(input), 12);
        output.z = load<f32>(changetype<usize>(input), 16);
    }
}

export enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}