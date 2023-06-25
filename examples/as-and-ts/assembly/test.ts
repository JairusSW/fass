import { Vec3 } from "../../assemblyscript/Vec3";

declare function decode(ptr: number, len: number): void;
const vec = new Vec3(1, 2, 3);
const buf = new ArrayBuffer(Vec3.__FASS_SIZE);
const bufPtr = changetype<usize>(buf);

Vec3.__FASS_SERIALIZE(buf, vec);

console.log("(AS) Serialized: " + Uint8Array.wrap(buf).join(" "));
console.log("(AS) Stored buffer at pointer " + bufPtr.toString());

decode(bufPtr, Vec3.__FASS_SIZE);
