export class Movement {
  public moving: bool;
  public speed: f32;
  public direction: Direction;
  constructor(moving: bool, speed: f32, direction: Direction) {
    this.moving = moving;
    this.speed = speed;
    this.direction = direction;
  }
  public __FASS_SIZE: u32 = 17;
  @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Movement): void {
    store<bool>(changetype<usize>(output), input.moving, 0);
    store<f32>(changetype<usize>(output), input.speed, 1);
    store<f32>(changetype<usize>(output), input.direction.pitch, 5);
    store<f32>(changetype<usize>(output), input.direction.yaw, 9);
    store<f32>(changetype<usize>(output), input.direction.facing, 13);
  }
  @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Movement): void {
    output.moving = load<bool>(changetype<usize>(input), 0);
    output.speed = load<f32>(changetype<usize>(input), 1);
    output.direction.pitch = load<f32>(changetype<usize>(input), 5);
    output.direction.yaw = load<f32>(changetype<usize>(input), 9);
    output.direction.facing = load<f32>(changetype<usize>(input), 13);
  }
}

export class Direction {
  public pitch: f32;
  public yaw: f32;
  public facing: f32;
  constructor(pitch: f32, yaw: f32, facing: f32) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.facing = facing;
  }
  public __FASS_SIZE: u32 = 12;
  @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Direction): void {
    store<f32>(changetype<usize>(output), input.pitch, 0);
    store<f32>(changetype<usize>(output), input.yaw, 4);
    store<f32>(changetype<usize>(output), input.facing, 8);
  }
  @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Direction): void {
    output.pitch = load<f32>(changetype<usize>(input), 0);
    output.yaw = load<f32>(changetype<usize>(input), 4);
    output.facing = load<f32>(changetype<usize>(input), 8);
  }
}
