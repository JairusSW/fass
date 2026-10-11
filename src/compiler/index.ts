import {createHash} from 'node:crypto';
import {Kind,NO_INDEX as N,RECORD_BYTES,bits,width,view} from '../format.js';
import {parse,Source,Type,Field,Declaration} from './parser.js';
import {compileNames} from './names.js';
export {parse};export type {Source,Type,Field,Declaration};
type Row=number[];
interface Leaf {field:number;path:number[];size:number;category:number;presence?:boolean;}
interface Layout {row:Row;decl:Declaration;}
export interface Compilation {schema:Uint8Array;report:string;source:Source;}
const enc=new TextEncoder();
const hash=(s:string)=>new Uint8Array(createHash('sha256').update(s).digest().subarray(0,16));
export function runtimeIdentity(schema:Uint8Array):Uint8Array {
  const v=view(schema),h=createHash('sha256');h.update('FASS2-RUNTIME-3\0');
  const pre=new Uint8Array(16),p=view(pre);p.setUint16(0,v.getUint16(4,true),true);p.setUint16(2,v.getUint16(6,true),true);p.setUint32(4,v.getUint32(12,true),true);p.setUint32(8,v.getUint32(44,true),true);p.setUint32(12,v.getUint32(32,true),true);h.update(pre);
  for(let k=1;k<=10;k++){const d=v.getUint32(36,true)+16*(k-1),body=v.getUint32(d+4,true),len=v.getUint32(d+8,true);const b=new Uint8Array(12),w=view(b);w.setUint16(0,k,true);w.setUint32(4,v.getUint32(d+12,true),true);w.setUint32(8,len,true);h.update(b);h.update(schema.subarray(body,body+len));}
  return new Uint8Array(h.digest().subarray(0,16));
}
export function compile(input:string|Source,options:{strip?:boolean;nameWorkLimit?:number}={}):Compilation {
  const source=typeof input==='string'?parse(input):input;
  if(!Number.isInteger(source.maxBytes)||source.maxBytes<1||source.maxBytes>0xffffffff)throw Error('max_bytes must be 1..4294967295');
  const declarations=new Map<string,Declaration>();
  for(const d of source.records){if(declarations.has(d.name))throw Error(`Duplicate type ${d.name}`);declarations.set(d.name,d);d.fields.sort((a,b)=>a.id-b.id);const names=new Set<string>();let prev=0;for(const f of d.fields){if(!Number.isInteger(f.id)||f.id<=prev||f.id>=N||names.has(f.name))throw Error(`Invalid/duplicate field ID or name in ${d.name}`);prev=f.id;names.add(f.name);}}
  if(!declarations.has(source.root))throw Error('Unknown root');
  const table:Row[][]=Array.from({length:17},()=>[]),keys:Uint8Array[]=[],layouts:Layout[]=[],fieldMeta:Field[]=[],independent=new Map<string,number>(),typeIndex=new Map<string,number>();
  const nameBytes:Uint8Array[]=[],nameRefs:Row[]=[],nameLookup:Row[]=[],nameBuckets:number[]=[],nameSlots:number[]=[];
  function name(s:string):number {const n=nameRefs.length;nameRefs.push([nameBytes.reduce((n,b)=>n+b.length,0),enc.encode(s).length]);nameBytes.push(enc.encode(s));return n;}
  function normalized(t:Type):string {if(t.kind===Kind.Record)return `record:${t.name}`;if(t.kind===Kind.Ref)return `ref:${normalized(t.child!)}`;return JSON.stringify(t,(_k,v)=>typeof v==='bigint'?v.toString():v);}
  function rule(t:Type):number {
    if(!t.range&&!t.values)return N;if(t.kind<1||t.kind>8)throw Error('Integer rule required');
    const w=width(t.kind),signed=t.kind%2===1,min=signed?-(1n<<BigInt(w*8-1)):0n,max=signed?(1n<<BigInt(w*8-1))-1n:(1n<<BigInt(w*8))-1n;
    const check=(v:bigint)=>{if(v<min||v>max)throw Error('Rule value outside declared width');};
    const row=[t.values?2:1,t.kind,0,0,0,0,0,0],idx=table[7].length;
    if(t.values){const vs=[...t.values].sort((a,b)=>a<b?-1:a>b?1:0);if(!vs.length||new Set(vs).size!==vs.length)throw Error('Invalid enum');row[3]=table[8].length;row[4]=vs.length;for(const v of vs){check(v);const n=BigInt.asUintN(w*8,v);table[8].push([Number(n&0xffffffffn),Number(n>>32n)]);}}
    else {const [lo,hi]=t.range!;check(lo);check(hi);if(lo>hi)throw Error('Invalid range');for(const [i,v] of [[6,lo],[8,hi]] as const){const n=BigInt.asUintN(w*8,v);row[i]=Number(n&0xffffffffn);row[i+1]=Number(n>>32n);}}
    table[7].push(row);return idx;
  }
  function semantic(t:Type):number {
    const key=normalized(t);const old=typeIndex.get(key);if(old!==undefined)return old;
    const idx=keys.length;typeIndex.set(key,idx);keys.push(hash(`fass:type:${key}`));table[11].push([]);nameLookup.push([0,0,0,0,0,0,0,0]);
    let dk=1,nr=N,first=0,count=0,c0=N,c1=N,param=N,scalar=0;
    if(t.kind===Kind.Record){dk=2;const d=declarations.get(t.name!);if(!d)throw Error(`Unknown type ${t.name}`);nr=name(d.name);if(d.identity){if(!/^[\da-fA-F]{32}$/.test(d.identity.replaceAll('-','')))throw Error('Type id must be 128-bit hex');keys[idx]=Uint8Array.from(Buffer.from(d.identity.replaceAll('-',''),'hex'));}first=table[12].length;count=d.fields.length;for(const f of d.fields)table[12].push([]);for(let i=0;i<count;i++){const f=d.fields[i];const ft=semantic(f.type);const lit=f.default===undefined?N:literal(f.type,f.default);table[12][first+i]=[f.id,name(f.name),ft,f.optional?1:0,lit,N,N,0];}
      const refsStart=nameRefs.length;for(const f of d.fields)name(f.name);const index=compileNames(d.fields.map(f=>enc.encode(f.name)),options.nameWorkLimit);
      const bi=nameBuckets.length,si=nameSlots.length;nameBuckets.push(...index.buckets);nameSlots.push(...index.slots);nameLookup[idx]=[index.mode,count,refsStart,index.buckets.length,bi,index.slots.length,si,index.seed];
    }else if(t.kind===Kind.Utf8){dk=3;param=t.limit??255;}
    else if(t.kind===Kind.Array||t.kind===Kind.FixedArray){dk=t.kind===Kind.Array?4:5;c0=semantic(t.child!);param=t.kind===Kind.Array?t.limit??255:t.count!;}
    else if(t.kind===Kind.Map){dk=6;c0=semantic(t.key!);c1=semantic(t.child!);param=t.limit??255;}
    else if(t.kind===Kind.Ref){dk=7;c0=semantic(t.child!);}
    else {scalar=t.kind;param=rule(t);}
    table[11][idx]=[dk,0,scalar,0,nr,first,count,c0,c1,param,N];return idx;
  }
  function literal(t:Type,value:unknown):number {
    const idx=table[13].length;table[13].push([]);let k=1,sk=0,first=0,count=0,off=0,len=0,n=0n;
    if(value===null){k=6;}
    else if(t.kind===Kind.Utf8){if(typeof value!=='string')throw Error('String default expected');k=2;const b=enc.encode(value);off=table[15].length;len=b.length;if(len>(t.limit??255))throw Error('Default exceeds bound');for(const byte of b)table[15].push([byte]);}
    else if(t.kind===Kind.Record||t.kind===Kind.Ref){k=3;const d=declarations.get((t.kind===Kind.Ref?t.child!:t).name!)!;if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Record default expected');const entries=d.fields.filter(f=>Object.hasOwn(value,f.name));for(const key of Object.keys(value))if(!d.fields.some(f=>f.name===key))throw Error(`Unknown default field ${key}`);first=table[14].length;count=entries.length;for(let i=0;i<count;i++)table[14].push([]);entries.forEach((f,i)=>table[14][first+i]=[f.id,literal(f.type,(value as Record<string,unknown>)[f.name])]);}
    else if(t.kind===Kind.Array||t.kind===Kind.FixedArray){k=4;if(!Array.isArray(value))throw Error('Array default expected');if(value.length>(t.limit??t.count??255)||t.kind===Kind.FixedArray&&value.length!==t.count)throw Error('Array default bound');first=table[14].length;count=value.length;for(let i=0;i<count;i++)table[14].push([]);value.forEach((v,i)=>table[14][first+i]=[i,literal(t.child!,v)]);}
    else if(t.kind===Kind.Map){k=5;if(!Array.isArray(value))throw Error('Map defaults use [[key,value],...]');if(value.length>(t.limit??255))throw Error('Map default bound');first=table[14].length;count=value.length;for(let i=0;i<count;i++)table[14].push([]);value.forEach((pair,i)=>{if(!Array.isArray(pair)||pair.length!==2)throw Error('Map pair expected');const entry=table[13].length;const e=table[14].length;table[13].push([3,0,0,e,2,0,0,0,0,0]);table[14].push([],[]);table[14][e]=[1,literal(t.key!,pair[0])];table[14][e+1]=[2,literal(t.child!,pair[1])];table[14][first+i]=[i,entry];});}
    else {sk=t.kind;if(t.kind===Kind.Bool){if(typeof value!=='boolean')throw Error('Boolean default expected');n=value?1n:0n;}else if(t.kind===Kind.F32||t.kind===Kind.F64){const b=new Uint8Array(8),v=view(b);if(t.kind===Kind.F32)v.setFloat32(0,Number(value),true);else v.setFloat64(0,Number(value),true);n=v.getBigUint64(0,true);}else {const x=BigInt(value as bigint);const w=width(t.kind),signed=t.kind%2===1;const min=signed?-(1n<<BigInt(w*8-1)):0n,max=signed?(1n<<BigInt(w*8-1))-1n:(1n<<BigInt(w*8))-1n;if(x<min||x>max||t.range&&(x<t.range[0]||x>t.range[1])||t.values&&!t.values.includes(x))throw Error('Invalid scalar default');n=BigInt.asUintN(w*8,x);}}
    table[13][idx]=[k,sk,0,first,count,off,len,0,Number(n&0xffffffffn),Number(n>>32n)];return idx;
  }
  const O=bits(source.maxBytes-1);
  function span(t:Type):[number,number,number] {const c=t.limit??255;if(!Number.isInteger(c)||c<0||c>N)throw Error('Invalid count bound');const l=bits(c),min=c===0?0:Math.ceil((O+l)/8),d=t.padded??min;if(!Number.isInteger(d)||d<min||d>8||c===0&&d!==0)throw Error('Invalid descriptor width');return [d,c===0?0:O,c===0?0:l];}
  const pendingRefs:{plan:number;name:string;field?:number}[]=[];
  function plan(t:Type,stack:string[]=[]):number {
    semantic(t);let d=width(t.kind),o=0,l=0,flags=0,head=d,stride=0,limit=0,child=N,r=N;
    if(t.kind<=10)r=rule(t);
    else if(t.kind===Kind.Utf8){[d,o,l]=span(t);head=d;limit=t.limit??255;}
    else if(t.kind===Kind.Array||t.kind===Kind.FixedArray){child=plan(t.child!,stack);flags=t.child!.kind===Kind.Bool?1:0;stride=flags?0:table[4][child][5];limit=t.kind===Kind.Array?t.limit??255:t.count!;if(!Number.isInteger(limit)||limit<0||limit>N)throw Error('Invalid array count');if(t.kind===Kind.Array){[d,o,l]=span(t);head=d;}else {d=0;head=flags?Math.ceil(limit/8):limit*stride;}}
    else if(t.kind===Kind.Record){child=independentLayout(t.name!,stack);head=table[1][child][0];d=0;}
    else if(t.kind===Kind.Ref){d=Math.ceil(O/8);o=O;head=d;}
    else if(t.kind===Kind.Map){if(!(t.key!.kind<=8||t.key!.kind===Kind.Utf8)||t.key!.kind<1)throw Error('Map keys must be integers or strings');const name=`$map${table[5].length}`;const decl:Declaration={name,fields:[{id:1,name:'key',type:t.key!,optional:false},{id:2,name:'value',type:t.child!,optional:false}]};declarations.set(name,decl);const entry=independentLayout(name,stack);const keyField=table[1][entry][1];table[2][keyField][2]|=2;const kp=plan(t.key!,stack),vp=plan(t.child!,stack);child=table[5].length;limit=t.limit??255;table[5].push([entry,kp,vp,limit,table[1][entry][0],0,Math.max(1,Math.ceil(bits(limit)/8)),Math.max(1,Math.ceil(bits(Math.max(0,limit-1))/8)),t.placement??1,1,0]);[d,o,l]=span(t);head=d;}
    if(!Number.isSafeInteger(head)||head>source.maxBytes)throw Error('Head exceeds maximum message size');
    const idx=table[4].length;table[4].push([t.kind,d,o,l,flags,head,stride,limit,child,0,r]);if(t.kind===Kind.Ref)pendingRefs.push({plan:idx,name:t.child!.name!});return idx;
  }
  function independentLayout(name:string,stack:string[]=[]):number {
    if(stack.includes(name))throw Error(`By-value recursion: ${[...stack,name].join(' -> ')}`);
    const cached=independent.get(name);if(cached!==undefined)return cached;
    const d=declarations.get(name);if(!d)throw Error(`Unknown type ${name}`);
    const leaves:Leaf[]=[],members:number[]=[];const idx=makeLayout(d,N,N,[],leaves,members,[...stack,name]);independent.set(name,idx);
    leaves.sort((a,b)=>a.category-b.category||(a.category===0?b.size-a.size:0)||comparePath(a.path,b.path)||Number(!!b.presence)-Number(!!a.presence));
    let offset=0,bit=0;for(const leaf of leaves){const aw=table[2][leaf.field];if(leaf.category===3){if(leaf.presence){const pi=table[6].length;table[6].push([offset+Math.floor(bit/8),1<<(bit%8),0]);table[3][leaf.field][1]=pi;}else {aw[0]=offset+Math.floor(bit/8);aw[3]=bit%8;}bit++;}else {aw[0]=offset;offset+=leaf.size;}}
    const head=offset+Math.ceil(bit/8);if(head>source.maxBytes)throw Error(`Head ${name} exceeds message bound`);for(const i of members){table[1][i][0]=head;table[1][i][4]=idx;if(i===idx){table[1][i][5]=N;table[1][i][6]=1;}}
    return idx;
  }
  function makeLayout(d:Declaration,anchor:number,parent:number,path:number[],leaves:Leaf[],members:number[],stack:string[]):number {
    const idx=table[1].length,first=table[2].length,logical=semantic({kind:Kind.Record,name:d.name});table[1].push([0,first,d.fields.length,logical,anchor,parent,2,0]);layouts.push({row:table[1][idx],decl:d});members.push(idx);
    for(const f of d.fields){table[2].push([]);table[3].push([N,N]);table[9].push([f.id]);fieldMeta.push(f);}
    for(let slot=0;slot<d.fields.length;slot++) {const f=d.fields[slot],fi=first+slot,t=f.type,fp=[...path,f.id];let target=N,dw=0,o=0,l=0;
      if(t.kind===Kind.Record){if(stack.includes(t.name!))throw Error('By-value recursion');const child=declarations.get(t.name!);if(!child)throw Error(`Unknown type ${t.name}`);target=makeLayout(child,anchor===N?idx:anchor,idx,fp,leaves,members,[...stack,t.name!]);}
      else {target=plan(t,stack);const pp=table[4][target];dw=[12,13,16,17].includes(t.kind)?pp[1]:0;o=pp[2];l=pp[3];if(t.kind===Kind.Ref){pendingRefs[pendingRefs.length-1].field=fi;}
        leaves.push({field:fi,path:fp,size:pp[5],category:t.kind<=10?0:t.kind===Kind.FixedArray?1:t.kind===Kind.Bool?3:2});}
      table[2][fi]=[0,t.kind,(f.optional?1:0)|(dw<<4)|(t.range||t.values?4:0),t.kind===Kind.Bool?0:o,l];table[3][fi][0]=target;
      if(f.optional)leaves.push({field:fi,path:fp,size:0,category:3,presence:true});
    }
    return idx;
  }
  const root=independentLayout(source.root);for(const d of source.records)independentLayout(d.name);
  for(let i=0;i<pendingRefs.length;i++){const r=pendingRefs[i],li=independentLayout(r.name);table[4][r.plan][8]=li;if(r.field!==undefined)table[3][r.field][0]=li;}
  // All explicit reference cycles are rejected for this release; values are finite trees.
  function checkRefs(name:string,stack:string[]):void {if(stack.includes(name))throw Error('Recursive value graph is unsupported');for(const f of declarations.get(name)!.fields){let t=f.type;while(t.child&&t.kind!==Kind.Ref)t=t.child;if(t.kind===Kind.Record||t.kind===Kind.Ref)checkRefs(t.kind===Kind.Ref?t.child!.name!:t.name!,[...stack,name]);}}
  for(const d of source.records)checkRefs(d.name,[]);
  table[10]=keys.map(b=>[...b]);
  const bodies:Uint8Array[]=Array.from({length:17},()=>new Uint8Array());
  function encodeRows(k:number):Uint8Array {const b=new Uint8Array(table[k].length*RECORD_BYTES[k]),v=view(b);table[k].forEach((r,i)=>{const at=i*RECORD_BYTES[k];if(k===2){v.setUint32(at,r[0],true);for(let j=1;j<=4;j++)v.setUint8(at+3+j,r[j]);}else if(k===4||k===11){for(let j=0;j<4;j++)v.setUint8(at+j,r[j]);for(let j=4;j<r.length;j++)v.setUint32(at+4*(j-3),r[j],true);}else if(k===5){for(let j=0;j<6;j++)v.setUint32(at+j*4,r[j],true);for(let j=6;j<10;j++)v.setUint8(at+18+j,r[j]);v.setUint32(at+28,0,true);}else if(k===6){v.setUint32(at,r[0],true);v.setUint8(at+4,r[1]);}else if(k===7||k===13){v.setUint8(at,r[0]);v.setUint8(at+1,r[1]);for(let j=3;j<r.length;j++)v.setUint32(at+4*(j-2),r[j],true);}else if(k===10||k===15){r.forEach((x,j)=>v.setUint8(at+j,x));}else r.forEach((x,j)=>v.setUint32(at+j*4,x,true));});return b;}
  for(let k=1;k<=16;k++)if(!options.strip||k<=10)bodies[k]=encodeRows(k);
  let size=320;const offsets:number[]=new Array(17).fill(0);for(let k=1;k<=16;k++)if(bodies[k].length){size=Math.ceil(size/8)*8;offsets[k]=size;size+=bodies[k].length;}
  let auxOffset=0,nlOffset=0,nrOffset=0,nbOffset=0,buOffset=0,slOffset=0;
  if(!options.strip){size=Math.ceil(size/8)*8;auxOffset=size;size+=80;nlOffset=size;size+=nameLookup.length*32;nrOffset=size;size+=nameRefs.length*8;nbOffset=size;size+=nameBytes.reduce((n,b)=>n+b.length,0);size=Math.ceil(size/8)*8;buOffset=size;size+=nameBuckets.length*4;size=Math.ceil(size/8)*8;slOffset=size;size+=nameSlots.length*4;}
  const schema=new Uint8Array(size),v=view(schema);schema.set(enc.encode('FSC2'));v.setUint16(4,3,true);v.setUint16(6,1,true);v.setUint32(8,size,true);v.setUint32(32,root,true);v.setUint32(36,64,true);v.setUint32(40,16,true);v.setUint32(44,source.maxBytes,true);v.setUint32(48,nlOffset,true);v.setUint32(52,options.strip?0:nameLookup.length,true);v.setUint32(56,auxOffset,true);v.setUint32(60,options.strip?0:5,true);
  for(let k=1;k<=16;k++){const at=64+16*(k-1);v.setUint16(at,k,true);v.setUint32(at+4,offsets[k],true);v.setUint32(at+8,bodies[k].length,true);v.setUint32(at+12,bodies[k].length/RECORD_BYTES[k],true);schema.set(bodies[k],offsets[k]);}
  if(!options.strip){const aux=[[0x8001,nlOffset,nameLookup.length*32,nameLookup.length],[0x8002,nrOffset,nameRefs.length*8,nameRefs.length],[0x8003,nbOffset,nameBytes.reduce((n,b)=>n+b.length,0),nameBytes.reduce((n,b)=>n+b.length,0)],[0x8004,nameBuckets.length?buOffset:0,nameBuckets.length*4,nameBuckets.length],[0x8005,nameSlots.length?slOffset:0,nameSlots.length*4,nameSlots.length]];aux.forEach((r,i)=>{const a=auxOffset+16*i;v.setUint16(a,r[0],true);v.setUint16(a+2,1,true);for(let j=1;j<4;j++)v.setUint32(a+4*j,r[j],true);});
    nameLookup.forEach((r,i)=>{const words=[...r];if(words[0])words[2]=nrOffset+words[2]*8;if(words[3])words[4]=buOffset+words[4]*4;else words[4]=0;if(words[5])words[6]=slOffset+words[6]*4;else words[6]=0;words.forEach((x,j)=>v.setUint32(nlOffset+i*32+j*4,x,true));});nameRefs.forEach((r,i)=>{v.setUint32(nrOffset+i*8,nbOffset+r[0],true);v.setUint32(nrOffset+i*8+4,r[1],true);});let n=nbOffset;for(const b of nameBytes){schema.set(b,n);n+=b.length;}nameBuckets.forEach((x,i)=>v.setInt32(buOffset+i*4,x,true));nameSlots.forEach((x,i)=>v.setUint32(slOffset+i*4,x,true));}
  schema.set(runtimeIdentity(schema),16);
  const lines=[`fass schema: ${schema.length} bytes`,...layouts.flatMap(({row,decl})=>[`${decl.name}${row[6]===2?' (projection)':''} head: ${row[0]} bytes`,...decl.fields.map((f,i)=>{const a=table[2][row[1]+i];return `  ${f.id} ${f.name} offset=${a[0]} kind=${Kind[a[1]]}${a[2]>>4?` descriptor=${a[2]>>4} offset_bits=${a[3]} count_bits=${a[4]}`:''}${a[1]===11?` bit=${a[3]}`:''}`;})])];
  return {schema,report:lines.join('\n')+'\n',source};
}
function comparePath(a:number[],b:number[]):number {for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;}
