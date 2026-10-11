import {Code,Region,Kind,fail} from '../format.js';
import {Schema} from './schema.js';
import {RecordView,ValueView,Document} from './value.js';
/** Resolution is explicit setup. Each pair in caller storage is [layout,physicalFieldIndex]. */
export class U32Path {
  length=0;start=0;schema!:Schema;steps!:Uint32Array;
  resolve(schema:Schema,path:readonly Uint8Array[],steps:Uint32Array,start=schema.root):this {
    if(path.length*2>steps.length)fail(Code.NeedScratch,Region.Schema);if(!path.length)fail(Code.NotFound,Region.Schema);let layout=start;
    for(let i=0;i<path.length;i++){const fi=schema.byName(layout,path[i]),a=schema.access(fi),kind=schema.u8(a+4);steps[i*2]=layout;steps[i*2+1]=fi;if(i===path.length-1){if(kind!==Kind.U32)fail(Code.TypeMismatch,Region.Schema,a);}else{if(kind!==Kind.Record&&kind!==Kind.Ref)fail(Code.TypeMismatch,Region.Schema,a);layout=schema.u32(schema.entry(3,fi));schema.layout(layout);}}
    this.schema=schema;this.steps=steps;this.length=path.length;this.start=start;return this;
  }
  bindInto(record:RecordView,out:U32Reference,recordScratch:RecordView,valueScratch:ValueView):U32Reference {
    if(record.doc.schema!==this.schema||record.layout!==this.start)fail(Code.SchemaMismatch,Region.Schema);recordScratch.bind(record.doc,record.layout,record.anchor,record.readOnly);
    for(let i=0;i<this.length;i++){valueScratch.bindField(recordScratch,this.steps[i*2+1]);valueScratch.require();if(i<this.length-1)valueScratch.recordInto(recordScratch);}
    out.doc=record.doc;out.offset=valueScratch.offset;out.readOnly=!record.doc.writable||!!(valueScratch.flags&2);out.plan=valueScratch.planIndex;return out;
  }
}
/** Valid until relevant presence/structure changes. Caller owns that lifetime. */
export class U32Reference {
  doc!:Document;offset=0;readOnly=true;plan=0;
  get():number {return this.doc.dv.getUint32(this.offset,true);}
  set(value:number):void {if(this.readOnly)fail(Code.ReadOnly,Region.Data,this.offset);if(!Number.isInteger(value)||value<0||value>0xffffffff)fail(Code.BoundExceeded,Region.Data,this.offset);const p=this.doc.schema.plan(this.plan);if(this.doc.schema.u32(p+28)!==0xffffffff){const v=new ValueView();v.doc=this.doc;v.kind=Kind.U32;v.offset=this.offset;v.planIndex=this.plan;v.checkScalar(value);}this.doc.dv.setUint32(this.offset,value,true);}
}
export function resolveU32(schema:Schema,path:string):U32Path {const names=path.split('.').map(n=>new TextEncoder().encode(n));return new U32Path().resolve(schema,names,new Uint32Array(names.length*2));}
