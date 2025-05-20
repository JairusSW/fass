import { FASS } from "..";
import { bench } from "./lib/bench";

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

const v1 = new Movement(true, 1.0, new Direction(1.0, 2.0, 3.0));
const v2 = FASS.serialize(v1);

bench(
  "Serialize Movement",
  () => {
    FASS.serialize(v1)
  },
  128_000_00,
);

bench(
  "Deserialize Movement",
  () => {
    FASS.deserialize<Movement>(v2);
  },
  128_000_00,
);
