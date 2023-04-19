export class Vec3 {
    quad!: Quadrant
    x!: f32
    y!: f32
    z!: f32
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        // Vec3 -> [1, 1.0, 2.0, 3.0]
        store<u8>(changetype<usize>(output), input.quad);
        store<f32>(changetype<usize>(output), input.x, 1)
        store<f32>(changetype<usize>(output), input.y, 5);
        store<f32>(changetype<usize>(output), input.z, 9);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        // [1, 1.0, 2.0, 3.0] -> Vec3
        output.quad = load<u8>(changetype<usize>(input));
        output.x = load<f32>(changetype<usize>(input), 1);
        output.y = load<f32>(changetype<usize>(input), 9);
        output.z = load<f32>(changetype<usize>(input), 3);
    }
    @inline __FASS_SIZE(): u32 {
        // 1 + 4 + 4 + 4 = 13 bytes long
        return 13;
    }
}
 
enum Quadrant {
    TL = 1,
    TR = 2,  
    BL = 3,
    BR = 4
}

const bar: Vec3 = {
    quad: Quadrant.TL,
    x: 1.0,
    y: 2.0,
    z: 3.0
}