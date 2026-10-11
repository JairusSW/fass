import {Code,Kind,Region,fail,NO_INDEX as N} from '../format.js';
import {Document,RecordView,ValueView} from './value.js';
import {MapView} from './map.js';
import {TypeView} from './reflection.js';
import {encodeInto,BuildOptions} from './build.js';
import {verifyMessage,Limits} from './verify.js';
/** Explicit conversion to native strings, arrays, records and Map objects. */
export function decode(doc:Document,limits:Limits={}):Record<string,unknown> {
  let nodes=0;function tick(depth:number):void {if(++nodes>(limits.maxNodes??1000000)||depth>(limits.maxDepth??128))fail(Code.WorkLimit,Region.Data);}
  function record(r:RecordView,depth:number):Record<string,unknown>{tick(depth);const s=doc.schema,l=s.layout(r.layout),t=new TypeView(s,s.u32(l+12)),out:Record<string,unknown>={};for(let i=0;i<s.u32(l+8);i++){const v=r.atSlot(i);if(v.isPresent())out[t.field(i).name()]=value(v,depth+1);}return out;}
  function value(v:ValueView,depth:number):unknown {tick(depth);if(v.kind<=11)return v.scalar();if(v.kind===12)return v.string();if(v.kind===15||v.kind===16)return record(v.record(),depth+1);if(v.kind===13||v.kind===14){const a=v.array();if(a.count>(limits.maxNodes??1000000)-nodes)fail(Code.WorkLimit,Region.Data);return Array.from({length:a.count},(_,i)=>value(a.at(i),depth+1));}if(v.kind===17){const m=new MapView().bind(v),out=new Map();if(m.buckets>(limits.maxNodes??1000000)-nodes)fail(Code.WorkLimit,Region.Data);for(let b=0;b<m.buckets;b++)if(doc.bytes[m.controls+b]>=128){const e=m.entry(b);out.set(value(e.atSlot(0),depth+1),value(e.atSlot(1),depth+1));}return out;}fail(Code.TypeMismatch,Region.Data);}
  return record(doc.root(),0);
}
/** Canonical construction from bit-level data. Uses supplied output; native conversion is explicit here. */
export function canonicalizeInto(doc:Document,destination:Uint8Array,scratch:Uint32Array,limits:Limits={}):number {
  if(doc.bytes.buffer===destination.buffer)fail(Code.NeedCapacity,Region.Data);verifyMessage(doc,scratch,limits);const native=decode(doc,limits),size=encodeInto(doc.schema,native,destination,limits as BuildOptions);
  // Keep float payload bits (including NaNs) through the materializing reference implementation.
  const target=new Document().open(destination.subarray(0,size),doc.schema,true);
  function copyRecords(a:RecordView,b:RecordView,depth:number):void {if(depth>(limits.maxDepth??128))fail(Code.WorkLimit,Region.Data);const s=doc.schema,l=s.layout(a.layout);for(let i=0;i<s.u32(l+8);i++){const av=a.atSlot(i),bv=b.atSlot(i);if(av.isPresent())copyValues(av,bv,depth+1);}}
  function copyValues(a:ValueView,b:ValueView,depth:number):void {if(depth>(limits.maxDepth??128))fail(Code.WorkLimit,Region.Data);if(a.kind===9||a.kind===10)b.setScalarBits(a.scalarBits());else if(a.kind===15||a.kind===16)copyRecords(a.record(),b.record(),depth+1);else if(a.kind===13||a.kind===14){const aa=a.array(),bb=b.array();for(let i=0;i<aa.count;i++)copyValues(aa.at(i),bb.at(i),depth+1);}else if(a.kind===17){const am=new MapView().bind(a),bm=new MapView().bind(b);for(let i=0;i<am.buckets;i++)if(doc.bytes[am.controls+i]>=128){const e=am.entry(i),key=e.atSlot(0);copyValues(e.atSlot(1),bm.find(key.kind===12?key.string():key.scalar() as number|bigint).atSlot(1),depth+1);}}}
  copyRecords(doc.root(),target.root(),0);return size;
}
/** Explicit migration by stable field IDs. New defaults are initialized by the destination builder. */
export function migrateInto(doc:Document,targetSchema:Document['schema'],destination:Uint8Array,limits:Limits={}):number {
  let nodes=0;function record(source:RecordView,targetLayout:number,depth:number):Record<string,unknown>{if(++nodes>(limits.maxNodes??1000000)||depth>(limits.maxDepth??128))fail(Code.WorkLimit,Region.Data);const s=targetSchema,l=s.layout(targetLayout),t=new TypeView(s,s.u32(l+12)),out:Record<string,unknown>={};for(let i=0;i<s.u32(l+8);i++){const fd=t.field(i);let old:ValueView;try{old=source.fieldByID(fd.id);}catch(e){if((e as {code:number}).code===Code.NotFound)continue;throw e;}if(!old.isPresent())continue;const fi=s.slot(targetLayout,i),a=s.access(fi),kind=s.u8(a+4),link=s.entry(3,fi);if(old.kind!==kind)fail(Code.TypeMismatch,Region.Data,old.offset);if(kind===15||kind===16)out[fd.name()]=record(old.record(),s.u32(link),depth+1);else if(kind<=11)out[fd.name()]=old.scalar();else if(kind===12)out[fd.name()]=old.string();else fail(Code.TypeMismatch,Region.Data,old.offset);}return out;}return encodeInto(targetSchema,record(doc.root(),targetSchema.root,0),destination,limits);
}
