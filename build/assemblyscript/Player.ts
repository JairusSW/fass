import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

export class Player {
    active!: bool;
    name!: string;
    id!: u64;
    pos!: Vec3;
    movement!: Movement;
    data!: StaticArray<u8>;
    public __FASS_SIZE: u32 = 17;
    @inline __FASS_SERIALIZE(output: ArrayBuffer, input: Player): void {
        store<bool>(changetype<usize>(output), input.active, 0);
        String.UTF8.encodeUnsafe(changetype<usize>(input.name), 8, changetype<usize>(output));
        store<u64>(changetype<usize>(output), input.id, 9);
    }
    @inline __FASS_DESERIALIZE(input: ArrayBuffer, output: Player): void {
        output.active = load<bool>(changetype<usize>(input), 0);
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input), 8);
        output.id = load<u64>(changetype<usize>(input), 9);
    }
}