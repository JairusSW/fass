import { Schema } from "../runtime/schema.js";
import { TypeView } from "../runtime/reflection.js";
import { materializeDefault } from "../runtime/build.js";
import { Kind, NO_INDEX as N, width, readWord, Region } from "../format.js";
export function encoderSource(s: Schema): string {
  const layouts = new Set<number>(),
    plans = new Set<number>();
  let maps = false;
  function layout(i: number): void {
    if (layouts.has(i)) return;
    layouts.add(i);
    const l = s.layout(i);
    for (let n = 0; n < s.u32(l + 8); n++) {
      const fi = s.u32(l + 4) + n,
        a = s.access(fi),
        link = s.entry(3, fi),
        k = s.u8(a + 4);
      if (k === 15 || k === 16) layout(s.u32(link));
      else plan(s.u32(link));
    }
  }
  function plan(i: number): void {
    if (plans.has(i)) return;
    plans.add(i);
    const p = s.plan(i),
      k = s.u8(p);
    if (k === 15 || k === 16) layout(s.u32(p + 20));
    else if (k === 13 || k === 14) plan(s.u32(p + 20));
    else if (k === 17) maps = true;
  }
  layout(s.root);
  if (maps)
    return `export class Encoder {measure(value:unknown):number{return measure(schema,value);}encodeInto(value:unknown,destination:Uint8Array):number{return encodeInto(schema,value,destination);}encode(value:unknown):Uint8Array{return encode(schema,value);}}\n`;
  const defaults: string[] = [];
  function expr(v: unknown): string {
    if (v === undefined) return "undefined";
    if (typeof v === "bigint") return `${v}n`;
    if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
    if (typeof v === "boolean" || v === null) return String(v);
    if (typeof v === "string") return JSON.stringify(v);
    if (Array.isArray(v)) return `[${v.map(expr).join(",")}]`;
    return `{${Object.entries(v as Record<string, unknown>)
      .map(([k, x]) => `${JSON.stringify(k)}:${expr(x)}`)
      .join(",")}}`;
  }
  function scalarCheck(k: number, value: string, rule: number = N): string {
    let code = "";
    const w = width(k),
      signed = k % 2 === 1,
      b = w * 8;
    if (k === 11)
      code = `if(typeof ${value}!=='boolean')fail(Code.TypeMismatch,Region.Data);`;
    else if (k >= 9)
      code = `if(typeof ${value}!=='number')fail(Code.TypeMismatch,Region.Data);`;
    else {
      const min = signed ? -(1n << BigInt(b - 1)) : 0n,
        max = signed ? (1n << BigInt(b - 1)) - 1n : (1n << BigInt(b)) - 1n,
        suffix = w === 8 ? "n" : "";
      code = `if(${w === 8 ? `typeof ${value}!=='bigint'` : `!Number.isInteger(${value})`}||${value}<${min}${suffix}||${value}>${max}${suffix})fail(Code.BoundExceeded,Region.Data);`;
    }
    if (rule !== N) {
      const r = s.entry(7, rule),
        n = (x: bigint) =>
          `${signed ? BigInt.asIntN(b, x) : x}${w === 8 ? "n" : ""}`;
      if (s.u8(r) === 1)
        code += `if(${value}<${n(readWord(s.bytes, r + 16, 8, Region.Schema))}||${value}>${n(readWord(s.bytes, r + 24, 8, Region.Schema))})fail(Code.BoundExceeded,Region.Data);`;
      else
        code += `if(!(${Array.from({ length: s.u32(r + 8) }, (_, i) => `${value}===${n(readWord(s.bytes, s.entry(8, s.u32(r + 4) + i), 8, Region.Schema))}`).join("||")}))fail(Code.BoundExceeded,Region.Data);`;
    }
    return code;
  }
  const output: string[] = [
    "const EMPTY_ARRAY:readonly unknown[]=[];",
    "export class Encoder {private doc=new Document();private used=0;private nodes=0;maxNodes=1000000;maxDepth=128;",
    `measure(value:any):number{this.used=${s.u32(s.layout(s.root))};this.nodes=0;this.mL${s.root}(value,0);if(this.used>schema.maxBytes)fail(Code.NeedCapacity,Region.Data,0,this.used);return this.used;}`,
    "encodeInto(value:any,destination:Uint8Array):number{const size=this.measure(value);if(size>destination.length)fail(Code.NeedCapacity,Region.Data,0,size);return this.finish(value,destination,size);}",
    "encode(value:any):Uint8Array{const size=this.measure(value),bytes=new Uint8Array(size);this.finish(value,bytes,size);return bytes;}",
    `private finish(value:any,destination:Uint8Array,size:number):number{this.doc.bytes=destination;this.doc.dv=new DataView(destination.buffer,destination.byteOffset,destination.byteLength);destination.fill(0,0,size);this.used=${s.u32(s.layout(s.root))};this.wL${s.root}(value,0);if(this.used!==size)fail(Code.Malformed,Region.Data,0,this.used);return size;}`,
    "private work(depth:number,n=1):void{this.nodes+=n;if(depth>this.maxDepth||this.nodes>this.maxNodes)fail(Code.WorkLimit,Region.Data);}",
  ];
  function useLayout(li: number, measure: boolean): string {
    const l = s.layout(li),
      first = s.u32(l + 4),
      count = s.u32(l + 8),
      td = new TypeView(s, s.u32(l + 12));
    let code = measure
      ? `private mL${li}(value:any,depth:number):void{this.work(depth,${count + 1});if(value===undefined)value={};if(!value||typeof value!=='object'||Array.isArray(value))fail(Code.TypeMismatch,Region.Data);`
      : `private wL${li}(value:any,anchor:number):void{if(value===undefined)value={};`;
    for (let i = 0; i < count; i++) {
      const fi = first + i,
        a = s.access(fi),
        link = s.entry(3, fi),
        kind = s.u8(a + 4),
        target = s.u32(link),
        fd = td.field(i),
        presence = s.u32(link + 4),
        slot = `anchor+${s.u32(a)}`,
        dv = materializeDefault(fd),
        dn = `D${fd.index}`,
        zero =
          kind === 11
            ? "false"
            : kind === 7 || kind === 8
              ? "0n"
              : kind <= 10
                ? "0"
                : kind === 12
                  ? '""'
                  : kind === 13
                    ? "EMPTY_ARRAY"
                    : kind === 15 || kind === 16
                      ? "undefined"
                      : "undefined";
      if (
        measure &&
        dv !== undefined &&
        !defaults.some((d) => d.startsWith(`const ${dn}=`))
      )
        defaults.push(`const ${dn}=${expr(dv)};`);
      const value = `v${i}`,
        fallback =
          dv === undefined ? (presence === N ? zero : "undefined") : dn;
      code += `const ${value}=value[${JSON.stringify(fd.name())}]===undefined?${fallback}:value[${JSON.stringify(fd.name())}];`;
      if (presence !== N) code += `if(${value}!==undefined&&${value}!==null){`;
      else if (kind > 11)
        code += `if(${value}===null)fail(Code.TypeMismatch,Region.Data);`;
      if (measure) {
        if (kind <= 11)
          code += scalarCheck(kind, value, s.u32(s.plan(target) + 28));
        else if (kind === 15) code += `this.mL${target}(${value},depth+1);`;
        else if (kind === 16)
          code += `this.used+=${s.u32(s.layout(target))};this.mL${target}(${value},depth+1);`;
        else code += `this.mP${target}(${value},depth+1);`;
      } else {
        if (kind === 15) code += `this.wL${target}(${value},anchor);`;
        else if (kind === 16) {
          const size = s.u32(s.layout(target));
          code += `const at${i}=${size ? "this.used" : "0"};this.used+=${size};`;
          if (s.u8(a + 5) >> 4)
            code += `compiledWriteSpan(this.doc,${slot},${s.u8(a + 5) >> 4},0,at${i},0);`;
          code += `this.wL${target}(${value},at${i});`;
        } else if (kind <= 11) code += store(kind, slot, value, s.u8(a + 6));
        else code += `this.wP${target}(${value},${slot});`;
        if (presence !== N) {
          const p = s.entry(6, presence);
          code += `this.doc.bytes[anchor+${s.u32(p)}]|=${s.u8(p + 4)};`;
        }
      }
      if (presence !== N) code += "}";
    }
    return code + "}";
  }
  function store(k: number, at: string, value: string, bit = 0): string {
    if (k === 11) return `this.doc.bytes[${at}]|=${value}?${1 << bit}:0;`;
    return `this.doc.dv.${["", "setInt8", "setUint8", "setInt16", "setUint16", "setInt32", "setUint32", "setBigInt64", "setBigUint64", "setFloat32", "setFloat64"][k]}(${at},${value}${width(k) > 1 ? ",true" : ""});`;
  }
  for (const li of layouts) {
    output.push(useLayout(li, true), useLayout(li, false));
  }
  for (const pi of plans) {
    const p = s.plan(pi),
      k = s.u8(p),
      child = s.u32(p + 20),
      limit = s.u32(p + 16);
    let m = `private mP${pi}(value:any,depth:number):void{`,
      w = `private wP${pi}(value:any,at:number,bit=0):void{`;
    if (k <= 11) {
      m += scalarCheck(k, "value", s.u32(p + 28));
      w +=
        k === 11
          ? "this.doc.bytes[at]|=value?1<<bit:0;"
          : store(k, "at", "value");
    } else if (k === 12) {
      m += `if(value===undefined)value="";if(typeof value!=='string')fail(Code.TypeMismatch,Region.Data);const n=utf8Length(value);if(n>${limit})fail(Code.BoundExceeded,Region.Data);this.used+=n;`;
      w += `if(value===undefined)value="";const base=this.used,n=writeUtf8Into(value,this.doc.bytes,base,${limit});this.used+=n;compiledWriteSpan(this.doc,at,${s.u8(p + 1)},${s.u8(p + 2)},n?base:0,n);`;
    } else if (k === 15 || k === 16) {
      const head = s.u32(s.layout(child));
      m += `this.work(depth);${k === 16 ? `this.used+=${head};` : ""}this.mL${child}(value,depth+1);`;
      w +=
        k === 15
          ? `this.wL${child}(value,at);`
          : `const base=${head ? "this.used" : "0"};this.used+=${head};compiledWriteSpan(this.doc,at,${s.u8(p + 1)},0,base,0);this.wL${child}(value,base);`;
    } else if (k === 13 || k === 14) {
      const packed = !!(s.u32(p + 4) & 1),
        stride = s.u32(p + 12),
        cp = s.plan(child),
        ck = s.u8(cp),
        size = packed ? "Math.ceil(n/8)" : `n*${stride}`,
        block = k === 13 ? `this.used+=${size};` : "",
        initial =
          k === 14
            ? `Array.from({length:${limit}},()=>undefined)`
            : "EMPTY_ARRAY";
      m += `if(value===undefined){${k === 14 ? `if(${limit}>this.maxNodes-this.nodes)fail(Code.WorkLimit,Region.Data);` : ""}value=${initial};}if(!Array.isArray(value)&&!(ArrayBuffer.isView(value)&&!(value instanceof DataView)))fail(Code.TypeMismatch,Region.Data);const items:any=value,n=items.length;this.work(depth,n);if(n>${limit}${k === 14 ? `||n!==${limit}` : ""})fail(Code.BoundExceeded,Region.Data);${block}for(let i=0;i<n;i++){${ck <= 11 ? scalarCheck(ck, "value[i]===undefined?" + (ck === 11 ? "false" : ck === 7 || ck === 8 ? "0n" : "0") + ":value[i]", s.u32(cp + 28)) : `this.mP${child}(items[i],depth+1);`}}`;
      // Avoid ternary operands in generated range checks; normalize values before checking.
      if (ck <= 11) {
        const begin = m.indexOf("for(let i=0;i<n;i++){");
        m =
          m.slice(0, begin) +
          `for(let i=0;i<n;i++){const item=items[i]===undefined?${ck === 11 ? "false" : ck === 7 || ck === 8 ? "0n" : "0"}:items[i];${scalarCheck(ck, "item", s.u32(cp + 28))}}`;
      }
      w += `if(value===undefined)value=${initial};const items:any=value,n=items.length,base=${k === 13 ? `(${size})?this.used:0` : "at"};${k === 13 ? `this.used+=${size};compiledWriteSpan(this.doc,at,${s.u8(p + 1)},${s.u8(p + 2)},base,n);` : ""}for(let i=0;i<n;i++){const item=items[i]===undefined?${ck === 11 ? "false" : ck === 7 || ck === 8 ? "0n" : ck <= 10 ? "0" : "undefined"}:items[i];${ck <= 11 ? (packed ? "this.doc.bytes[base+Math.floor(i/8)]|=item?1<<(i%8):0;" : store(ck, `base+i*${stride}`, "item")) : `this.wP${child}(item,base+i*${stride});`}}`;
    }
    output.push(m + "}", w + "}");
  }
  output.push("}");
  return defaults.join("\n") + "\n" + output.join("\n") + "\n";
}
