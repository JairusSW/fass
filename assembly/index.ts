// fass pointer API. Allocate views during caller setup, then reuse them.
// All image offsets are relative to their respective schema or data base.
export enum Code { Ok, Absent, NotFound, TypeMismatch, BoundExceeded, NeedCapacity, NeedScratch, WorkLimit, ReadOnly, SchemaMismatch, Malformed }
export enum Kind { I8=1,U8,I16,U16,I32,U32,I64,U64,F32,F64,Bool,Utf8,Array,FixedArray,Record,Ref,Map }
export const NO_INDEX:u32=0xffffffff;
@inline function fits(length:u32,offset:u64,size:u64):bool {return offset<=length&&size<=<u64>length-offset;}
@inline function addressable(base:usize,length:u32):bool {return <u64>base+length<=<u64>memory.size()*65536;}
@inline function recordSize(kind:u32):u32 {if(kind==1||kind==4||kind==5||kind==7||kind>=11&&kind<=13)return 32;if(kind==2||kind==3||kind==6||kind==8||kind==14)return 8;if(kind==9)return 4;if(kind==10||kind==16)return 16;return kind==15?1:0;}
@inline function scalarWidth(kind:u8):u32 {if(kind<=2)return 1;if(kind<=4)return 2;if(kind<=6||kind==9)return 4;if(kind<=10)return 8;return kind==11?1:0;}
@inline function bitMask(bits:u32):u64 {return bits==64?u64.MAX_VALUE:bits==0?0:(<u64>1<<bits)-1;}
export function readWord(address:usize,width:u32):u64 {let n:u64=0;for(let i:u32=0;i<width;i++)n|=<u64>load<u8>(address+i)<<(i*8);return n;}
export function writeWord(address:usize,width:u32,n:u64):void {for(let i:u32=0;i<width;i++)store<u8>(address+i,<u8>(n>>(i*8)));}
const P1:u64=11400714785074694791,P2:u64=14029467366897019727,P3:u64=1609587929392839161,P4:u64=9650029242287828579,P5:u64=2870177450012600261;
@inline function round(a:u64,b:u64):u64 {return rotl<u64>(a+b*P2,31)*P1;}
export function xxh64(pointer:usize,length:u32,seed:u64=0):u64 {
 let p:u32=0,h:u64;if(length>=32){let a=seed+P1+P2,b=seed+P2,c=seed,d=seed-P1;while(p<=length-32){a=round(a,load<u64>(pointer+p));b=round(b,load<u64>(pointer+p+8));c=round(c,load<u64>(pointer+p+16));d=round(d,load<u64>(pointer+p+24));p+=32;}h=rotl<u64>(a,1)+rotl<u64>(b,7)+rotl<u64>(c,12)+rotl<u64>(d,18);h=(h^round(0,a))*P1+P4;h=(h^round(0,b))*P1+P4;h=(h^round(0,c))*P1+P4;h=(h^round(0,d))*P1+P4;}else h=seed+P5;
 h+=length;while(<u64>p+8<=length){h=rotl<u64>(h^round(0,load<u64>(pointer+p)),27)*P1+P4;p+=8;}if(<u64>p+4<=length){h=rotl<u64>(h^(<u64>load<u32>(pointer+p)*P1),23)*P2+P3;p+=4;}while(p<length){h=rotl<u64>(h^(<u64>load<u8>(pointer+p)*P5),11)*P1;p++;}h^=h>>33;h*=P2;h^=h>>29;h*=P3;return h^(h>>32);
}
export class Schema {
 base:usize=0;length:u32=0;directory:u32=0;root:u32=0;maxBytes:u32=0;status:Code=Code.Malformed;
 open(base:usize,length:u32):Code {
  this.status=Code.Malformed;if(!addressable(base,length)||length<64)return this.status;
  if(load<u32>(base)!=0x32435346||load<u16>(base+4)!=3||load<u16>(base+6)!=1||load<u32>(base+8)!=length||load<u32>(base+12)!=0||load<u32>(base+40)!=16)return this.status;
  const directory=load<u32>(base+36);if(!fits(length,directory,256)||!load<u32>(base+44))return this.status;
  this.base=base;this.length=length;this.directory=directory;this.root=load<u32>(base+32);this.maxBytes=load<u32>(base+44);return this.status=Code.Ok;
 }
 table(kind:u32):u32 {
  if(this.status!=Code.Ok||kind<1||kind>16){this.status=Code.Malformed;return NO_INDEX;}
  const d=this.base+this.directory+16*(kind-1),base=load<u32>(d+4),len=load<u32>(d+8),count=load<u32>(d+12);
  if(load<u16>(d)!=kind||load<u16>(d+2)||<u64>count*recordSize(kind)!=len||!fits(this.length,base,len)||(!len&&(base||count))||(len&&(base&7))){this.status=Code.Malformed;return NO_INDEX;}return base;
 }
 count(kind:u32):u32 {if(this.table(kind)==NO_INDEX)return 0;return load<u32>(this.base+this.directory+16*(kind-1)+12);}
 entry(kind:u32,index:u32):u32 {const base=this.table(kind);if(base==NO_INDEX||index>=load<u32>(this.base+this.directory+16*(kind-1)+12)){this.status=Code.Malformed;return NO_INDEX;}return base+index*recordSize(kind);}
 layout(index:u32):u32 {
  const offset=this.entry(1,index);if(offset==NO_INDEX)return offset;const p=this.base+offset,flags=load<u32>(p+24),first=load<u32>(p+4),count=load<u32>(p+8),fields=this.count(2);
  if(this.status!=Code.Ok||(flags!=1&&flags!=2)||load<u32>(p+28)||load<u32>(p)>this.maxBytes||first>fields||count>fields-first||this.count(3)!=fields||this.count(9)!=fields||flags==1&&(load<u32>(p+16)!=index||load<u32>(p+20)!=NO_INDEX)){this.status=Code.Malformed;return NO_INDEX;}return offset;
 }
 byID(layout:u32,id:u32):u32 {const off=this.layout(layout);if(off==NO_INDEX)return NO_INDEX;const p=this.base+off,first=load<u32>(p+4),n=load<u32>(p+8);let lo:u32=0,hi=n;while(lo<hi){const m=lo+(hi-lo)/2,e=this.entry(9,first+m);if(e==NO_INDEX)return NO_INDEX;if(load<u32>(this.base+e)<id)lo=m+1;else hi=m;}if(lo>=n)return NO_INDEX;const e=this.entry(9,first+lo);return e!=NO_INDEX&&load<u32>(this.base+e)==id?first+lo:NO_INDEX;}
 nameEquals(ref:u32,name:usize,length:u32):bool {if(!fits(this.length,ref,8)){this.status=Code.Malformed;return false;}const p=this.base+ref,start=load<u32>(p),len=load<u32>(p+4);if(!fits(this.length,start,len)){this.status=Code.Malformed;return false;}if(len!=length)return false;for(let i:u32=0;i<len;i++)if(load<u8>(this.base+start+i)!=load<u8>(name+i))return false;return true;}
 byName(layout:u32,name:usize,length:u32):u32 {
  if(!addressable(name,length)){this.status=Code.Malformed;return NO_INDEX;}const l=this.layout(layout);if(l==NO_INDEX)return NO_INDEX;const logical=load<u32>(this.base+l+12),base=load<u32>(this.base+48),count=load<u32>(this.base+52);if(!base||logical>=count)return NO_INDEX;
  const offset=<u64>base+<u64>logical*32;if(!fits(this.length,offset,32)){this.status=Code.Malformed;return NO_INDEX;}const p=this.base+<usize>offset,mode=load<u32>(p),n=load<u32>(p+4),refs=load<u32>(p+8);if(mode==0)return NO_INDEX;if(n!=load<u32>(this.base+l+8)||!fits(this.length,refs,<u64>n*8)){this.status=Code.Malformed;return NO_INDEX;}let slot:u32=NO_INDEX;
  if(mode==1){if(n>4){this.status=Code.Malformed;return NO_INDEX;}for(let i:u32=0;i<n;i++)if(this.nameEquals(refs+i*8,name,length)){slot=i;break;}}
  else if(mode==2){const bc=load<u32>(p+12),bo=load<u32>(p+16),sc=load<u32>(p+20),so=load<u32>(p+24),seed=load<u32>(p+28);if(!bc||!sc||(bc&(bc-1))||(sc&(sc-1))||!fits(this.length,bo,<u64>bc*4)||!fits(this.length,so,<u64>sc*4)){this.status=Code.Malformed;return NO_INDEX;}const b=<u32>(xxh64(name,length,seed)&(bc-1)),g=load<i32>(this.base+bo+b*4);if(g){const pos=g<0?<u32>(-<i64>g-1):<u32>(xxh64(name,length,<u64>seed+<u64>g)&(sc-1));if(pos>=sc){this.status=Code.Malformed;return NO_INDEX;}const plus=load<u32>(this.base+so+pos*4);if(plus){slot=plus-1;if(slot>=n){this.status=Code.Malformed;return NO_INDEX;}if(!this.nameEquals(refs+slot*8,name,length))slot=NO_INDEX;}}}
  else {this.status=Code.Malformed;return NO_INDEX;}return this.status==Code.Ok&&slot!=NO_INDEX?load<u32>(this.base+l+4)+slot:NO_INDEX;
 }
 plan(index:u32):u32 {const off=this.entry(4,index);if(off==NO_INDEX)return off;const p=this.base+off,k=load<u8>(p),d=load<u8>(p+1),o=load<u8>(p+2),l=load<u8>(p+3);if(k<1||k>17||load<u32>(p+24)||(load<u32>(p+4)&~3)||d>8||o>32||l>32||<u32>o+l><u32>d*8){this.status=Code.Malformed;return NO_INDEX;}return off;}
}
export class RecordView {
 schema:Schema;data:usize=0;length:u32=0;layout:u32=0;anchor:u32=0;writable:bool=false;readOnly:bool=false;status:Code=Code.Malformed;
 constructor(schema:Schema){this.schema=schema;}
 open(data:usize,length:u32,writable:bool=false):Code {const s=this.schema,l=s.layout(s.root);this.status=Code.Malformed;if(l==NO_INDEX||!addressable(data,length)||length>s.maxBytes||!fits(length,0,load<u32>(s.base+l))||load<u32>(s.base+l+24)!=1)return this.status;this.data=data;this.length=length;this.layout=s.root;this.anchor=0;this.writable=writable;this.readOnly=false;return this.status=Code.Ok;}
 bind(data:usize,length:u32,layout:u32,anchor:u32,writable:bool,readOnly:bool):Code {const l=this.schema.layout(layout);if(l==NO_INDEX||!fits(length,anchor,load<u32>(this.schema.base+l)))return this.status=Code.Malformed;this.data=data;this.length=length;this.layout=layout;this.anchor=anchor;this.writable=writable;this.readOnly=readOnly;return this.status=Code.Ok;}
 atSlot(slot:u32,out:ValueView):Code {if(this.status!=Code.Ok)return out.status=this.status;const l=this.schema.layout(this.layout);if(l==NO_INDEX)return out.status=Code.Malformed;const p=this.schema.base+l;if(slot>=load<u32>(p+8))return out.status=Code.NotFound;return out.bindField(this,load<u32>(p+4)+slot);}
 fieldByID(id:u32,out:ValueView):Code {if(this.status!=Code.Ok)return out.status=this.status;const field=this.schema.byID(this.layout,id);if(field==NO_INDEX)return out.status=this.schema.status==Code.Ok?Code.NotFound:this.schema.status;return out.bindField(this,field);}
 field(name:usize,length:u32,out:ValueView):Code {if(this.status!=Code.Ok)return out.status=this.status;const field=this.schema.byName(this.layout,name,length);if(field==NO_INDEX)return out.status=this.schema.status==Code.Ok?Code.NotFound:this.schema.status;return out.bindField(this,field);}
}
export class ValueView {
 schema:Schema;data:usize=0;length:u32=0;offset:u32=0;anchor:u32=0;kind:u8=0;flags:u8=0;bit:u8=0;field:u32=NO_INDEX;target:u32=0;planIndex:u32=NO_INDEX;parent:u32=NO_INDEX;presence:u32=NO_INDEX;writable:bool=false;status:Code=Code.Malformed;spanOffset:u32=0;count:u32=0;
 constructor(schema:Schema){this.schema=schema;}
 bindField(record:RecordView,field:u32):Code {
  this.status=Code.Malformed;const s=this.schema;if(s!==record.schema)return this.status;const a=s.entry(2,field),link=s.entry(3,field),li=s.layout(record.layout);if(a==NO_INDEX||link==NO_INDEX||li==NO_INDEX)return this.status;
  const p=s.base+a,k=load<u8>(p+4),flags=load<u8>(p+5),p0=load<u8>(p+6),p1=load<u8>(p+7),d=flags>>4,relative=load<u32>(p),presence=load<u32>(s.base+link+4);
  if(k<1||k>17||(flags&8)||((flags&1)!=0)!=(presence!=NO_INDEX)||k<=10&&(d||p0||p1)||k==11&&(d||p0>7||p1)||k==15&&(relative||d||p0||p1)||k==14&&(d||p0||p1)||(k==12||k==13||k==16||k==17)&&(d>8||p0>32||p1>32||<u32>p0+p1><u32>d*8))return this.status;
  this.data=record.data;this.length=record.length;this.anchor=record.anchor;this.kind=k;this.flags=flags|(record.readOnly?2:0);this.bit=p0;this.field=field;this.target=load<u32>(s.base+link);this.planIndex=k==15||k==16?NO_INDEX:this.target;this.presence=presence;this.parent=record.layout;this.writable=record.writable;
  let size:u32=k<=11?scalarWidth(k):k==15?0:d;
  if(this.planIndex!=NO_INDEX){const plan=s.plan(this.planIndex);if(plan==NO_INDEX)return this.status;const pp=s.base+plan;if(load<u8>(pp)!=k)return this.status;if(k<=11&&(load<u8>(pp+1)!=scalarWidth(k)||load<u32>(pp+8)!=scalarWidth(k)))return this.status;if(k==14)size=load<u32>(pp+8);if((k==12||k==13||k==17)&&(load<u8>(pp+1)!=d||load<u8>(pp+2)!=p0||load<u8>(pp+3)!=p1))return this.status;}
  if(!fits(load<u32>(s.base+li),relative,size)||!fits(record.length,<u64>record.anchor+relative,size))return this.status;this.offset=record.anchor+relative;
  if(presence!=NO_INDEX){const pr=s.entry(6,presence);if(pr==NO_INDEX)return this.status;const pp=s.base+pr,mask=load<u8>(pp+4),at=load<u32>(pp);if(!mask||(mask&(mask-1))||load<u8>(pp+5)||load<u16>(pp+6)||!fits(load<u32>(s.base+li),at,1)||!fits(record.length,<u64>record.anchor+at,1))return this.status;}
  return this.status=Code.Ok;
 }
 bindPlan(data:usize,length:u32,plan:u32,offset:u32,writable:bool,readOnly:bool=false,bit:u8=0):Code {this.status=Code.Malformed;const p=this.schema.plan(plan);if(p==NO_INDEX)return this.status;const pp=this.schema.base+p;if(!fits(length,offset,load<u32>(pp+8)))return this.status;this.data=data;this.length=length;this.offset=offset;this.anchor=offset;this.kind=load<u8>(pp);this.target=this.kind==15||this.kind==16?load<u32>(pp+20):plan;this.planIndex=plan;this.field=NO_INDEX;this.parent=NO_INDEX;this.presence=NO_INDEX;this.flags=readOnly?2:0;this.bit=bit;this.writable=writable;return this.status=Code.Ok;}
 isPresent():bool {if(this.status!=Code.Ok)return false;if(this.presence==NO_INDEX)return true;const p=this.schema.entry(6,this.presence);if(p==NO_INDEX){this.status=Code.Malformed;return false;}return (load<u8>(this.data+this.anchor+load<u32>(this.schema.base+p))&load<u8>(this.schema.base+p+4))!=0;}
 require(kind:u32=0):Code {if(this.status!=Code.Ok)return this.status;if(kind&&this.kind!=kind)return Code.TypeMismatch;if(!this.isPresent())return this.status==Code.Ok?Code.Absent:this.status;return Code.Ok;}
 getU32():u32 {const c=this.require(Kind.U32);if(c!=Code.Ok){this.status=c;return 0;}return load<u32>(this.data+this.offset);}
 getBits():u64 {const c=this.require();if(c!=Code.Ok||this.kind>10){this.status=c!=Code.Ok?c:Code.TypeMismatch;return 0;}return readWord(this.data+this.offset,scalarWidth(this.kind));}
 getI64():i64 {const bits=this.getBits(),w=scalarWidth(this.kind)*8;return w==64?<i64>bits:<i64>(bits<<(64-w))>>(64-w);}
 getF32():f32 {if(this.require(Kind.F32)!=Code.Ok){this.status=Code.TypeMismatch;return 0;}return load<f32>(this.data+this.offset);}
 getF64():f64 {if(this.require(Kind.F64)!=Code.Ok){this.status=Code.TypeMismatch;return 0;}return load<f64>(this.data+this.offset);}
 getBool():bool {const c=this.require(Kind.Bool);if(c!=Code.Ok){this.status=c;return false;}return (load<u8>(this.data+this.offset)&(1<<this.bit))!=0;}
 checkBits(n:u64,maxMembers:u32=1000000):Code {
  if(this.kind<1||this.kind>10)return Code.TypeMismatch;const width=scalarWidth(this.kind)*8;if((n&~bitMask(width))!=0)return Code.BoundExceeded;if(this.kind>=9)return Code.Ok;
  const s=this.schema,p=s.plan(this.planIndex);if(p==NO_INDEX)return Code.Malformed;const ri=load<u32>(s.base+p+28);if(ri==NO_INDEX)return Code.Ok;const r=s.entry(7,ri);if(r==NO_INDEX)return Code.Malformed;const rp=s.base+r,k=load<u8>(rp),signed=(this.kind&1)!=0;if(load<u8>(rp+1)!=this.kind||load<u16>(rp+2)||load<u32>(rp+12))return Code.Malformed;
  if(k==1){const lo=load<u64>(rp+16),hi=load<u64>(rp+24);if((lo&~bitMask(width))||(hi&~bitMask(width)))return Code.Malformed;if(signed){const a=width==64?<i64>n:<i64>(n<<(64-width))>>(64-width),l=width==64?<i64>lo:<i64>(lo<<(64-width))>>(64-width),h=width==64?<i64>hi:<i64>(hi<<(64-width))>>(64-width);if(l>h)return Code.Malformed;return a<l||a>h?Code.BoundExceeded:Code.Ok;}if(lo>hi)return Code.Malformed;return n<lo||n>hi?Code.BoundExceeded:Code.Ok;}
  if(k==2){const first=load<u32>(rp+4),count=load<u32>(rp+8);if(!count)return Code.Malformed;if(count>maxMembers)return Code.WorkLimit;let found=false,previous:u64=0;for(let i:u32=0;i<count;i++){const e=s.entry(8,first+i);if(e==NO_INDEX)return Code.Malformed;const x=load<u64>(s.base+e);if(x&~bitMask(width))return Code.Malformed;if(i){if(signed){const a=width==64?<i64>x:<i64>(x<<(64-width))>>(64-width),b=width==64?<i64>previous:<i64>(previous<<(64-width))>>(64-width);if(a<=b)return Code.Malformed;}else if(x<=previous)return Code.Malformed;}previous=x;if(x==n)found=true;}return found?Code.Ok:Code.BoundExceeded;}
  return Code.Malformed;
 }
 setBits(n:u64):Code {let c=this.require();if(c!=Code.Ok)return c;if(!this.writable||(this.flags&2))return Code.ReadOnly;c=this.checkBits(n);if(c!=Code.Ok)return c;writeWord(this.data+this.offset,scalarWidth(this.kind),n);return Code.Ok;}
 setU32(n:u32):Code {if(this.kind!=Kind.U32)return Code.TypeMismatch;return this.setBits(n);}
 setBool(n:bool):Code {const c=this.require(Kind.Bool);if(c!=Code.Ok)return c;if(!this.writable||(this.flags&2))return Code.ReadOnly;const ptr=this.data+this.offset,mask=<u8>(1<<this.bit);store<u8>(ptr,(load<u8>(ptr)&~mask)|(n?mask:0));return Code.Ok;}
 record(out:RecordView):Code {
  const c=this.require();if(c!=Code.Ok)return out.status=c;if(this.kind!=15&&this.kind!=16)return out.status=Code.TypeMismatch;const s=this.schema,l=s.layout(this.target);if(l==NO_INDEX)return out.status=Code.Malformed;const p=s.base+l;let anchor=this.anchor;
  if(this.kind==15){if(this.field!=NO_INDEX){const parent=s.layout(this.parent);if(parent==NO_INDEX||load<u32>(p+24)!=2||load<u32>(p+20)!=this.parent||load<u32>(p+16)!=load<u32>(s.base+parent+16)||load<u32>(p)!=load<u32>(s.base+parent))return out.status=Code.Malformed;}else{if(load<u32>(p+24)!=1)return out.status=Code.Malformed;anchor=this.offset;}}
  else {if(load<u32>(p+24)!=1)return out.status=Code.Malformed;let d:u32;if(this.field==NO_INDEX){const pp=s.plan(this.planIndex);if(pp==NO_INDEX)return out.status=Code.Malformed;d=load<u8>(s.base+pp+1);}else{const a=s.entry(2,this.field);if(a==NO_INDEX)return out.status=Code.Malformed;d=load<u8>(s.base+a+5)>>4;}const n=readWord(this.data+this.offset,d);if(n>u32.MAX_VALUE||load<u32>(p)&&!n)return out.status=Code.Malformed;anchor=<u32>n;}
  return out.bind(this.data,this.length,this.target,anchor,this.writable,(this.flags&2)!=0);
 }
 span():Code {
  const c=this.require();if(c!=Code.Ok)return c;if(this.kind!=12&&this.kind!=13&&this.kind!=17)return Code.TypeMismatch;const s=this.schema,p=s.plan(this.planIndex);if(p==NO_INDEX)return Code.Malformed;const pp=s.base+p,d=load<u8>(pp+1),o=load<u8>(pp+2),l=load<u8>(pp+3),n=readWord(this.data+this.offset,d);if((n&~bitMask(<u32>o+l))!=0)return Code.Malformed;const count=o==64?0:n>>o,offset=n&bitMask(o);if(count>load<u32>(pp+16))return Code.BoundExceeded;this.spanOffset=<u32>offset;this.count=<u32>count;
  if(this.kind!=17){const bytes=this.kind==12?count:(load<u32>(pp+4)&1)?(count+7)/8:count*load<u32>(pp+12);if((!count||!bytes)&&offset||bytes&&!offset||!fits(this.length,offset,bytes))return Code.Malformed;}return Code.Ok;
 }
 validateUtf8():Code {const c=this.span();if(c!=Code.Ok)return c;if(this.kind!=12)return Code.TypeMismatch;return utf8(this.data+this.spanOffset,this.count)?Code.Ok:Code.Malformed;}
}
/** Strict UTF-8, including overlong sequences, surrogate codepoints and >U+10FFFF. */
export function utf8(pointer:usize,length:u32):bool {let i:u32=0;while(i<length){const a=load<u8>(pointer+i++);if(a<128)continue;let n:u32,cp:u32,min:u32;if(a>=0xc2&&a<=0xdf){n=1;cp=a&31;min=128;}else if(a>=0xe0&&a<=0xef){n=2;cp=a&15;min=2048;}else if(a>=0xf0&&a<=0xf4){n=3;cp=a&7;min=65536;}else return false;if(n>length-i)return false;for(let j:u32=0;j<n;j++){const b=load<u8>(pointer+i++);if((b&0xc0)!=0x80)return false;cp=(cp<<6)|(b&63);}if(cp<min||cp>0x10ffff||cp>=0xd800&&cp<=0xdfff)return false;}return true;}
export class ArrayView {
 schema:Schema;data:usize=0;length:u32=0;offset:u32=0;count:u32=0;stride:u32=0;child:u32=0;packed:bool=false;writable:bool=false;readOnly:bool=false;status:Code=Code.Malformed;
 constructor(schema:Schema){this.schema=schema;}
 bind(value:ValueView):Code {const c=value.require();if(c!=Code.Ok)return this.status=c;if(value.kind!=13&&value.kind!=14)return this.status=Code.TypeMismatch;const s=this.schema,p=s.plan(value.planIndex);if(p==NO_INDEX)return this.status=Code.Malformed;const pp=s.base+p;this.data=value.data;this.length=value.length;this.child=load<u32>(pp+20);this.stride=load<u32>(pp+12);this.packed=(load<u32>(pp+4)&1)!=0;this.writable=value.writable;this.readOnly=(value.flags&2)!=0;
  if(value.kind==13){const c=value.span();if(c!=Code.Ok)return this.status=c;this.offset=value.spanOffset;this.count=value.count;}else{this.offset=value.offset;this.count=load<u32>(pp+16);if(!fits(this.length,this.offset,this.packed?(<u64>this.count+7)/8:<u64>this.count*this.stride))return this.status=Code.Malformed;}
  const cp=s.plan(this.child);if(cp==NO_INDEX|| (this.packed?load<u8>(s.base+cp)!=11:this.stride!=load<u32>(s.base+cp+8)))return this.status=Code.Malformed;return this.status=Code.Ok;
 }
 at(index:u32,out:ValueView):Code {if(this.status!=Code.Ok)return out.status=this.status;if(index>=this.count)return out.status=Code.BoundExceeded;return out.bindPlan(this.data,this.length,this.child,this.offset+(this.packed?index/8:index*this.stride),this.writable,this.readOnly,this.packed?<u8>(index%8):0);}
}
export class Arena {
 schema:Schema;data:usize;capacity:u32;used:u32;status:Code=Code.Ok;
 constructor(schema:Schema,data:usize,capacity:u32,start:u32=0){this.schema=schema;this.data=data;this.capacity=capacity;this.used=start;if(!addressable(data,capacity)||capacity>schema.maxBytes||start>capacity)this.status=Code.BoundExceeded;}
 reserve(size:u32):u32 {if(this.status!=Code.Ok)return NO_INDEX;if(size>this.capacity-this.used){this.status=Code.NeedCapacity;return NO_INDEX;}const at=this.used;this.used+=size;memory.fill(this.data+at,0,size);return at;}
 replaceBytes(value:ValueView,source:usize,length:u32):Code {const c=value.require(Kind.Utf8);if(c!=Code.Ok)return c;if(!value.writable||(value.flags&2))return Code.ReadOnly;if(value.data!=this.data||value.schema!==this.schema||!addressable(source,length))return Code.Malformed;const p=this.schema.plan(value.planIndex);if(p==NO_INDEX)return Code.Malformed;const pp=this.schema.base+p;if(length>load<u32>(pp+16))return Code.BoundExceeded;if(length>this.capacity-this.used)return Code.NeedCapacity;const d=load<u8>(pp+1),o=load<u8>(pp+2),l=load<u8>(pp+3);if(this.used>bitMask(o)||length>bitMask(l))return Code.BoundExceeded;const at=length?this.reserve(length):0;if(at==NO_INDEX)return this.status;memory.copy(this.data+at,source,length);writeWord(this.data+value.offset,d,<u64>at|(<u64>length<<o));return Code.Ok;}
}
export class MapView {
 schema:Schema;data:usize=0;length:u32=0;offset:u32=0;count:u32=0;capacity:u32=0;groups:u32=0;buckets:u32=0;controls:u32=0;ids:u32=0;heads:u32=0;stride:u32=0;idWidth:u32=0;placement:u8=1;layout:u32=0;writable:bool=false;status:Code=Code.Malformed;probes:u32=0;
 constructor(schema:Schema){this.schema=schema;}
 bind(value:ValueView):Code {
  if(value.kind!=17)return this.status=Code.TypeMismatch;const c=value.span();if(c!=Code.Ok)return this.status=c;const s=this.schema,p=s.plan(value.planIndex);if(p==NO_INDEX)return this.status=Code.Malformed;const mp=s.entry(5,load<u32>(s.base+p+20));if(mp==NO_INDEX)return this.status=Code.Malformed;const m=s.base+mp,cw=load<u8>(m+24),iw=load<u8>(m+25),placement=load<u8>(m+26);this.layout=load<u32>(m);const l=s.layout(this.layout);if(l==NO_INDEX||load<u32>(m+20)||load<u32>(m+28)||load<u8>(m+27)!=1||placement>1||cw<1||cw>4||iw<1||iw>4||load<u32>(s.base+l+8)!=2||load<u32>(m+16)!=load<u32>(s.base+l)||load<u32>(m+12)!=load<u32>(s.base+p+16))return this.status=Code.Malformed;
  this.data=value.data;this.length=value.length;this.offset=value.spanOffset;this.count=value.count;this.stride=load<u32>(m+16);this.idWidth=iw;this.placement=placement;this.writable=value.writable&&(value.flags&2)==0;
  if(!this.offset){this.capacity=0;this.groups=0;this.buckets=0;return this.status=this.count?Code.Malformed:Code.Ok;}
  if(!fits(this.length,this.offset,cw))return this.status=Code.Malformed;const cap=readWord(this.data+this.offset,cw);if(!cap||cap>load<u32>(m+12)||this.count>cap)return this.status=Code.Malformed;this.capacity=<u32>cap;
  let groups:u64=1,needed=(cap+6)/7;while(groups<needed)groups*=2;const buckets=groups*8,bytes=<u64>cw+buckets+(placement?buckets*iw+cap*this.stride:buckets*this.stride);if(!fits(this.length,this.offset,bytes)||groups>u32.MAX_VALUE||buckets>u32.MAX_VALUE)return this.status=Code.Malformed;
  this.groups=<u32>groups;this.buckets=<u32>buckets;this.controls=this.offset+cw;this.ids=this.controls+this.buckets;this.heads=this.ids+(placement?this.buckets*iw:0);return this.status=Code.Ok;
 }
 entry(bucket:u32,out:RecordView):Code {if(this.status!=Code.Ok)return out.status=this.status;if(bucket>=this.buckets)return out.status=Code.BoundExceeded;const c=load<u8>(this.data+this.controls+bucket);if(c<128)return out.status=c<=1?Code.NotFound:Code.Malformed;const id=this.placement?readWord(this.data+this.ids+bucket*this.idWidth,this.idWidth):<u64>bucket;if(this.placement&&id>=this.capacity)return out.status=Code.Malformed;return out.bind(this.data,this.length,this.layout,this.heads+<u32>id*this.stride,this.writable,false);}
 find(key:usize,length:u32,out:RecordView,keyScratch:ValueView,maxProbes:u32=65536,maxKeyBytes:u32=1048576):Code {
  this.probes=0;if(this.status!=Code.Ok)return out.status=this.status;if(!addressable(key,length))return out.status=Code.Malformed;if(length>maxKeyBytes)return out.status=Code.WorkLimit;if(!this.capacity)return out.status=Code.NotFound;const s=this.schema,l=s.layout(this.layout);if(l==NO_INDEX)return out.status=Code.Malformed;const fi=load<u32>(s.base+l+4),a=s.entry(2,fi);if(a==NO_INDEX)return out.status=Code.Malformed;const kind=load<u8>(s.base+a+4);if(kind!=12&&(kind<1||kind>8||length!=scalarWidth(kind)))return out.status=Code.TypeMismatch;
  const h=xxh64(key,length),fp=<u8>(h&127)|128,first=<u32>((h>>7)&(this.groups-1));let work:u64=length;
  for(let i:u32=0;i<this.groups;i++){const g=<u32>((<u64>first+<u64>i*(i+1)/2)&(this.groups-1));let empty=false;for(let j:u32=0;j<8;j++){if(this.probes>=maxProbes)return out.status=Code.WorkLimit;this.probes++;const bucket=g*8+j,c=load<u8>(this.data+this.controls+bucket);if(c==0)empty=true;else if(c!=1&&c<128)return out.status=Code.Malformed;if(c!=fp)continue;let status=this.entry(bucket,out);if(status!=Code.Ok)return status;status=out.atSlot(0,keyScratch);if(status!=Code.Ok)return out.status=status;let ptr:usize=this.data+keyScratch.offset,n=scalarWidth(kind);if(kind==12){status=keyScratch.span();if(status!=Code.Ok)return out.status=status;ptr=this.data+keyScratch.spanOffset;n=keyScratch.count;work+=n;if(work>maxKeyBytes)return out.status=Code.WorkLimit;}if(n!=length)continue;let match=true;for(let k:u32=0;k<n;k++)if(load<u8>(ptr+k)!=load<u8>(key+k)){match=false;break;}if(match)return out.status=Code.Ok;}if(empty)return out.status=Code.NotFound;}
  return out.status=Code.NotFound;
 }
}
/** Bound u32 reference: its lifetime ends at relevant structural/presence changes. */
export class U32Reference {
 pointer:usize=0;readOnly:bool=true;status:Code=Code.Malformed;
 bind(value:ValueView):Code {const c=value.require(Kind.U32);if(c!=Code.Ok)return this.status=c;const p=value.schema.plan(value.planIndex);if(p==NO_INDEX)return this.status=Code.Malformed;if(load<u32>(value.schema.base+p+28)!=NO_INDEX)return this.status=Code.TypeMismatch;this.pointer=value.data+value.offset;this.readOnly=!value.writable||(value.flags&2)!=0;return this.status=Code.Ok;}
 get():u32 {return this.status==Code.Ok?load<u32>(this.pointer):0;}
 set(n:u32):Code {if(this.status!=Code.Ok)return this.status;if(this.readOnly)return Code.ReadOnly;store<u32>(this.pointer,n);return Code.Ok;}
}
/** Verification workspace: allocate once; stack and intervals are caller memory, in bytes. */
export class Verifier {
 schema:Schema;record:RecordView;value:ValueView;array:ArrayView;map:MapView;mapRecord:RecordView;key:ValueView;
 maxNodes:u32=1000000;maxDepth:u32=128;maxProbes:u32=1000000;maxKeyBytes:u32=1048576;maxBytes:u64=0xffffffff;
 nodes:u32=0;bytes:u64=0;intervalCount:u32=0;stackUsed:u32=0;stack:usize=0;stackBytes:u32=0;intervals:usize=0;intervalBytes:u32=0;
 constructor(schema:Schema){this.schema=schema;this.record=new RecordView(schema);this.value=new ValueView(schema);this.array=new ArrayView(schema);this.map=new MapView(schema);this.mapRecord=new RecordView(schema);this.key=new ValueView(schema);}
 push(mode:u32,index:u32,anchor:u32,other:u32,depth:u32,flags:u32):Code {if(<u32>24>this.stackBytes-this.stackUsed)return Code.NeedScratch;const p=this.stack+this.stackUsed;store<u32>(p,mode);store<u32>(p+4,index);store<u32>(p+8,anchor);store<u32>(p+12,other);store<u32>(p+16,depth);store<u32>(p+20,flags);this.stackUsed+=24;return Code.Ok;}
 own(offset:u32,length:u32):Code {if(!length)return Code.Ok;this.bytes+=length;if(this.bytes>this.maxBytes)return Code.WorkLimit;if(<u64>this.intervalCount*8+8>this.intervalBytes)return Code.NeedScratch;const p=this.intervals+this.intervalCount*8;store<u32>(p,offset);store<u32>(p+4,length);this.intervalCount++;return Code.Ok;}
 verify(root:RecordView,stack:usize,stackBytes:u32,intervals:usize,intervalBytes:u32):Code {
  if(root.status!=Code.Ok||root.schema!==this.schema)return Code.Malformed;if(!addressable(stack,stackBytes)||!addressable(intervals,intervalBytes))return Code.Malformed;
  // Scratch cannot overwrite any bytes being verified or other scratch.
  if(overlap(stack,stackBytes,root.data,root.length)||overlap(stack,stackBytes,this.schema.base,this.schema.length)||overlap(intervals,intervalBytes,root.data,root.length)||overlap(intervals,intervalBytes,this.schema.base,this.schema.length)||overlap(stack,stackBytes,intervals,intervalBytes))return Code.Malformed;
  this.stack=stack;this.stackBytes=stackBytes;this.intervals=intervals;this.intervalBytes=intervalBytes;this.stackUsed=0;this.intervalCount=0;this.nodes=0;this.bytes=0;
  const s=this.schema,l=s.layout(root.layout);if(l==NO_INDEX)return Code.Malformed;let c=this.own(root.anchor,load<u32>(s.base+l));if(c!=Code.Ok)return c;c=this.push(0,root.layout,root.anchor,0,0,0);if(c!=Code.Ok)return c;let probeWork:u64=0,keyWork:u64=0;
  while(this.stackUsed){this.stackUsed-=24;const p=this.stack+this.stackUsed,mode=load<u32>(p),index=load<u32>(p+4),anchor=load<u32>(p+8),other=load<u32>(p+12),depth=load<u32>(p+16),flags=load<u32>(p+20);if(this.nodes>=this.maxNodes||depth>this.maxDepth)return Code.WorkLimit;this.nodes++;
   if(mode==0){c=this.record.bind(root.data,root.length,index,anchor,false,flags!=0);if(c!=Code.Ok)return c;const li=s.layout(index);if(li==NO_INDEX)return Code.Malformed;const first=load<u32>(s.base+li+4),count=load<u32>(s.base+li+8);if(count>this.maxNodes-this.nodes)return Code.WorkLimit;for(let i:u32=0;i<count;i++){c=this.push(1,first+i,anchor,index,depth+1,flags);if(c!=Code.Ok)return c;}continue;}
   if(mode==1){c=this.record.bind(root.data,root.length,other,anchor,false,flags!=0);if(c!=Code.Ok)return c;c=this.value.bindField(this.record,index);}else c=this.value.bindPlan(root.data,root.length,index,anchor,false,(flags&1)!=0,<u8>(flags>>8));if(c!=Code.Ok)return c;if(!this.value.isPresent())continue;
   const v=this.value,k=v.kind;
   if(k<=10){c=v.checkBits(v.getBits());if(c!=Code.Ok)return c;}
   else if(k==12){c=v.validateUtf8();if(c!=Code.Ok)return c;c=this.own(v.spanOffset,v.count);if(c!=Code.Ok)return c;}
   else if(k==13||k==14){c=this.array.bind(v);if(c!=Code.Ok)return c;const a=this.array;if(a.count>this.maxNodes-this.nodes)return Code.WorkLimit;if(k==13){c=this.own(a.offset,a.packed?(a.count+7)/8:a.count*a.stride);if(c!=Code.Ok)return c;}for(let i:u32=0;i<a.count;i++){c=this.push(2,a.child,a.offset+(a.packed?i/8:i*a.stride),0,depth+1,(a.readOnly?1:0)|(a.packed?(i%8)<<8:0));if(c!=Code.Ok)return c;}}
   else if(k==15||k==16){c=v.record(this.record);if(c!=Code.Ok)return c;if(k==16){const li=s.layout(this.record.layout);if(li==NO_INDEX)return Code.Malformed;c=this.own(this.record.anchor,load<u32>(s.base+li));if(c!=Code.Ok)return c;}c=this.push(0,this.record.layout,this.record.anchor,0,depth+1,this.record.readOnly?1:0);if(c!=Code.Ok)return c;}
   else if(k==17){c=this.map.bind(v);if(c!=Code.Ok)return c;const m=this.map;if(!m.capacity)continue;const size=m.heads-m.offset+(m.placement?m.capacity:m.buckets)*m.stride;c=this.own(m.offset,size);if(c!=Code.Ok)return c;if(m.buckets>this.maxNodes-this.nodes)return Code.WorkLimit;this.nodes+=m.buckets;let live:u32=0;for(let b:u32=0;b<m.buckets;b++){const ctrl=load<u8>(m.data+m.controls+b);if(ctrl<128){if(ctrl>1)return Code.Malformed;continue;}live++;c=m.entry(b,this.record);if(c!=Code.Ok)return c;const entryAnchor=this.record.anchor;c=this.record.atSlot(0,this.key);if(c!=Code.Ok)return c;let keyPtr=this.key.data+this.key.offset,keyLen=scalarWidth(this.key.kind);if(this.key.kind==12){c=this.key.validateUtf8();if(c!=Code.Ok)return c;keyPtr=this.key.data+this.key.spanOffset;keyLen=this.key.count;}keyWork+=keyLen;if(keyWork>this.maxKeyBytes||probeWork>=this.maxProbes)return Code.WorkLimit;
    c=m.find(keyPtr,keyLen,this.mapRecord,this.key,this.maxProbes-<u32>probeWork,this.maxKeyBytes);probeWork+=m.probes;if(c!=Code.Ok)return c;if(this.mapRecord.anchor!=entryAnchor)return Code.Malformed;c=this.push(0,m.layout,entryAnchor,0,depth+1,0);if(c!=Code.Ok)return c;}if(live!=m.count)return Code.Malformed;
   }
  }
  // In-place heap sort of extent pairs, then reject independent allocation overlap.
  for(let i:i64=<i64>this.intervalCount/2-1;i>=0;i--)this.sift(<u32>i,this.intervalCount);for(let end=this.intervalCount;end>1;end--){this.swap(0,end-1);this.sift(0,end-1);}for(let i:u32=1;i<this.intervalCount;i++){const a=this.intervals+(i-1)*8,b=this.intervals+i*8;if(<u64>load<u32>(a)+load<u32>(a+4)>load<u32>(b))return Code.Malformed;}return Code.Ok;
 }
 swap(a:u32,b:u32):void {const ap=this.intervals+a*8,bp=this.intervals+b*8,n=load<u64>(ap);store<u64>(ap,load<u64>(bp));store<u64>(bp,n);}
 sift(root:u32,count:u32):void {while(<u64>root*2+1<count){let child=root*2+1;if(child+1<count&&load<u32>(this.intervals+child*8)<load<u32>(this.intervals+(child+1)*8))child++;if(load<u32>(this.intervals+root*8)>=load<u32>(this.intervals+child*8))return;this.swap(root,child);root=child;}}
}
@inline function overlap(a:usize,al:u32,b:usize,bl:u32):bool {return <u64>a+al>b&&<u64>b+bl>a;}
