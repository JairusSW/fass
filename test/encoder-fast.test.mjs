import { test } from "node:test";
import assert from "node:assert/strict";
import { utf8Length, writeUtf8Into } from "../dist/index.js";
test("word-at-a-time ASCII writes match native UTF-8 for prefixes, surrogates and unaligned subviews", () => {
  const encoder = new TextEncoder();
  let seed = 3;
  const rand = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return seed >>> 0;
  };
  const inputs = [
    "",
    "a",
    "ab",
    "abc",
    "abcd",
    "abcdefghijk",
    "01234567😀suffix",
    "01234567\ud800suffix",
    "01234567\udc00suffix",
  ];
  for (let n = 0; n <= 80; n++)
    for (let position = 0; position < 4; position++)
      inputs.push(
        "a".repeat(n) + ["é", "世界", "😀", "\ud800"][position] + "tail",
      );
  for (let i = 0; i < 1000; i++)
    inputs.push(
      Array.from({ length: rand() % 80 }, () =>
        String.fromCharCode(rand() & 65535),
      ).join(""),
    );
  for (const value of inputs) {
    const expected = encoder.encode(value);
    assert.equal(utf8Length(value), expected.length);
    const bytes = new Uint8Array(expected.length + 20).fill(0xaa),
      dst = bytes.subarray(3, bytes.length - 5),
      view = new DataView(dst.buffer, dst.byteOffset, dst.byteLength);
    assert.equal(
      writeUtf8Into(value, dst, 5, expected.length, view),
      expected.length,
    );
    assert.deepEqual(dst.subarray(5, 5 + expected.length), expected);
    assert.equal(bytes[7], 0xaa);
    assert.equal(bytes[8 + expected.length], 0xaa);
  }
});
