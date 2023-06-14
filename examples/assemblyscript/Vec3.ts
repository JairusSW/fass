export class Vec3 {
    public x: u8;
    public y: u8;
    public z: u8;
    constructor(x: u8, y: u8, z: u8) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static __FASS_SIZE: u32 = 3;
    static __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        store<u8>(changetype<usize>(output), input.x, 0);
        store<u8>(changetype<usize>(output), input.y, 1);
        store<u8>(changetype<usize>(output), input.z, 2);
    }
    static __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        output.x = load<u8>(changetype<usize>(input), 0);
        output.y = load<u8>(changetype<usize>(input), 1);
        output.z = load<u8>(changetype<usize>(input), 2);
    }
}

export enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}