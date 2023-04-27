import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

export class Player {
    name!: string;
    id!: i32;
    pos!: Vec3;
    movement!: Movement;
    data!: StaticArray<u8>;
    public __FASS_SIZE: u32 = 12;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output));
        store<i32>(changetype<usize>(output), input.id, 8);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input), 8);
        output.id = load<i32>(changetype<usize>(input), 8);
    }
}