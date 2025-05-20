export class Vec3 {
  public x: u8;
  public y: u8;
  public z: u8;
  constructor(x: u8, y: u8, z: u8) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  __FASS_SIZE: u32 = 3;
  __FASS_SERIALIZE(output: usize, input: usize): void {
    store<u8>(output, load<u8>(input, offsetof<Vec3>("x")), 0);
    store<u8>(output, load<u8>(input, offsetof<Vec3>("y")), 1);
    store<u8>(output, load<u8>(input, offsetof<Vec3>("z")), 2);
  }
  __FASS_DESERIALIZE(input: usize, output: usize): void {
    store<u8>(output, load<u8>(input, 0), offsetof<Vec3>("x"));
    store<u8>(output, load<u8>(input, 1), offsetof<Vec3>("y"));
    store<u8>(output, load<u8>(input, 2), offsetof<Vec3>("z"));
  }
}
