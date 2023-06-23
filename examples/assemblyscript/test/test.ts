import { JSON } from "json-as";
import { Quadrant, Vec3 } from "../Vec3";
import { Player } from "../Player";
import { Direction, Movement } from "../Movement";

const player = new Player(
  true,
  "JairusSW",
  3022,
  new Vec3(1, 2, 3),
  new Movement(true, 6.0, new Direction(5.0, 4.0, 9.0)),
  [1, 2, 3, 4]
);

const buf = new ArrayBuffer(Player.__FASS_SIZE);

Player.__FASS_SERIALIZE(buf, player);

console.log("Serialized Player: " + Uint8Array.wrap(buf).join(" "));

const p2 = new Player(
  false,
  "        ",
  0,
  new Vec3(0, 0, 0),
  new Movement(false, 0, new Direction(0, 0, 0)),
  [0, 0, 0, 0]
); //changetype<Player>(__new(offsetof<Player>(), idof<Player>()));

Player.__FASS_DESERIALIZE(buf, p2);

Player.__FASS_SERIALIZE(buf, p2);
console.log("Deserialized Player: " + Uint8Array.wrap(buf).join(" "));
