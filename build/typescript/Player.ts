import { Vec3, Quadrant } from "./Vec3";

import { Movement, Direction } from "./Movement";

export class Player {
    active!: boolean;
    name!: string;
    id!: bigint;
    pos!: Vec3;
    movement!: Movement;
    data!: Array<number>;
    public __FASS_SIZE: number = 17;
     __FASS_SERIALIZE(output: DataView, input: Player): void {
        output.setUint8(0, Number(input.active));
        // STRINGS NOT SUPPORTED YET
        output.setBigUint64(9, input.id, true);
    }
    public __FASS_DESERIALIZE(input: DataView, output: Player): void {
        output.active = Boolean(input.getUint8(0));
        output.name = String.fromCharCode(...Array.from<number>(input.buffer.slice(1, 9)))
        output.id = input.getBigUint64(9, true);
    }
}

const player: Player = {
    active: true,
    name: "JairusSW",
    id: BigInt(1234567890),
    pos: {
        quad: Quadrant.BL,
        x: 1,
        y: 2,
        z: 3
    },
    movement: {
        moving: true,
        speed: 4.3,
        direction: {
            pitch: -3.4,
            yaw: 3.2,
            facing: 0.5
        }
    },
    data: [1, 2, 4, 5]
}