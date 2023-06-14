// @ts-ignore
@serializable
export class Vec3 {
    public quad: Quadrant;
    public x: u8;
    public y: u8;
    public z: u8;
    constructor(quad: Quadrant, x: u8, y: u8, z: u8) {
        this.quad = quad;
        this.x = x;
        this.y = y;
        this.z = z;
    }
    public __FASS_SIZE: u32 = 4;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        store<u8>(changetype<usize>(output), input.quad, 0);
        store<u8>(changetype<usize>(output), input.x, 1);
        store<u8>(changetype<usize>(output), input.y, 2);
        store<u8>(changetype<usize>(output), input.z, 3);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.quad = load<u8>(changetype<usize>(input), 0);
        output.x = load<u8>(changetype<usize>(input), 1);
        output.y = load<u8>(changetype<usize>(input), 2);
        output.z = load<u8>(changetype<usize>(input), 3);
    }
}

export enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}