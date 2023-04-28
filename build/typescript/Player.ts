import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

export class Player {
    active!: boolean;
    name!: string;
    id!: bigint;
    pos!: Vec3;
    movement!: Movement;
    data!: Array<u8>;
    static __FASS_SIZE: number = 17;
    static __FASS_SERIALIZE(output: DataView, input: Player): void {
        output.setUint8(0, Number(input.active));
        // STRINGS NOT SUPPORTED YET
        output.setBigUint64(9, input.id, true);
    }
    static __FASS_DESERIALIZE(input: DataView, output: Player): void {
        output.active = Boolean(input.getUint8(0));
        // STRINGS NOT SUPPORTED YET
        output.id = input.getBigUint64(9, true);
    }
}