import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

export class Player {
    name!: string;
    id!: i32;
    pos!: Vec3;
    movement!: Movement;
    data!: StaticArray<u8>;
    static __FASS_SIZE: number = 12;
    static __FASS_SERIALIZE(output: DataView, input: Player): void {
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output));
        output.setInt32(8, input.id, true);
    }
    static __FASS_DESERIALIZE(input: DataView, output: Player): void {
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input), 8);
        output.id = load<i32>(changetype<usize>(input), 8);
    }
}