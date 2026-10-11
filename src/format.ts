export const NO_INDEX = 0xffffffff;
export const RECORD_BYTES = [0,32,8,8,32,32,8,32,8,4,16,32,32,32,8,1,16];
export enum Kind { I8=1,U8,I16,U16,I32,U32,I64,U64,F32,F64,Bool,Utf8,Array,FixedArray,Record,Ref,Map }
export enum Code { Ok, Absent, NotFound, TypeMismatch, BoundExceeded, NeedCapacity, NeedScratch, WorkLimit, ReadOnly, SchemaMismatch, Malformed }
export enum Region { Schema, Data }
export class FassError extends Error {
  constructor(public readonly code: Code, public readonly region: Region, public readonly offset=0, public readonly detail=0) {
    super(`fass status ${code} region ${region} offset ${offset} detail ${detail}`);
  }
}
export function fail(code:Code, region:Region, offset=0, detail=0):never { throw new FassError(code,region,offset,detail); }
export function extent(length:number, offset:number, bytes:number, region:Region):void {
  if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(bytes) || offset<0 || bytes<0 || offset>length || bytes>length-offset) fail(Code.Malformed,region,offset,bytes);
}
export function view(bytes:Uint8Array):DataView { return new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength); }
export function bits(n:number):number { return n===0?0:Math.floor(Math.log2(n))+1; }
export function power2(n:number):number { let p=1; while(p<n) p*=2; return p; }
export function width(kind:Kind):number { return kind<=2?1:kind<=4?2:kind<=6||kind===Kind.F32?4:kind<=10?8:kind===Kind.Bool?1:0; }
export function readWord(bytes:Uint8Array, offset:number, size:number, region=Region.Data):bigint {
  extent(bytes.length,offset,size,region); let n=0n;
  for(let i=size-1;i>=0;i--) n=(n<<8n)|BigInt(bytes[offset+i]); return n;
}
export function writeWord(bytes:Uint8Array,offset:number,size:number,n:bigint):void {
  extent(bytes.length,offset,size,Region.Data);
  if(n<0n || n>=(1n<<BigInt(size*8))) fail(Code.BoundExceeded,Region.Data,offset);
  for(let i=0;i<size;i++) { bytes[offset+i]=Number(n&255n); n>>=8n; }
}
export function readSpan(bytes:Uint8Array,offset:number,d:number,o:number,l:number,limit:number):[number,number] {
  if(d>8 || o>32 || l>32 || o+l>d*8) fail(Code.Malformed,Region.Schema);
  const n=readWord(bytes,offset,d); if(n>>BigInt(o+l)) fail(Code.Malformed,Region.Data,offset);
  const count=Number(n>>BigInt(o)); const at=Number(n&((1n<<BigInt(o))-1n));
  if(count>limit) fail(Code.BoundExceeded,Region.Data,offset,count); return [at,count];
}
export function writeSpan(bytes:Uint8Array,offset:number,d:number,o:number,l:number,at:number,count:number,limit:number):void {
  if(count<0 || count>limit || !Number.isInteger(count) || at<0 || !Number.isInteger(at) || BigInt(at)>=(1n<<BigInt(o))) fail(Code.BoundExceeded,Region.Data,offset);
  if(d>8||o+l>d*8||BigInt(count)>=(1n<<BigInt(l))) fail(Code.BoundExceeded,Region.Data,offset);
  writeWord(bytes,offset,d,BigInt(at)|(BigInt(count)<<BigInt(o)));
}
