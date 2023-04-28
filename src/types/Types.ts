import { Statement } from "../parser/nodes";

export enum TypeID {
  // Primitive 0-11
  u8 = 0,
  i8 = 1,
  u16 = 2,
  i16 = 3,
  u32 = 4,
  i32 = 5,
  u64 = 6,
  i64 = 7,
  f32 = 8,
  f64 = 9,
  bool = 10,
  char = 11,
  // Structure Types
  enum = 12,
  struct = 13,
  list = 14,
  sequence = 15,
  // Dynamic length
  array = 16
}

export class ConcreteType {
  public id!: number;
  public name!: string;
  public primitive!: boolean;
  public reference!: Statement;
  constructor(name: string, id: number, reference?: Statement) {
    
  }
}