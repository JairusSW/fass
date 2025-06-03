import { JSON } from "json-as";
import { FASS } from ".";
import { OBJECT, TOTAL_OVERHEAD } from "rt/common";

@fass
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

  // @inline __FASS_SIZE(): i32 {
  //     return 3;
  // }

  // __FASS_SERIALIZE(input: usize, output: usize): void {
  //     store<u8>(output, load<u8>(input, 0), 0);
  //     store<u8>(output, load<u8>(input, 1), 1);
  //     store<u8>(output, load<u8>(input, 2), 2);
  // }

  // __FASS_DESERIALIZE(input: usize, output: usize): void {
  //     store<u8>(output, load<u8>(input, 0), 0);
  //     store<u8>(output, load<u8>(input, 1), 1);
  //     store<u8>(output, load<u8>(input, 2), 2);
  // }
}

@fass
@json
class Direction {
  public pitch: f32;
  public yaw: f32;
  public facing: f32;
  // public foo: string = "bar";

  constructor(pitch: f32, yaw: f32, facing: f32) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.facing = facing;
  }

  // @inline __FASS_SIZE(): i32 {
  //     return 12;
  // }

  // __FASS_SERIALIZE(input: usize, output: usize): void {
  //     store<f32>(output, load<f32>(input, 0), 0);
  //     store<f32>(output, load<f32>(input, 4), 4);
  //     store<f32>(output, load<f32>(input, 8), 8);
  // }

  // __FASS_DESERIALIZE(input: usize, output: usize): void {
  //     store<f32>(output, load<f32>(input, 0), 0);
  //     store<f32>(output, load<f32>(input, 4), 4);
  //     store<f32>(output, load<f32>(input, 8), 8);
  // }
}

@fass
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

  // @inline __FASS_SIZE(): i32 {
  //     return 17;
  // }

  // __FASS_SERIALIZE(input: usize, output: usize): void {
  //     store<bool>(output, load<bool>(input, 0), 0);
  //     store<f32>(output, load<f32>(input, 1), 1);
  //     const a1 = load<usize>(input, offsetof<Movement>("direction"));
  //     store<f32>(output, load<f32>(a1, 0), 5);
  //     store<f32>(output, load<f32>(a1, 4), 9);
  //     store<f32>(output, load<f32>(a1, 8), 13);
  // }

  // __FASS_DESERIALIZE(input: usize, output: usize): void {
  //     store<bool>(output, load<bool>(input, 0), 0);
  //     store<f32>(output, load<f32>(input, 1), 1);
  //     const a1 = load<usize>(output, offsetof<Movement>("direction"));
  //     store<f32>(a1, load<f32>(input, 5), 0);
  //     store<f32>(a1, load<f32>(input, 9), 4);
  //     store<f32>(a1, load<f32>(input, 13), 8);
  // }
}

@fass
@json
class Player {
  public active: bool;
  @bytes(13)
  public name: string;
  public id: u64;
  public pos: Vec3;
  public movement: Movement;
  // @bytes(4)
  // public data: StaticArray<u8>;
  constructor(
    active: bool,
    name: string,
    id: u64,
    pos: Vec3,
    movement: Movement,
    // data: StaticArray<u8>
  ) {
    this.active = active;
    this.name = name;
    this.id = id;
    this.pos = pos;
    this.movement = movement;
    // this.data = data;
  }
}

// @fass
// @json
// class Range {
//     public line: i32;
//     public column: i32;
//     constructor(line: i32, column: i32) {
//         this.line = line;
//         this.column = column;
//     }
// }

// @fass
// @json
// class Node {
//     public next: Node | null;
//     constructor(next: Node | null) {
//         this.next = next;
//     }
// }

const a1 = new Vec3(1, 2, 3);
console.log("a1: " + JSON.stringify(a1));

const a2 = FASS.serialize(a1);
console.log("a2: " + visualise(a2));

const a3 = FASS.deserialize<Vec3>(a2);
console.log("a3: " + JSON.stringify(a3));

const b1 = new Movement(true, 1.0, new Direction(1.0, 2.0, 3.0));
console.log("b1: " + JSON.stringify(b1));

const b2 = FASS.serialize(b1);
console.log("b2: " + visualise(b2));

const b3 = FASS.deserialize<Movement>(b2);
console.log("b3: " + JSON.stringify(b3));

const p1 = new Player(
  true,
  "Jairus Tanaka",
  4531293,
  new Vec3(1, 2, 3),
  new Movement(true, 4.21,
    new Direction(5.43, -13.2, 19.23)
  ),
  // [1, 6, 3, 1]
);
console.log("p1: " + JSON.stringify(p1));

const p2 = FASS.serialize(p1);
console.log("p2: " + visualise(p2));

const p3 = FASS.deserialize<Player>(p2);
console.log("p3: " + JSON.stringify(p3));

console.log(visualise(String.UTF16.encode("Jairus Tanaka")))

function visualise(data: ArrayBuffer): string {
  const bytes = Uint8Array.wrap(data);
  return bytes.join(" ");
}