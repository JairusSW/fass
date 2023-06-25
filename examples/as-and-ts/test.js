import { readFileSync } from "fs";

class Vec3 {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
  static __FASS_SIZE = 3;
  static __FASS_SERIALIZE(output, input) {
    output.setUint8(0, input.x);
    output.setUint8(1, input.y);
    output.setUint8(2, input.z);
  }
  static __FASS_DESERIALIZE(input, output) {
    output.x = input.getUint8(0);
    output.y = input.getUint8(1);
    output.z = input.getUint8(2);
  }
}


const binary = readFileSync("./build/test.wasm");
const module = new WebAssembly.Module(binary);

let memory;

const imports = {
  env: {
    abort: () => {},
    "console.log": (ptr) => {
      console.log(__liftString(ptr));
    },
  },
  test: {
    decode: (ptr, len) => {
      console.log("(TS) Received Pointer " + ptr);
      console.log("(TS) Decoding buffer to Vec3");

      const vec = new Vec3(0, 0, 0);
      Vec3.__FASS_DESERIALIZE(new DataView(memory, ptr, len), vec);
      console.log("(TS) Printing Vec3:\n" + JSON.stringify(vec, null, 2));
    }
  }
}

function __liftString(pointer) {
  if (!pointer) return null;
  const
    end = pointer + new Uint32Array(memory)[pointer - 4 >>> 2] >>> 1,
    memoryU16 = new Uint16Array(memory);
  let
    start = pointer >>> 1,
    string = "";
  while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
  return string + String.fromCharCode(...memoryU16.subarray(start, end));
}

const instance = new WebAssembly.Instance(module, imports);
memory = instance.exports.memory.buffer;

instance.exports._start();