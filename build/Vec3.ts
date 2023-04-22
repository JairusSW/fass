export class Vec3 {
    name!: string
    quad!: Quadrant
    x!: f32
    y!: f32
    z!: f32
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        //String.UTF8.encodeUnsafe(changetype<usize>(input.name), input.name.length >> 1, changetype<usize>(output));
        store<u8>(changetype<usize>(output), input.quad);
        store<f32>(changetype<usize>(output), input.x, 1);
        store<f32>(changetype<usize>(output), input.y, 5);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.quad = load<u8>(changetype<usize>(input));
        output.x = load<f32>(changetype<usize>(input), 1);
        output.y = load<f32>(changetype<usize>(input), 5);
    }
}

enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}