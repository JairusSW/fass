export class Vec3 {
  public x: number;
  public y: number;
  public z: number;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static __FASS_SIZE: number = 3;
  static __FASS_SERIALIZE(output: DataView, input: Vec3): void {
    output.setUint8(0, input.x);
    output.setUint8(1, input.y);
    output.setUint8(2, input.z);
  }
  static __FASS_DESERIALIZE(input: DataView, output: Vec3): void {
    output.x = input.getUint8(0);
    output.y = input.getUint8(1);
    output.z = input.getUint8(2);
  }
}

export enum Quadrant {
  TL = 1,
  TR = 2,
  BL = 3,
  BR = 4,
}
