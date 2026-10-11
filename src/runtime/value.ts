import {Kind,Code,Region,NO_INDEX as N,extent,fail,width,view,readWord,writeWord,readSpan} from '../format.js';
import {Schema,openSchema} from './schema.js';
const encoder=new TextEncoder();const decoder=new TextDecoder('utf-8',{fatal:true});
export type Scalar=number|bigint|boolean;
/** Caller can retain these views; convenience field/record/array methods allocate wrappers. */
export class Document {
  schema!:Schema;bytes:Uint8Array=new Uint8Array();dv:DataView=new DataView(new ArrayBuffer(0));writable=false;
  open(bytes:Uint8Array,schema:Schema,writable=false):this {this.schema=schema;this.bytes=bytes;this.dv=view(bytes);this.writable=writable;if(bytes.length>schema.maxBytes)fail(Code.BoundExceeded,Region.Data);const l=schema.layout(schema.root);if(schema.u32(l+24)!==1)fail(Code.Malformed,Region.Schema,l);extent(bytes.length,0,schema.u32(l),Region.Data);return this;}
  rootInto(out:RecordView):RecordView {return out.bind(this,this.schema.root,0,false);}
  root():RecordView {return this.rootInto(new RecordView());}
}
export function open(bytes:Uint8Array,schema:Schema,writable=false):Document {return new Document().open(bytes,schema,writable);}
export function openBuffers(bytes:Uint8Array,schema:Uint8Array,writable=false):Document {return open(bytes,openSchema(schema),writable);}
export class RecordView {
  doc!:Document;layout=0;anchor=0;readOnly=false;
  bind(doc:Document,layout:number,anchor:number,readOnly:boolean):this {const l=doc.schema.layout(layout);extent(doc.bytes.length,anchor,doc.schema.u32(l),Region.Data);this.doc=doc;this.layout=layout;this.anchor=anchor;this.readOnly=readOnly;return this;}
  atSlotInto(slot:number,out:ValueView):ValueView {return out.bindField(this,this.doc.schema.slot(this.layout,slot));}
  fieldBytesInto(name:Uint8Array,out:ValueView):ValueView {return out.bindField(this,this.doc.schema.byName(this.layout,name));}
  fieldByIDInto(id:number,out:ValueView):ValueView {return out.bindField(this,this.doc.schema.byID(this.layout,id));}
  atSlot(slot:number):ValueView {return this.atSlotInto(slot,new ValueView());}
  field(name:string):ValueView {return this.fieldBytesInto(encoder.encode(name),new ValueView());}
  fieldByID(id:number):ValueView {return this.fieldByIDInto(id,new ValueView());}
}
export class ValueView {
  doc!:Document;kind=0;offset=0;anchor=0;field=N;target=N;presence=N;bit=0;flags=0;planIndex=N;parentLayout=N;
  bindField(record:RecordView,field:number):this {
    const s=record.doc.schema,at=s.access(field),link=s.entry(3,field);this.doc=record.doc;this.field=field;this.anchor=record.anchor;this.offset=record.anchor+s.u32(at);this.kind=s.u8(at+4);this.flags=s.u8(at+5)|(record.readOnly?2:0);this.bit=s.u8(at+6);this.target=s.u32(link);this.presence=s.u32(link+4);this.parentLayout=record.layout;this.planIndex=this.kind===Kind.Record||this.kind===Kind.Ref?N:this.target;
    const layout=s.layout(record.layout),head=s.u32(layout),relative=this.offset-this.anchor;
    const size=this.kind<=11?width(this.kind):this.kind===Kind.Record?0:this.kind===Kind.FixedArray?s.u32(s.plan(this.target)+8):s.u8(at+5)>>4;
    extent(head,relative,size,Region.Schema);extent(this.doc.bytes.length,this.offset,size,Region.Data);
    if(this.planIndex!==N){const p=s.plan(this.planIndex);if(s.u8(p)!==this.kind)fail(Code.Malformed,Region.Schema,p);if(this.kind<=11&&(s.u8(p+1)!==width(this.kind)||s.u32(p+8)!==width(this.kind)))fail(Code.Malformed,Region.Schema,p);if([12,13,17].includes(this.kind)&&(s.u8(p+1)!==(s.u8(at+5)>>4)||s.u8(p+2)!==s.u8(at+6)||s.u8(p+3)!==s.u8(at+7)))fail(Code.Malformed,Region.Schema,p);}
    if(this.presence!==N){const p=s.entry(6,this.presence);extent(head,s.u32(p),1,Region.Schema);extent(this.doc.bytes.length,this.anchor+s.u32(p),1,Region.Data);}return this;
  }
  bindPlan(doc:Document,plan:number,offset:number,readOnly=false,bit=0):this {const p=doc.schema.plan(plan);this.doc=doc;this.kind=doc.schema.u8(p);this.offset=offset;this.anchor=offset;this.planIndex=plan;this.target=this.kind===Kind.Record||this.kind===Kind.Ref?doc.schema.u32(p+20):plan;this.field=N;this.presence=N;this.flags=readOnly?2:0;this.bit=bit;this.parentLayout=N;extent(doc.bytes.length,offset,doc.schema.u32(p+8),Region.Data);return this;}
  isPresent():boolean {if(this.presence===N)return true;const s=this.doc.schema,p=s.entry(6,this.presence);return !!(this.doc.bytes[this.anchor+s.u32(p)]&s.u8(p+4));}
  require():void {if(!this.isPresent())fail(Code.Absent,Region.Data,this.offset);}
  writable():void {if(!this.doc.writable||this.flags&2)fail(Code.ReadOnly,Region.Data,this.offset);}
  scalar():Scalar {this.require();const k=this.kind,v=this.doc.dv,p=this.offset;switch(k){case 1:return v.getInt8(p);case 2:return v.getUint8(p);case 3:return v.getInt16(p,true);case 4:return v.getUint16(p,true);case 5:return v.getInt32(p,true);case 6:return v.getUint32(p,true);case 7:return v.getBigInt64(p,true);case 8:return v.getBigUint64(p,true);case 9:return v.getFloat32(p,true);case 10:return v.getFloat64(p,true);case 11:return !!(this.doc.bytes[p]&(1<<this.bit));default:return fail(Code.TypeMismatch,Region.Data,p);}}
  u32():number {if(this.kind!==Kind.U32)fail(Code.TypeMismatch,Region.Data,this.offset);this.require();return this.doc.dv.getUint32(this.offset,true);}
  scalarBits():bigint {this.require();if(this.kind<1||this.kind>10)fail(Code.TypeMismatch,Region.Data,this.offset);return readWord(this.doc.bytes,this.offset,width(this.kind));}
  checkScalar(value:Scalar):void {
    const k=this.kind;if(k===11){if(typeof value!=='boolean')fail(Code.TypeMismatch,Region.Data,this.offset);return;}if(k===9||k===10){if(typeof value!=='number')fail(Code.TypeMismatch,Region.Data,this.offset);return;}if(k<1||k>8)fail(Code.TypeMismatch,Region.Data,this.offset);
    if(typeof value==='boolean'||typeof value==='number'&&!Number.isSafeInteger(value))fail(Code.BoundExceeded,Region.Data,this.offset);
    const n=BigInt(value),w=width(k),signed=k%2===1,min=signed?-(1n<<BigInt(w*8-1)):0n,max=signed?(1n<<BigInt(w*8-1))-1n:(1n<<BigInt(w*8))-1n;if(n<min||n>max)fail(Code.BoundExceeded,Region.Data,this.offset);
    const s=this.doc.schema,p=s.plan(this.planIndex),rule=s.u32(p+28);if(rule===N)return;const r=s.entry(7,rule);if(s.u8(r+1)!==k||s.dv.getUint16(r+2,true)||s.u32(r+12))fail(Code.Malformed,Region.Schema,r);
    const decode=(x:bigint)=>signed?BigInt.asIntN(w*8,x):x;
    if(s.u8(r)===1){const lo=readWord(s.bytes,r+16,8,Region.Schema),hi=readWord(s.bytes,r+24,8,Region.Schema);if(lo>>BigInt(w*8)||hi>>BigInt(w*8)||decode(lo)>decode(hi))fail(Code.Malformed,Region.Schema,r);if(n<decode(lo)||n>decode(hi))fail(Code.BoundExceeded,Region.Data,this.offset);}
    else if(s.u8(r)===2){const first=s.u32(r+4),count=s.u32(r+8);if(!count||count>1000000)fail(Code.WorkLimit,Region.Schema,r);let found=false,prev:bigint|undefined;for(let i=0;i<count;i++){const x=readWord(s.bytes,s.entry(8,first+i),8,Region.Schema);if(x>>BigInt(w*8))fail(Code.Malformed,Region.Schema,r);const v=decode(x);if(prev!==undefined&&v<=prev)fail(Code.Malformed,Region.Schema,r);prev=v;if(v===n)found=true;}if(!found)fail(Code.BoundExceeded,Region.Data,this.offset);}
    else fail(Code.Malformed,Region.Schema,r);
  }
  setScalar(value:Scalar):void {this.writable();this.require();this.checkScalar(value);const v=this.doc.dv,p=this.offset,k=this.kind;if(k===11){this.doc.bytes[p]=(this.doc.bytes[p]&~(1<<this.bit))|(value?1<<this.bit:0);return;}if(k===9){v.setFloat32(p,value as number,true);return;}if(k===10){v.setFloat64(p,value as number,true);return;}writeWord(this.doc.bytes,p,width(k),BigInt.asUintN(width(k)*8,BigInt(value)));}
  setScalarBits(bits:bigint):void {this.writable();this.require();if(this.kind!==Kind.F32&&this.kind!==Kind.F64)fail(Code.TypeMismatch,Region.Data,this.offset);writeWord(this.doc.bytes,this.offset,width(this.kind),bits);}
  setU32(value:number):void {if(this.kind!==Kind.U32)fail(Code.TypeMismatch,Region.Data,this.offset);this.setScalar(value);}
  recordInto(out:RecordView):RecordView {
    this.require();const s=this.doc.schema;if(this.kind!==Kind.Record&&this.kind!==Kind.Ref)fail(Code.TypeMismatch,Region.Data,this.offset);const l=s.layout(this.target);let anchor=this.anchor;
    if(this.kind===Kind.Record){if(this.field!==N){const parent=s.layout(this.parentLayout);if(s.u32(l+24)!==2||s.u32(l+20)!==this.parentLayout||s.u32(l+16)!==s.u32(parent+16)||s.u32(l)!==s.u32(parent))fail(Code.Malformed,Region.Schema,l);}else {if(s.u32(l+24)!==1)fail(Code.Malformed,Region.Schema,l);anchor=this.offset;}}
    else {if(s.u32(l+24)!==1)fail(Code.Malformed,Region.Schema,l);const d=this.field===N?s.u8(s.plan(this.planIndex)+1):s.u8(s.access(this.field)+5)>>4;anchor=Number(readWord(this.doc.bytes,this.offset,d));if(s.u32(l)&&anchor===0)fail(Code.Malformed,Region.Data,this.offset);}
    return out.bind(this.doc,this.target,anchor,!!(this.flags&2));
  }
  record():RecordView {return this.recordInto(new RecordView());}
  spanInto(out:Span):Span {
    this.require();if(![12,13,17].includes(this.kind))fail(Code.TypeMismatch,Region.Data,this.offset);const s=this.doc.schema,p=s.plan(this.planIndex);const [offset,count]=readSpan(this.doc.bytes,this.offset,s.u8(p+1),s.u8(p+2),s.u8(p+3),s.u32(p+16));const stride=this.kind===12?1:s.u32(p+12),bytes=this.kind===13&&s.u32(p+4)&1?Math.ceil(count/8):count*stride;
    if(this.kind!==17){if((count===0||bytes===0)&&offset!==0||bytes>0&&offset===0)fail(Code.Malformed,Region.Data,this.offset);extent(this.doc.bytes.length,offset,bytes,Region.Data);}out.offset=offset;out.count=count;return out;
  }
  bytes():Uint8Array {if(this.kind!==12)fail(Code.TypeMismatch,Region.Data,this.offset);const p=this.spanInto(new Span());return this.doc.bytes.subarray(p.offset,p.offset+p.count);}
  string():string {try{return decoder.decode(this.bytes());}catch(e){if(e instanceof TypeError)fail(Code.Malformed,Region.Data,this.offset);throw e;}}
  arrayInto(out:ArrayView):ArrayView {this.require();if(this.kind!==13&&this.kind!==14)fail(Code.TypeMismatch,Region.Data,this.offset);const s=this.doc.schema,p=s.plan(this.planIndex);out.doc=this.doc;out.child=s.u32(p+20);out.stride=s.u32(p+12);out.packed=!!(s.u32(p+4)&1);out.readOnly=!!(this.flags&2);if(this.kind===13){const span=this.spanInto(out);out.offset=span.offset;out.count=span.count;}else {out.offset=this.offset;out.count=s.u32(p+16);extent(this.doc.bytes.length,out.offset,out.packed?Math.ceil(out.count/8):out.count*out.stride,Region.Data);}const child=s.plan(out.child);if(out.packed?s.u8(child)!==Kind.Bool:out.stride!==s.u32(child+8))fail(Code.Malformed,Region.Schema,p);return out;}
  array():ArrayView {return this.arrayInto(new ArrayView());}
}
export class Span {offset=0;count=0;}
export class ArrayView extends Span {doc!:Document;child=0;stride=0;packed=false;readOnly=false;
  atInto(index:number,out:ValueView):ValueView {if(!Number.isInteger(index)||index<0||index>=this.count)fail(Code.BoundExceeded,Region.Data,this.offset,index);return out.bindPlan(this.doc,this.child,this.offset+(this.packed?Math.floor(index/8):index*this.stride),this.readOnly,this.packed?index%8:0);}
  at(index:number):ValueView {return this.atInto(index,new ValueView());}
}
export function openEnvelope(bytes:Uint8Array,schema:Schema,writable=false):Document {extent(bytes.length,0,24,Region.Data);const v=view(bytes);if(v.getUint32(0,true)!==0x32534146||v.getUint32(4,true)!==bytes.length-24)fail(Code.Malformed,Region.Data);for(let i=0;i<16;i++)if(bytes[8+i]!==schema.bytes[16+i])fail(Code.SchemaMismatch,Region.Data,8);return open(bytes.subarray(24),schema,writable);}
export function envelopeInto(doc:Document,destination:Uint8Array):number {if(destination.length<doc.bytes.length+24)fail(Code.NeedCapacity,Region.Data);destination.set(encoder.encode('FAS2'));view(destination).setUint32(4,doc.bytes.length,true);destination.set(doc.schema.bytes.subarray(16,32),8);destination.set(doc.bytes,24);return doc.bytes.length+24;}
