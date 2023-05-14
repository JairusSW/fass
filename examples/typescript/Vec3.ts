export class Vec3 {
    x!: f32;
    y!: f32;
    z!: f32;
    public __FASS_SIZE: u32 = 12;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        store<f32>(changetype<usize>(output), input.x, 0);
        store<f32>(changetype<usize>(output), input.y, 4);
        store<f32>(changetype<usize>(output), input.z, 8);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.x = load<f32>(changetype<usize>(input), 0);
        output.y = load<f32>(changetype<usize>(input), 4);
        output.z = load<f32>(changetype<usize>(input), 8);
    }
}

export enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}