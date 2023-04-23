export class Vec3 {
    name!: string
    quad!: Quadrant
    x!: i8
    y!: i8
    z!: i8
    __FASS_SIZE: number = 9;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output));
        store<u8>(changetype<usize>(output), input.quad, 8);
        store<i8>(changetype<usize>(output), input.x, 9);
        store<i8>(changetype<usize>(output), input.y, 10);
        store<i8>(changetype<usize>(output), input.z, 11);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input), 8);
        output.quad = load<u8>(changetype<usize>(input), 8);
        output.x = load<i8>(changetype<usize>(input), 9);
        output.y = load<i8>(changetype<usize>(input), 10);
        output.z = load<i8>(changetype<usize>(input), 11);
    }
}

enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}