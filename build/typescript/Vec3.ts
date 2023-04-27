export class Vec3 {
    quad!: Quadrant;
    x!: number;
    y!: number;
    z!: number;
    static __FASS_SIZE = 13;
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


const vec: Vec3 = {
    quad: Quadrant.BL,
    x: 8.68,
    y: 4.23,
    z: 9.53
}

const vec2 = new Vec3();

const serializedVec = new DataView(new ArrayBuffer(Vec3.__FASS_SIZE));

Vec3.__FASS_SERIALIZE(serializedVec, vec);

console.log("Serialized Vec3: " + new Uint8Array(serializedVec.buffer).join(" "));

console.log(`Matches: ${new Uint8Array(serializedVec.buffer).join(" ") == "3 72 225 10 65 41 92 135 64 225 122 24 65"}`)
Vec3.__FASS_DESERIALIZE(serializedVec, vec2);

console.log(`{
    quad: ${vec2.quad},
    x: ${vec2.x},
    y: ${vec2.y},
    z: ${vec2.z}
}`);