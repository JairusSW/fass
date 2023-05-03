/// This is a Single Line comment!
export class Vec3 {
    quad!: Quadrant;
    x!: f32;
    y!: f32;
    z!: f32;
    public __FASS_SIZE: u32 = 13;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        store<u8>(changetype<usize>(output), input.quad, 0);
        store<f32>(changetype<usize>(output), input.x, 1);
        store<f32>(changetype<usize>(output), input.y, 5);
        store<f32>(changetype<usize>(output), input.z, 9);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.quad = load<u8>(changetype<usize>(input), 0);
        output.x = load<f32>(changetype<usize>(input), 1);
        output.y = load<f32>(changetype<usize>(input), 5);
        output.z = load<f32>(changetype<usize>(input), 9);
    }
}

export enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}