/// <reference path="./index.d.ts" />

import { bytes } from "./util/bytes";

export namespace FASS {
  /**
   * Serializes valid FASS data
   * ```js
   * FASS.serialize<T>(data)
   * ```
   * @param data T
   * @returns ArrayBuffer
   */
  // @ts-ignore: inline
  @inline export function serialize<T>(data: T/*, out: ArrayBuffer | null = null*/): ArrayBuffer {
    if (isBoolean<T>()) {
      const out = new ArrayBuffer(1);
      store<bool>(changetype<usize>(out), data as bool);
      return out;
    } else if (isInteger<T>(data) || isFloat<T>(data)) {
      const out = new ArrayBuffer(sizeof<T>());
      store<T>(changetype<usize>(out), data);
      return out;
    } else if (isString<nonnull<T>>()) {
      const n = bytes(data);
      const out = new ArrayBuffer(n);
      memory.copy(changetype<usize>(out), changetype<usize>(data), n);
      return out;
      // @ts-ignore: transform
    } else if (isDefined(data.__FASS_SERIALIZE)) {
      // @ts-ignore: transform
      const out = new ArrayBuffer(data.__FASS_SIZE());
      // @ts-ignore: transform
      inline.always(data.__FASS_SERIALIZE(changetype<usize>(data), changetype<usize>(out)));
      return out;
    } else if (data instanceof ArrayBuffer) {
      const n = data.byteLength;
      const out = new ArrayBuffer(n);
      memory.copy(changetype<usize>(out), changetype<usize>(data), n);
      return out;
    } else {
      throw new Error("Could not serialize data of type " + nameof<T>());
    }
  }

  /**
   * Deserializes valid FASS data
   * ```js
   * FASS.deserialize<T>(data)
   * ```
   * @param data ArrayBuffer
   * @returns T
   */
  // @ts-ignore: inline
  @inline export function deserialize<T>(data: ArrayBuffer): T {
    const dataSize = bytes(data);
    const dataPtr = changetype<usize>(data);
    if (isBoolean<T>()) {
      return load<bool>(dataPtr) as T;
    } else if (isInteger<T>() || isFloat<T>()) {
      return load<T>(dataPtr) as T;
    } else if (isString<T>()) {
      const out = changetype<string>(__new(dataSize, idof<string>()));
      memory.copy(changetype<usize>(out), changetype<usize>(data), dataSize);
      return out as T
    } else {
      let type: nonnull<T> = changetype<nonnull<T>>(0);
      // @ts-ignore: transform
      if (isDefined(type.__FASS_DESERIALIZE)) {
        const out = changetype<T>(__new(offsetof<nonnull<T>>(), idof<nonnull<T>>()));
        inline.always(out.__FASS_DESERIALIZE(dataPtr, changetype<usize>(out)));
        return out
        // @ts-ignore: transform
      } else {
        throw new Error("Could not deserialize data ${data} to type " + nameof<T>());
      }
    }
  }
}
