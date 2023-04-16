export class Vec3 {
    quad!: Quadrant
    x!: f32
    y!: f32
    z!: f32
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Vec3): void {
        // Vec3 -> [1, 1.0, 2.0, 3.0]
        store<u8>(changetype<usize>(output), input.quad);
        store<f32>(changetype<usize>(output) + <usize>2, input.y);
        store<f32>(changetype<usize>(output) + <usize>3, input.z);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Vec3): void {
        // [1, 1.0, 2.0, 3.0] -> Vec3
        output.quad = load<u8>(changetype<usize>(input));
        output.x = load<f32>(changetype<usize>(input) + <usize>1);
        output.y = load<f32>(changetype<usize>(input) + <usize>2);
        output.z = load<f32>(changetype<usize>(input) + <usize>3);
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