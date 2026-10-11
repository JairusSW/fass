import {Kind} from '../format.js';
export interface Type { kind:Kind; name?:string; child?:Type; key?:Type; count?:number; limit?:number; padded?:number; range?:[bigint,bigint]; values?:bigint[]; placement?:number; enumMembers?:{id:number;name:string;value:bigint}[]; }
export interface Field { id:number; name:string; type:Type; optional:boolean; default?:unknown; }
export interface Declaration { name:string; fields:Field[]; identity?:string; }
export interface Source { root:string; maxBytes:number; records:Declaration[]; }
const primitives:Record<string,Kind>={i8:1,u8:2,i16:3,u16:4,i32:5,u32:6,i64:7,u64:8,f32:9,f64:10,bool:11};
export function parse(source:string):Source {
  const tokens=source.match(/"(?:\\.|[^"\\])*"|\/\/[^\n]*|\/\*[\s\S]*?\*\/|@[A-Za-z_]\w*|-?(?:0x[\da-fA-F]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|[A-Za-z_]\w*|[^\s]/g)?.filter(t=>!t.startsWith('//')&&!t.startsWith('/*'))??[];
  let p=0;const records:Declaration[]=[];const enums=new Map<string,Type>();let root='',maxBytes=65536;
  const peek=()=>tokens[p];const take=()=>{if(p>=tokens.length)throw Error('Unexpected end of schema');return tokens[p++];};
  const expect=(s:string)=>{const t=take();if(t!==s)throw Error(`Expected ${s}, got ${t} at token ${p}`);};
  const number=()=>{const n=Number(take());if(!Number.isSafeInteger(n)||n<0||n>0xffffffff)throw Error('Expected u32 bound or identity');return n;};
  function annotations(type?:Type,decl?:Declaration):void {
    while(peek()?.startsWith('@')) {
      const a=take();expect('(');
      if(a==='@max_bytes'||a==='@max_count') {const n=number();if(type)type.limit=n;else maxBytes=n;}
      else if(a==='@descriptor') {if(!type)throw Error('descriptor applies to values');type.padded=number();}
      else if(a==='@range') {if(!type)throw Error('range applies to scalars');const lo=BigInt(take());expect(',');type.range=[lo,BigInt(take())];}
      else if(a==='@inline') {if(!type||type.kind!==Kind.Map)throw Error('inline applies to maps');type.placement=0;}
      else if(a==='@id') {if(!decl)throw Error('id applies to records');decl.identity=JSON.parse(take());}
      else throw Error(`Unknown annotation ${a}`);
      expect(')');
    }
  }
  function type():Type {
    const name=take();let t:Type;
    if(name==='ref') {expect('<');const child=type();expect('>');if(child.kind!==Kind.Record)throw Error('ref requires a record');t={kind:Kind.Ref,child};}
    else if(name==='map') {expect('<');const key=type();expect(',');const child=type();expect('>');t={kind:Kind.Map,key,child,limit:255,placement:1};}
    else if(name==='string')t={kind:Kind.Utf8,limit:255};
    else if(name==='bytes')t={kind:Kind.Array,child:{kind:Kind.U8},limit:255};
    else if(primitives[name])t={kind:primitives[name]};
    else if(enums.has(name))t={...enums.get(name)!};
    else t={kind:Kind.Record,name};
    annotations(t);
    while(peek()==='[') {take();if(peek()===']') {take();t={kind:Kind.Array,child:t,limit:255};}else {const count=number();expect(']');t={kind:Kind.FixedArray,child:t,count};}}
    annotations(t);return t;
  }
  function literal():unknown {
    const t=take();if(t==='{') {const v:Record<string,unknown>={};while(peek()!=='}') {let k=take();if(k.startsWith('"'))k=JSON.parse(k);if(Object.hasOwn(v,k))throw Error('Duplicate literal key');expect(':');v[k]=literal();if(peek()===','||peek()===';')take();}take();return v;}
    if(t==='[') {const a:unknown[]=[];while(peek()!==']') {a.push(literal());if(peek()===',')take();else if(peek()!==']')throw Error('Expected comma');}take();return a;}
    if(t.startsWith('"'))return JSON.parse(t);if(t==='true'||t==='false')return t==='true';if(t==='null')return null;
    if(/^-?\d+$/.test(t)||/^-?0x/.test(t))return BigInt(t);if(Number.isFinite(Number(t)))return Number(t);throw Error(`Invalid literal ${t}`);
  }
  while(p<tokens.length) {
    const tag=take();if(tag==='enum') {const name=take();expect(':');const base=take();if(!primitives[base]||primitives[base]>8)throw Error('Integer enum required');expect('{');const values:bigint[]=[],enumMembers:{id:number;name:string;value:bigint}[]=[];while(peek()!=='}') {let id=enumMembers.length+1;if(/^\d+$/.test(peek()))id=number();const member=take();expect('=');const value=BigInt(take());values.push(value);enumMembers.push({id,name:member,value});if(peek()===','||peek()===';')take();}take();enums.set(name,{kind:primitives[base],name,values,enumMembers});continue;}
    if(tag!=='struct'&&tag!=='message')throw Error(`Expected struct/message, got ${tag}`);
    const decl:Declaration={name:take(),fields:[]};annotations(undefined,decl);if(tag==='message'){if(root)throw Error('Exactly one message required');root=decl.name;}
    expect('{');while(peek()!=='}') {const id=number();const name=take();let optional=false;if(peek()==='?'){take();optional=true;}expect(':');const t=type();if(peek()==='?'){take();optional=true;}const field:Field={id,name,type:t,optional};if(peek()==='='){take();field.default=literal();}if(peek()===';')take();decl.fields.push(field);}
    take();records.push(decl);
  }
  if(!root)root=records[0]?.name??'';return {root,maxBytes,records};
}
