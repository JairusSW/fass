// @ts-ignore: Decorator
@inline export function strideof<T>(): i32 {
    let type: nonnull<T> = changetype<nonnull<T>>(0);
    if (isBoolean<T>()) return 1;
    if (isInteger<T>() || isFloat<T>()) return sizeof<T>();
    // @ts-ignore: transform
    if (isDefined(type.__FASS_SIZE)) return type.__FASS_SIZE();
    if (type instanceof ArrayBuffer) return type.byteLength;
    // @ts-ignore: type
    if (type instanceof StaticArray) return type.length * strideof<valueof<T>>();
    throw new Error("Could not determine stride of type " + nameof<T>())
}