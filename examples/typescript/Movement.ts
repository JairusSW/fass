export class Movement {
  public moving: boolean;
  public speed: number;
  public direction: Direction;
  constructor(moving: boolean, speed: number, direction: Direction) {
    this.moving = moving;
    this.speed = speed;
    this.direction = direction;
  }
  static __FASS_SIZE: number = 17;
  static __FASS_SERIALIZE(output: DataView, input: Movement): void {
    output.setUint8(0, Number(input.moving));
    output.setFloat32(1, input.speed, true);
    output.setFloat32(5, input.direction.pitch, true);
    output.setFloat32(9, input.direction.yaw, true);
    output.setFloat32(13, input.direction.facing, true);
  }
  static __FASS_DESERIALIZE(input: DataView, output: Movement): void {
    output.moving = Boolean(input.getUint8(0));
    output.speed = input.getFloat32(1, true);
    output.direction.pitch = input.getFloat32(5, true);
    output.direction.yaw = input.getFloat32(9, true);
    output.direction.facing = input.getFloat32(13, true);
  }
}

export class Direction {
  public pitch: number;
  public yaw: number;
  public facing: number;
  constructor(pitch: number, yaw: number, facing: number) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.facing = facing;
  }
  static __FASS_SIZE: number = 12;
  static __FASS_SERIALIZE(output: DataView, input: Direction): void {
    output.setFloat32(0, input.pitch, true);
    output.setFloat32(4, input.yaw, true);
    output.setFloat32(8, input.facing, true);
  }
  static __FASS_DESERIALIZE(input: DataView, output: Direction): void {
    output.pitch = input.getFloat32(0, true);
    output.yaw = input.getFloat32(4, true);
    output.facing = input.getFloat32(8, true);
  }
}
