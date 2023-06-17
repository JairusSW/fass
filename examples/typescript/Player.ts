import { Vec3 } from "./Vec3";
import { Movement } from "./Movement";
export class Player {
    public active: boolean;
    public name: string;
    public id: bigint;
    public pos: Vec3;
    public movement: Movement;
    public data: Array<number>;
    constructor(active: boolean, name: string, id: bigint, pos: Vec3, movement: Movement, data: Array<number>) {
        this.active = active;
        this.name = name;
        this.id = id;
        this.pos = pos;
        this.movement = movement;
        this.data = data;
    }
    static __FASS_SIZE: number = 41;
    static __FASS_SERIALIZE(output: DataView, input: Player): void {
        output.setUint8(0, Number(input.active));
        output.setUint8(1, input.name.charCodeAt(0));
        output.setUint8(2, input.name.charCodeAt(1));
        output.setUint8(3, input.name.charCodeAt(2));
        output.setUint8(4, input.name.charCodeAt(3));
        output.setUint8(5, input.name.charCodeAt(4));
        output.setUint8(6, input.name.charCodeAt(5));
        output.setUint8(7, input.name.charCodeAt(6));
        output.setUint8(8, input.name.charCodeAt(7));
        output.setBigUint64(9, input.id, true);
        output.setUint8(17, input.pos.x);
        output.setUint8(18, input.pos.y);
        output.setUint8(19, input.pos.z);
        output.setUint8(20, Number(input.movement.moving));
        output.setFloat32(21, input.movement.speed, true);
        output.setFloat32(25, input.movement.direction.pitch, true);
        output.setFloat32(29, input.movement.direction.yaw, true);
        output.setFloat32(33, input.movement.direction.facing, true);
        store<u32>(changetype<usize>(output), load<u32>(changetype<usize>(input.data)), 37);
    }
    static __FASS_DESERIALIZE(input: DataView, output: Player): void {
        output.active = Boolean(input.getUint8(0));
        output.name = String.UTF8.decodeUnsafe(changetype<usize>(input) + <usize>1, 8);
        output.id = input.getBigUint64(9, true);
        output.pos.x = input.getUint8(17);
        output.pos.y = input.getUint8(18);
        output.pos.z = input.getUint8(19);
        output.movement.moving = Boolean(input.getUint8(20));
        output.movement.speed = input.getFloat32(21, true);
        output.movement.direction.pitch = input.getFloat32(25, true);
        output.movement.direction.yaw = input.getFloat32(29, true);
        output.movement.direction.facing = input.getFloat32(33, true);
        store<u32>(changetype<usize>(output.data), load<u32>(changetype<usize>(input), 37));
    }
}