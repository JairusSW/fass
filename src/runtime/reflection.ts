import {Code,Region,NO_INDEX as N,extent,fail,Kind,readWord} from '../format.js';
import {Schema} from './schema.js';
import {ValueView} from './value.js';
export class TypeView {
  constructor(public readonly schema:Schema,public readonly index:number){schema.entry(11,index);}
  get kind():number{return this.schema.u8(this.schema.entry(11,this.index));}
  get bound():number{return this.schema.u32(this.schema.entry(11,this.index)+24);}
  get fieldCount():number{return this.schema.u32(this.schema.entry(11,this.index)+12);}
  name():string {return nameString(this.schema,this.schema.u32(this.schema.entry(11,this.index)+4));}
  field(slot:number):FieldDeclaration {const at=this.schema.entry(11,this.index);if(!Number.isInteger(slot)||slot<0||slot>=this.fieldCount)fail(Code.NotFound,Region.Schema);return new FieldDeclaration(this.schema,this.schema.u32(at+8)+slot);}
}
export class FieldDeclaration {
  constructor(public readonly schema:Schema,public readonly index:number){schema.entry(12,index);}
  get id():number{return this.schema.u32(this.schema.entry(12,this.index));}
  name():string{return nameString(this.schema,this.schema.u32(this.schema.entry(12,this.index)+4));}
  type():TypeView{return new TypeView(this.schema,this.schema.u32(this.schema.entry(12,this.index)+8));}
  default():LiteralView|undefined {const n=this.schema.u32(this.schema.entry(12,this.index)+16);return n===N?undefined:new LiteralView(this.schema,n);}
}
export class LiteralView {
  constructor(public readonly schema:Schema,public readonly index:number){schema.entry(13,index);}
  get kind():number{return this.schema.u8(this.schema.entry(13,this.index));}
  get childCount():number{return this.schema.u32(this.schema.entry(13,this.index)+8);}
  child(index:number):LiteralView {if(!Number.isInteger(index)||index<0||index>=this.childCount)fail(Code.NotFound,Region.Schema);const a=this.schema.entry(13,this.index),e=this.schema.entry(14,this.schema.u32(a+4)+index);return new LiteralView(this.schema,this.schema.u32(e+4));}
  label(index:number):number {if(index<0||index>=this.childCount)fail(Code.NotFound,Region.Schema);return this.schema.u32(this.schema.entry(14,this.schema.u32(this.schema.entry(13,this.index)+4)+index));}
  bytes():Uint8Array {const s=this.schema,a=s.entry(13,this.index);if(this.kind!==2)fail(Code.TypeMismatch,Region.Schema,a);const off=s.u32(a+12),len=s.u32(a+16),base=s.table(15);extent(s.count(15),off,len,Region.Schema);return s.bytes.subarray(base+off,base+off+len);}
  scalar():number|bigint|boolean {const s=this.schema,a=s.entry(13,this.index);if(this.kind!==1)fail(Code.TypeMismatch,Region.Schema,a);const k=s.u8(a+1),n=readWord(s.bytes,a+24,8,Region.Schema),w=[0,1,1,2,2,4,4,8,8][k];if(k===Kind.Bool)return n!==0n;if(k===Kind.F32)return s.dv.getFloat32(a+24,true);if(k===Kind.F64)return s.dv.getFloat64(a+24,true);const x=k%2===1?BigInt.asIntN(w*8,n):n;return w===8?x:Number(x);}
}
export function declaration(value:ValueView):FieldDeclaration {if(value.field===N)fail(Code.NotFound,Region.Schema);const s=value.doc.schema,l=s.layout(value.parentLayout),t=s.entry(11,s.u32(l+12)),slot=value.field-s.u32(l+4);return new FieldDeclaration(s,s.u32(t+8)+slot);}
export function nameString(s:Schema,refIndex:number):string {if(refIndex===N)return '';const aux=s.u32(56),count=s.u32(60);extent(s.bytes.length,aux,count*16,Region.Schema);for(let i=0;i<count;i++){const a=aux+i*16;if(s.dv.getUint16(a,true)!==0x8002)continue;const n=s.u32(a+12);if(refIndex>=n)fail(Code.Malformed,Region.Schema,a);const ref=s.u32(a+4)+refIndex*8;const off=s.u32(ref),len=s.u32(ref+4);extent(s.bytes.length,off,len,Region.Schema);return new TextDecoder('utf-8',{fatal:true}).decode(s.bytes.subarray(off,off+len));}return fail(Code.NotFound,Region.Schema);}
