import { FASS } from "..";
import { bench } from "./lib/bench";

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

const v1: Vec3 = new Vec3(1, 2, 3);
const v2 = FASS.serialize(v1);

bench(
  "Serialize Vec3",
  () => {
    FASS.serialize(v1)
  },
  256_000_00,
);

bench(
  "Deserialize Vec3",
  () => {
    FASS.deserialize<Vec3>(v2);
  },
  256_000_00,
);
