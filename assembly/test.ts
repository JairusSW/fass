import { JSON } from "json-as";
import { FASS } from ".";

@json
class Vec3 {
    public x: u8;
    public y: u8;
    public z: u8;

    constructor(x: u8, y: u8, z: u8) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    @inline __FASS_SIZE(): i32 {
        return 3;
    }

    __FASS_SERIALIZE(input: usize, output: usize): void {
        store<u8>(output, load<u8>(input, 0), 0);
        store<u8>(output, load<u8>(input, 1), 1);
        store<u8>(output, load<u8>(input, 2), 2);
    }

    __FASS_DESERIALIZE(input: usize, output: usize): void {
        store<u8>(output, load<u8>(input, 0), 0);
        store<u8>(output, load<u8>(input, 1), 1);
        store<u8>(output, load<u8>(input, 2), 2);
    }
}

@json
class Movement {
    public moving: bool;
    public speed: f32;
    public direction: Direction;

    constructor(moving: bool, speed: f32, direction: Direction) {
        this.moving = moving;
        this.speed = speed;
        this.direction = direction;
    }

    @inline __FASS_SIZE(): i32 {
        return 17;
    }

    __FASS_SERIALIZE(input: usize, output: usize): void {
        store<bool>(output, load<bool>(input, 0), 0);
        store<f32>(output, load<f32>(input, 1), 1);
        const a1 = load<usize>(input, offsetof<Movement>("direction"));
        store<f32>(output, load<f32>(a1, 0), 5);
        store<f32>(output, load<f32>(a1, 4), 9);
        store<f32>(output, load<f32>(a1, 8), 13);
    }

    __FASS_DESERIALIZE(input: usize, output: usize): void {
        store<bool>(output, load<bool>(input, 0), 0);
        store<f32>(output, load<f32>(input, 1), 1);
        const a1 = load<usize>(output, offsetof<Movement>("direction"));
        store<f32>(a1, load<f32>(input, 5), 0);
        store<f32>(a1, load<f32>(input, 9), 4);
        store<f32>(a1, load<f32>(input, 13), 8);
    }
}

@json
class Direction {
    public pitch: f32;
    public yaw: f32;
    public facing: f32;

    constructor(pitch: f32, yaw: f32, facing: f32) {
        this.pitch = pitch;
        this.yaw = yaw;
        this.facing = facing;
    }

    @inline __FASS_SIZE(): i32 {
        return 12;
    }

    __FASS_SERIALIZE(input: usize, output: usize): void {
        store<f32>(output, load<f32>(input, 0), 0);
        store<f32>(output, load<f32>(input, 4), 4);
        store<f32>(output, load<f32>(input, 8), 8);
    }

    __FASS_DESERIALIZE(input: usize, output: usize): void {
        store<f32>(output, load<f32>(input, 0), 0);
        store<f32>(output, load<f32>(input, 4), 4);
        store<f32>(output, load<f32>(input, 8), 8);
    }
}

const a1 = new Vec3(1, 2, 3);
console.log("a1: " + JSON.stringify(a1));

const a2 = FASS.serialize(a1);
console.log("a2: " + visualise(a2));

const a3 = FASS.deserialize<Vec3>(a2);
console.log("a3: " + JSON.stringify(a3));

const b1 = new Movement(true, 1.0, new Direction(1.0, 2.0, 3.0));
console.log("b1: " + JSON.stringify(b1));
console.log(changetype<usize>(b1.direction).toString());
const b2 = FASS.serialize(b1);
console.log("b2: " + visualise(b2));

const b3 = FASS.deserialize<Movement>(b2);
console.log("b3: " + JSON.stringify(b3));

function visualise(data: ArrayBuffer): string {
    return Uint8Array.wrap(data).join(" ");
}