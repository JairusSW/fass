import {Code,Region,Kind,NO_INDEX as N,fail,extent,width,readWord,writeWord,writeSpan,power2} from '../format.js';
import {Schema} from './schema.js';
import {Document,ValueView,RecordView,Scalar} from './value.js';
import {FieldDeclaration,LiteralView,TypeView,nameString} from './reflection.js';
import {xxh64} from '../hash.js';
/** Bounded arena. It owns only the reservations it makes. No capacity inference from received spans. */
export class Arena {
  used:number;
  constructor(public readonly bytes:Uint8Array,public readonly schema:Schema,start=0){this.used=start;if(start<0||start>bytes.length||bytes.length>schema.maxBytes)fail(Code.BoundExceeded,Region.Data);}
  reserve(size:number):number {if(!Number.isSafeInteger(size)||size<0||size>this.bytes.length-this.used)fail(Code.NeedCapacity,Region.Data,this.used,size);const at=this.used;this.used+=size;this.bytes.fill(0,at,this.used);return at;}
  replaceBytes(value:ValueView,bytes:Uint8Array):void {
    value.writable();value.require();if(value.doc.schema!==this.schema||value.doc.bytes.buffer!==this.bytes.buffer||value.doc.bytes.byteOffset!==this.bytes.byteOffset||value.kind!==Kind.Utf8)fail(Code.TypeMismatch,Region.Data,value.offset);
    const s=this.schema,p=s.plan(value.planIndex),limit=s.u32(p+16);if(bytes.length>limit)fail(Code.BoundExceeded,Region.Data,value.offset);const saved=this.used;try{const at=bytes.length?this.reserve(bytes.length):0;this.bytes.set(bytes,at);writeSpan(this.bytes,value.offset,s.u8(p+1),s.u8(p+2),s.u8(p+3),at,bytes.length,limit);}catch(e){this.bytes.fill(0,saved,this.used);this.used=saved;throw e;}
  }
}
export class FloatBits {
  constructor(public readonly kind:Kind.F32|Kind.F64,public readonly bits:bigint){}
}
export interface BuildOptions {maxNodes?:number;maxDepth?:number;}
/** Explicit native-object construction. These APIs may allocate JS traversal objects; destination never grows. */
export function measure(schema:Schema,value:unknown,options:BuildOptions={}):number {return construct(schema,value,undefined,options);}
export function encodeInto(schema:Schema,value:unknown,destination:Uint8Array,options:BuildOptions={}):number {
  const size=measure(schema,value,options);if(size>destination.length||size>schema.maxBytes)fail(Code.NeedCapacity,Region.Data,0,size);
  destination.fill(0,0,size);construct(schema,value,destination.subarray(0,size),options);return size;
}
export function encode(schema:Schema,value:unknown,options:BuildOptions={}):Uint8Array {const bytes=new Uint8Array(measure(schema,value,options));encodeInto(schema,value,bytes,options);return bytes;}
function literalNative(l:LiteralView,type:TypeView,depth=0):unknown {
  if(depth>128)fail(Code.WorkLimit,Region.Schema);if(l.kind===6)return null;if(l.kind===1)return l.scalar();if(l.kind===2)return new TextDecoder('utf-8',{fatal:true}).decode(l.bytes());
  const s=l.schema,t=s.entry(11,type.index);if(l.kind===3){const o:Record<string,unknown>={};for(let i=0;i<l.childCount;i++){const id=l.label(i);let field:FieldDeclaration|undefined;for(let j=0;j<type.fieldCount;j++){const f=type.field(j);if(f.id===id){field=f;break;}}if(!field)fail(Code.Malformed,Region.Schema);o[field.name()]=literalNative(l.child(i),field.type(),depth+1);}return o;}
  if(l.kind===4){const child=new TypeView(s,s.u32(t+16));return Array.from({length:l.childCount},(_,i)=>literalNative(l.child(i),child,depth+1));}
  if(l.kind===5){const key=new TypeView(s,s.u32(t+16)),value=new TypeView(s,s.u32(t+20));return Array.from({length:l.childCount},(_,i)=>{const e=l.child(i);return [literalNative(e.child(0),key,depth+1),literalNative(e.child(1),value,depth+1)];});}
  fail(Code.Malformed,Region.Schema);
}
export function materializeDefault(field:FieldDeclaration):unknown {const l=field.default();return l?literalNative(l,field.type()):undefined;}
function construct(s:Schema,input:unknown,bytes:Uint8Array|undefined,options:BuildOptions):number {
  const root=s.layout(s.root);let used=s.u32(root),nodes=0;const fakeDoc=new Document();fakeDoc.schema=s;
  function reserve(size:number):number {if(!Number.isSafeInteger(size)||size<0||used+size>s.maxBytes)fail(Code.NeedCapacity,Region.Data,used,size);const at=used;used+=size;return size?at:0;}
  const check=(depth:number)=>{if(++nodes>(options.maxNodes??1000000)||depth>(options.maxDepth??128))fail(Code.WorkLimit,Region.Data);};
  function record(layout:number,anchor:number,value:unknown,depth:number):void {
    check(depth);if(value===undefined)value={};if(!value||typeof value!=='object'||Array.isArray(value)||value instanceof Map)fail(Code.TypeMismatch,Region.Data,anchor);
    const l=s.layout(layout),first=s.u32(l+4),count=s.u32(l+8),logical=s.u32(l+12),td=s.entry(11,logical),declFirst=s.u32(td+8),known=new Set<string>();
    for(let i=0;i<count;i++){const a=s.access(first+i),link=s.entry(3,first+i),fd=new FieldDeclaration(s,declFirst+i),name=fd.name();known.add(name);let v=(value as Record<string,unknown>)[name];if(v===undefined)v=materializeDefault(fd);const presence=s.u32(link+4),kind=s.u8(a+4);if(v===undefined||v===null){if(presence!==N)continue;if(v===null)fail(Code.TypeMismatch,Region.Data,anchor);}
      write(kind,s.u32(link),kind===15||kind===16?N:s.u32(link),anchor+s.u32(a),anchor,s.u8(a+6),v,depth+1);
      if(presence!==N&&bytes){const p=s.entry(6,presence);bytes[anchor+s.u32(p)]|=s.u8(p+4);}
    }
    for(const key of Object.keys(value))if(!known.has(key))throw Error(`Unknown field ${key}`);
  }
  function span(p:number,offset:number,at:number,count:number):void {if(bytes)writeSpan(bytes,offset,s.u8(p+1),s.u8(p+2),s.u8(p+3),at,count,s.u32(p+16));}
  function write(kind:number,target:number,pi:number,offset:number,anchor:number,bit:number,value:unknown,depth:number):void {
    check(depth);if(kind<=11){if(value instanceof FloatBits){if(kind!==value.kind||value.bits<0n||value.bits>=(1n<<BigInt(width(kind)*8)))fail(Code.TypeMismatch,Region.Data,offset);if(bytes)writeWord(bytes,offset,width(kind),value.bits);return;}if(value===undefined)value=kind===11?false:0;const vv=new ValueView();vv.doc=fakeDoc;vv.kind=kind;vv.planIndex=pi;vv.offset=offset;vv.bit=bit;vv.checkScalar(value as Scalar);if(bytes){if(kind===11){if(value)bytes[offset]|=1<<bit;}else if(kind===9||kind===10){const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.length);if(kind===9)v.setFloat32(offset,Number(value),true);else v.setFloat64(offset,Number(value),true);}else writeWord(bytes,offset,width(kind),BigInt.asUintN(width(kind)*8,BigInt(value as bigint)));}return;}
    if(kind===Kind.Record){record(target,anchor,value,depth+1);return;}
    if(kind===Kind.Ref){const l=s.layout(target),size=s.u32(l),at=reserve(size);if(bytes)writeWord(bytes,offset,size?Math.ceil(Math.log2(s.maxBytes)/8):0,BigInt(at));record(target,at,value,depth+1);return;}
    const p=s.plan(pi),limit=s.u32(p+16);
    if(kind===Kind.Utf8){if(value===undefined)value='';if(typeof value!=='string')fail(Code.TypeMismatch,Region.Data,offset);const b=new TextEncoder().encode(value);if(b.length>limit)fail(Code.BoundExceeded,Region.Data,offset);const at=reserve(b.length);if(bytes)bytes.set(b,at);span(p,offset,at,b.length);return;}
    if(kind===13||kind===14){if(value===undefined){if(kind===14&&limit>(options.maxNodes??1000000)-nodes)fail(Code.WorkLimit,Region.Data);value=kind===14?Array.from({length:limit},()=>undefined):[];}if(!Array.isArray(value)&&!(value instanceof Uint8Array))fail(Code.TypeMismatch,Region.Data,offset);const values=value as unknown[],n=values.length;if(n>(options.maxNodes??1000000)-nodes)fail(Code.WorkLimit,Region.Data);if(n>limit||kind===14&&n!==limit)fail(Code.BoundExceeded,Region.Data,offset,n);const packed=!!(s.u32(p+4)&1),stride=s.u32(p+12),child=s.u32(p+20),cp=s.plan(child),size=packed?Math.ceil(n/8):n*stride,at=kind===13?reserve(size):offset;if(kind===13)span(p,offset,at,n);for(let i=0;i<n;i++){const pos=at+(packed?Math.floor(i/8):i*stride);write(s.u8(cp),s.u8(cp)===15||s.u8(cp)===16?s.u32(cp+20):child,child,pos,pos,packed?i%8:0,values[i],depth+1);}return;}
    if(kind===17){if(value===undefined)value=[];let entries:unknown[][];if(value instanceof Map)entries=[...value.entries()];else if(Array.isArray(value))entries=value;else fail(Code.TypeMismatch,Region.Data,offset);if(entries.length>limit)fail(Code.BoundExceeded,Region.Data,offset);const mp=s.entry(5,s.u32(p+20)),kp=s.plan(s.u32(mp+4)),keyKind=s.u8(kp),keyWidth=width(keyKind),keys=entries.map(pair=>{if(!Array.isArray(pair)||pair.length!==2)fail(Code.TypeMismatch,Region.Data);let key:Uint8Array;if(keyKind===12){if(typeof pair[0]!=='string')fail(Code.TypeMismatch,Region.Data);key=new TextEncoder().encode(pair[0]);if(key.length>s.u32(kp+16))fail(Code.BoundExceeded,Region.Data);}else{const vv=new ValueView();vv.doc=fakeDoc;vv.kind=keyKind;vv.planIndex=s.u32(mp+4);vv.checkScalar(pair[0] as Scalar);key=new Uint8Array(keyWidth);writeWord(key,0,keyWidth,BigInt.asUintN(keyWidth*8,BigInt(pair[0] as bigint)));}return {pair,key};});
      keys.sort((a,b)=>keyKind===12?compareBytes(a.key,b.key):BigInt(a.pair[0] as bigint)<BigInt(b.pair[0] as bigint)?-1:BigInt(a.pair[0] as bigint)>BigInt(b.pair[0] as bigint)?1:0);for(let i=1;i<keys.length;i++)if(compareBytes(keys[i-1].key,keys[i].key)===0)fail(Code.Malformed,Region.Data,offset);
      const n=keys.length;if(!n){span(p,offset,0,0);return;}const cw=s.u8(mp+24),iw=s.u8(mp+25),placement=s.u8(mp+26),stride=s.u32(mp+16),groups=power2(Math.ceil(n/7)),buckets=8*groups,size=cw+buckets+(placement?buckets*iw+n*stride:buckets*stride),at=reserve(size),controls=at+cw,ids=controls+buckets,heads=ids+(placement?buckets*iw:0),occupied=new Set<number>();if(bytes)writeWord(bytes,at,cw,BigInt(n));
      const layout=s.u32(mp),el=s.layout(layout),first=s.u32(el+4);for(let i=0;i<n;i++){const h=xxh64(keys[i].key),g=Number((h>>7n)&BigInt(groups-1));let bucket=-1;for(let j=0;j<groups&&bucket<0;j++){const group=(g+j*(j+1)/2)&(groups-1);for(let k=0;k<8;k++)if(!occupied.has(group*8+k)){bucket=group*8+k;break;}}if(bucket<0)fail(Code.NeedCapacity,Region.Data);occupied.add(bucket);const head=heads+(placement?i:bucket)*stride;if(bytes){bytes[controls+bucket]=Number(h&127n)|128;if(placement)writeWord(bytes,ids+bucket*iw,iw,BigInt(i));}for(let j=0;j<2;j++){const a=s.access(first+j),link=s.entry(3,first+j),k=s.u8(a+4);write(k,s.u32(link),k===15||k===16?N:s.u32(link),head+s.u32(a),head,s.u8(a+6),keys[i].pair[j],depth+1);}}
      span(p,offset,at,n);return;
    }
    fail(Code.TypeMismatch,Region.Data,offset);
  }
  record(s.root,0,input,0);return used;
}
export function compareBytes(a:Uint8Array,b:Uint8Array):number {for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;}
