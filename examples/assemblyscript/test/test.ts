import { JSON } from "json-as";
import { Quadrant, Vec3 } from "../Vec3";

const vec = new Vec3(Quadrant.BL, 1, 2, 3);

const buf = new ArrayBuffer(vec.__FASS_SIZE);

vec.__FASS_SERIALIZE(buf, vec);

console.log("Serialized Vec3: " + Uint8Array.wrap(buf).join(" "));

const vec2 = new Vec3(Quadrant.BL, 0, 0, 0);

vec.__FASS_DESERIALIZE(buf, vec2);

console.log("Deserialized Vec3: " + JSON.stringify(vec2));