export class Vec3 {
    quad!: Quadrant;
    x!: number;
    y!: number;
    z!: number;
    static __FASS_SIZE: number = 13;
    static __FASS_SERIALIZE(output: DataView, input: Vec3): void {
        output.setUint8(0, input.quad);
        output.setFloat32(1, input.x, true);
        output.setFloat32(5, input.y, true);
        output.setFloat32(9, input.z, true);
    }
    static __FASS_DESERIALIZE(input: DataView, output: Vec3): void {
        output.quad = input.getUint8(0);
        output.x = input.getFloat32(1, true);
        output.y = input.getFloat32(5, true);
        output.z = input.getFloat32(9, true);
    }
}

export enum Quadrant {
    TL = 1,
    TR = 2,
    BL = 3,
    BR = 4
}