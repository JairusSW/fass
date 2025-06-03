(module
 (type $0 (func (param i32 i32)))
 (type $1 (func (param i32) (result i32)))
 (type $2 (func (param i32)))
 (type $3 (func (param i32 i32) (result i32)))
 (type $4 (func))
 (type $5 (func (param i32 i32 i32) (result i32)))
 (type $6 (func (param i32 i32 i32)))
 (type $7 (func (param i32 f32)))
 (type $8 (func (param i32 i32 i32 i32 i32) (result i32)))
 (type $9 (func (param i32 i32 i32 i32) (result i32)))
 (type $10 (func (param i32 i64 i32)))
 (type $11 (func (param i32 i32 i64) (result i32)))
 (type $12 (func (result i32)))
 (type $13 (func (param i64 i32) (result i32)))
 (type $14 (func (param i32 i64 i32 i32)))
 (type $15 (func (param i32 i64 i32 i64 i32 i64 i32) (result i32)))
 (type $16 (func (param i32 f64 i32) (result i32)))
 (type $17 (func (param i32 f32) (result i32)))
 (type $18 (func (param f32)))
 (type $19 (func (param i32 i64)))
 (type $20 (func (param i64) (result i32)))
 (type $21 (func (param i32 i64) (result i32)))
 (type $22 (func (param i32 i32 i32 i32)))
 (type $23 (func (param i32 i32 f32 i32) (result i32)))
 (type $24 (func (param i32 f32 f32 f32) (result i32)))
 (type $25 (func (param i32 i32 i32 i64 i32 i32) (result i32)))
 (type $26 (func (param i64)))
 (import "wasi_snapshot_preview1" "fd_write" (func $~lib/bindings/wasi_snapshot_preview1/fd_write (param i32 i32 i32 i32) (result i32)))
 (import "wasi_snapshot_preview1" "proc_exit" (func $~lib/bindings/wasi_snapshot_preview1/proc_exit (param i32)))
 (global $~lib/shared/runtime/Runtime.Stub i32 (i32.const 0))
 (global $~lib/shared/runtime/Runtime.Minimal i32 (i32.const 1))
 (global $~lib/shared/runtime/Runtime.Incremental i32 (i32.const 2))
 (global $~lib/native/ASC_SHRINK_LEVEL i32 (i32.const 0))
 (global $~argumentsLength (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/total (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/threshold (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/state (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/visitCount (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/pinSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/iter (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/toSpace (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/white (mut i32) (i32.const 0))
 (global $~lib/rt/itcms/fromSpace (mut i32) (i32.const 0))
 (global $~lib/rt/tlsf/ROOT (mut i32) (i32.const 0))
 (global $~lib/native/ASC_LOW_MEMORY_LIMIT i32 (i32.const 0))
 (global $~lib/native/ASC_RUNTIME i32 (i32.const 2))
 (global $~lib/json-as/lib/as-bs/bs.buffer (mut i32) (i32.const 0))
 (global $~lib/json-as/lib/as-bs/bs.offset (mut i32) (i32.const 0))
 (global $~lib/json-as/lib/as-bs/bs.bufferSize (mut i32) (i32.const 32))
 (global $~lib/json-as/lib/as-bs/bs.stackSize (mut i32) (i32.const 0))
 (global $~lib/json-as/assembly/custom/sink/MIN_BUFFER_LEN i32 (i32.const 32))
 (global $~lib/json-as/assembly/custom/sink/MIN_BUFFER_SIZE i32 (i32.const 64))
 (global $~lib/json-as/assembly/custom/sink/NEW_LINE_CHAR i32 (i32.const 10))
 (global $~lib/json-as/assembly/globals/tables/SERIALIZE_ESCAPE_TABLE i32 (i32.const 1020))
 (global $~lib/json-as/assembly/globals/tables/DESERIALIZE_ESCAPE_TABLE i32 (i32.const 1392))
 (global $~lib/json-as/assembly/globals/tables/ESCAPE_HEX_TABLE i32 (i32.const 1496))
 (global $~lib/json-as/assembly/globals/tables/POW_TEN_TABLE_32 i32 (i32.const 1600))
 (global $~lib/json-as/assembly/globals/tables/POW_TEN_TABLE_64 i32 (i32.const 1640))
 (global $~lib/json-as/assembly/index/JSON.Types.Raw i32 (i32.const 0))
 (global $~lib/json-as/assembly/index/JSON.Types.U8 i32 (i32.const 1))
 (global $~lib/json-as/assembly/index/JSON.Types.U16 i32 (i32.const 2))
 (global $~lib/json-as/assembly/index/JSON.Types.U32 i32 (i32.const 3))
 (global $~lib/json-as/assembly/index/JSON.Types.U64 i32 (i32.const 4))
 (global $~lib/json-as/assembly/index/JSON.Types.F32 i32 (i32.const 5))
 (global $~lib/json-as/assembly/index/JSON.Types.F64 i32 (i32.const 6))
 (global $~lib/json-as/assembly/index/JSON.Types.Null i32 (i32.const 7))
 (global $~lib/json-as/assembly/index/JSON.Types.Bool i32 (i32.const 8))
 (global $~lib/json-as/assembly/index/JSON.Types.String i32 (i32.const 9))
 (global $~lib/json-as/assembly/index/JSON.Types.Object i32 (i32.const 10))
 (global $~lib/json-as/assembly/index/JSON.Types.Array i32 (i32.const 12))
 (global $~lib/json-as/assembly/index/JSON.Types.Struct i32 (i32.const 13))
 (global $~lib/json-as/assembly/index/JSON.Value.METHODS (mut i32) (i32.const 0))
 (global $assembly/test/a1 (mut i32) (i32.const 0))
 (global $~lib/wasi_process/wasi_process.stdout i32 (i32.const 1))
 (global $~lib/wasi_internal/tempbuf i32 (i32.const 2336))
 (global $assembly/test/a2 (mut i32) (i32.const 0))
 (global $assembly/test/a3 (mut i32) (i32.const 0))
 (global $assembly/test/b1 (mut i32) (i32.const 0))
 (global $~lib/util/number/_frc_plus (mut i64) (i64.const 0))
 (global $~lib/util/number/_frc_minus (mut i64) (i64.const 0))
 (global $~lib/util/number/_exp (mut i32) (i32.const 0))
 (global $~lib/util/number/_K (mut i32) (i32.const 0))
 (global $~lib/util/number/_frc_pow (mut i64) (i64.const 0))
 (global $~lib/util/number/_exp_pow (mut i32) (i32.const 0))
 (global $assembly/test/b2 (mut i32) (i32.const 0))
 (global $assembly/test/b3 (mut i32) (i32.const 0))
 (global $assembly/test/p1 (mut i32) (i32.const 0))
 (global $~lib/builtins/u32.MAX_VALUE i32 (i32.const -1))
 (global $assembly/test/p2 (mut i32) (i32.const 0))
 (global $assembly/test/p3 (mut i32) (i32.const 0))
 (global $~lib/rt/__rtti_base i32 (i32.const 8176))
 (global $~lib/memory/__data_end i32 (i32.const 8224))
 (global $~lib/memory/__stack_pointer (mut i32) (i32.const 40992))
 (global $~lib/memory/__heap_base i32 (i32.const 40992))
 (global $~started (mut i32) (i32.const 0))
 (memory $0 1)
 (data $0 (i32.const 12) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00U\00n\00p\00a\00i\00r\00e\00d\00 \00s\00u\00r\00r\00o\00g\00a\00t\00e\00\00\00\00\00\00\00\00\00")
 (data $1 (i32.const 76) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00~\00l\00i\00b\00/\00s\00t\00r\00i\00n\00g\00.\00t\00s\00")
 (data $2 (i32.const 124) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h\00")
 (data $3 (i32.const 172) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s\00\00\00\00\00\00\00")
 (data $4 (i32.const 236) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e\00\00\00\00\00")
 (data $5 (i32.const 300) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00 \00\00\00~\00l\00i\00b\00/\00r\00t\00/\00i\00t\00c\00m\00s\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $6 (i32.const 368) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $7 (i32.const 400) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $8 (i32.const 428) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e\00\00\00\00\00\00\00\00\00")
 (data $9 (i32.const 492) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\14\00\00\00~\00l\00i\00b\00/\00r\00t\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $10 (i32.const 544) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $11 (i32.const 572) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00t\00l\00s\00f\00.\00t\00s\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $12 (i32.const 636) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00t\00r\00u\00e\00\00\00\00\00")
 (data $13 (i32.const 668) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00f\00a\00l\00s\00e\00\00\00")
 (data $14 (i32.const 700) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00n\00u\00l\00l\00\00\00\00\00")
 (data $15 (i32.const 732) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00{\00\00\00\00\00\00\00\00\00\00\00")
 (data $16 (i32.const 764) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00[\00\00\00\00\00\00\00\00\00\00\00")
 (data $17 (i32.const 796) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\04\00\00\00[\00]\00\00\00\00\00\00\00\00\00")
 (data $18 (i32.const 828) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00:\00\00\00\00\00\00\00\00\00\00\00")
 (data $19 (i32.const 860) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00,\00\00\00\00\00\00\00\00\00\00\00")
 (data $20 (i32.const 892) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00}\00\00\00\00\00\00\00\00\00\00\00")
 (data $21 (i32.const 924) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00]\00\00\00\00\00\00\00\00\00\00\00")
 (data $22 (i32.const 956) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00\"\00\00\00\00\00\00\00\00\00\00\00")
 (data $23 (i32.const 988) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\04\00\00\00\"\00\"\00\00\00\00\00\00\00\00\00")
 (data $24 (i32.const 1020) "0\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\00\\\00b\00\\\00t\00\\\00n\000\00b\00\\\00f\00\\\00r\000\00e\000\00f\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\001\00a\001\00b\001\00c\001\00d\001\00e\001\00f\00\00\00\00\00\00\00\00\00\\\00\"\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\\\00\\\00")
 (data $25 (i32.const 1392) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\"\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\\\00\00\00\00\00\08\00\00\00\0c\00\00\00\00\00\00\00\n\00\00\00\r\00\tu\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $26 (i32.const 1544) "\00\01\02\03\04\05\06\07\08\t\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\n\0b\0c\r\0e\0f")
 (data $27 (i32.const 1600) "\01\00\00\00\n\00\00\00\e8\03\00\00\10\'\00\00\a0\86\01\00@B\0f\00\80\96\98\00\00\e1\f5\05\00\ca\9a;")
 (data $28 (i32.const 1640) "\01\00\00\00\00\00\00\00\n\00\00\00\00\00\00\00\e8\03\00\00\00\00\00\00\10\'\00\00\00\00\00\00\a0\86\01\00\00\00\00\00@B\0f\00\00\00\00\00\80\96\98\00\00\00\00\00\00\e1\f5\05\00\00\00\00\00\ca\9a;\00\00\00\00\00\e4\0bT\02\00\00\00\00\e8vH\17\00\00\00\00\10\a5\d4\e8\00\00\00\00\a0rN\18\t\00\00\00@z\10\f3Z\00\00\00\80\c6\a4~\8d\03\00\00\00\c1o\f2\86#\00\00\00\8a]xEc\01\00\00d\a7\b3\b6\e0\r\00\00\e8\89\04#\c7\8a")
 (data $29 (i32.const 1804) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00a\001\00:\00 \00\00\00\00\00")
 (data $30 (i32.const 1836) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\04\00\00\00u\008\00\00\00\00\00\00\00\00\00")
 (data $31 (i32.const 1868) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00u\00s\00i\00z\00e\00\00\00")
 (data $32 (i32.const 1900) "0\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\00")
 (data $33 (i32.const 2300) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $34 (i32.const 2336) "\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $35 (i32.const 2364) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00S\00U\00C\00C\00E\00S\00S\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $36 (i32.const 2412) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00T\00O\00O\00B\00I\00G\00")
 (data $37 (i32.const 2444) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00A\00C\00C\00E\00S\00\00\00")
 (data $38 (i32.const 2476) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\12\00\00\00A\00D\00D\00R\00I\00N\00U\00S\00E\00\00\00\00\00\00\00\00\00\00\00")
 (data $39 (i32.const 2524) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\18\00\00\00A\00D\00D\00R\00N\00O\00T\00A\00V\00A\00I\00L\00\00\00\00\00")
 (data $40 (i32.const 2572) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00A\00F\00N\00O\00S\00U\00P\00P\00O\00R\00T\00\00\00\00\00\00\00")
 (data $41 (i32.const 2620) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00A\00G\00A\00I\00N\00\00\00")
 (data $42 (i32.const 2652) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00A\00L\00R\00E\00A\00D\00Y\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $43 (i32.const 2700) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00B\00A\00D\00F\00\00\00\00\00")
 (data $44 (i32.const 2732) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00B\00A\00D\00M\00S\00G\00")
 (data $45 (i32.const 2764) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00B\00U\00S\00Y\00\00\00\00\00")
 (data $46 (i32.const 2796) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\10\00\00\00C\00A\00N\00C\00E\00L\00E\00D\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $47 (i32.const 2844) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00C\00H\00I\00L\00D\00\00\00")
 (data $48 (i32.const 2876) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00C\00O\00N\00N\00A\00B\00O\00R\00T\00E\00D\00\00\00\00\00\00\00")
 (data $49 (i32.const 2924) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00C\00O\00N\00N\00R\00E\00F\00U\00S\00E\00D\00\00\00\00\00\00\00")
 (data $50 (i32.const 2972) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\12\00\00\00C\00O\00N\00N\00R\00E\00S\00E\00T\00\00\00\00\00\00\00\00\00\00\00")
 (data $51 (i32.const 3020) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00D\00E\00A\00D\00L\00K\00")
 (data $52 (i32.const 3052) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00D\00E\00S\00T\00A\00D\00D\00R\00R\00E\00Q\00\00\00\00\00\00\00")
 (data $53 (i32.const 3100) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\06\00\00\00D\00O\00M\00\00\00\00\00\00\00")
 (data $54 (i32.const 3132) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00D\00Q\00U\00O\00T\00\00\00")
 (data $55 (i32.const 3164) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00E\00X\00I\00S\00T\00\00\00")
 (data $56 (i32.const 3196) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00F\00A\00U\00L\00T\00\00\00")
 (data $57 (i32.const 3228) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00F\00B\00I\00G\00\00\00\00\00")
 (data $58 (i32.const 3260) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00H\00O\00S\00T\00U\00N\00R\00E\00A\00C\00H\00\00\00\00\00\00\00")
 (data $59 (i32.const 3308) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00I\00D\00R\00M\00\00\00\00\00")
 (data $60 (i32.const 3340) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00I\00L\00S\00E\00Q\00\00\00")
 (data $61 (i32.const 3372) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\14\00\00\00I\00N\00P\00R\00O\00G\00R\00E\00S\00S\00\00\00\00\00\00\00\00\00")
 (data $62 (i32.const 3420) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00I\00N\00T\00R\00\00\00\00\00")
 (data $63 (i32.const 3452) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00I\00N\00V\00A\00L\00\00\00")
 (data $64 (i32.const 3484) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\04\00\00\00I\00O\00\00\00\00\00\00\00\00\00")
 (data $65 (i32.const 3516) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00I\00S\00C\00O\00N\00N\00")
 (data $66 (i32.const 3548) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00I\00S\00D\00I\00R\00\00\00")
 (data $67 (i32.const 3580) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00L\00O\00O\00P\00\00\00\00\00")
 (data $68 (i32.const 3612) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00M\00F\00I\00L\00E\00\00\00")
 (data $69 (i32.const 3644) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00M\00L\00I\00N\00K\00\00\00")
 (data $70 (i32.const 3676) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00M\00S\00G\00S\00I\00Z\00E\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $71 (i32.const 3724) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\10\00\00\00M\00U\00L\00T\00I\00H\00O\00P\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $72 (i32.const 3772) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\16\00\00\00N\00A\00M\00E\00T\00O\00O\00L\00O\00N\00G\00\00\00\00\00\00\00")
 (data $73 (i32.const 3820) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00N\00E\00T\00D\00O\00W\00N\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $74 (i32.const 3868) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\10\00\00\00N\00E\00T\00R\00E\00S\00E\00T\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $75 (i32.const 3916) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\14\00\00\00N\00E\00T\00U\00N\00R\00E\00A\00C\00H\00\00\00\00\00\00\00\00\00")
 (data $76 (i32.const 3964) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00F\00I\00L\00E\00\00\00")
 (data $77 (i32.const 3996) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00N\00O\00B\00U\00F\00S\00")
 (data $78 (i32.const 4028) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00D\00E\00V\00\00\00")
 (data $79 (i32.const 4060) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00E\00N\00T\00\00\00")
 (data $80 (i32.const 4092) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00N\00O\00E\00X\00E\00C\00")
 (data $81 (i32.const 4124) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00L\00C\00K\00\00\00")
 (data $82 (i32.const 4156) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00N\00O\00L\00I\00N\00K\00")
 (data $83 (i32.const 4188) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00M\00E\00M\00\00\00")
 (data $84 (i32.const 4220) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00M\00S\00G\00\00\00")
 (data $85 (i32.const 4252) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\14\00\00\00N\00O\00P\00R\00O\00T\00O\00O\00P\00T\00\00\00\00\00\00\00\00\00")
 (data $86 (i32.const 4300) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00S\00P\00C\00\00\00")
 (data $87 (i32.const 4332) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00S\00Y\00S\00\00\00")
 (data $88 (i32.const 4364) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00N\00O\00T\00C\00O\00N\00N\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $89 (i32.const 4412) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00N\00O\00T\00D\00I\00R\00")
 (data $90 (i32.const 4444) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\10\00\00\00N\00O\00T\00E\00M\00P\00T\00Y\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $91 (i32.const 4492) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00N\00O\00T\00R\00E\00C\00O\00V\00E\00R\00A\00B\00L\00E\00")
 (data $92 (i32.const 4540) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00N\00O\00T\00S\00O\00C\00K\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $93 (i32.const 4588) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00N\00O\00T\00S\00U\00P\00")
 (data $94 (i32.const 4620) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00N\00O\00T\00T\00Y\00\00\00")
 (data $95 (i32.const 4652) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00N\00X\00I\00O\00\00\00\00\00")
 (data $96 (i32.const 4684) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\10\00\00\00O\00V\00E\00R\00F\00L\00O\00W\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $97 (i32.const 4732) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\12\00\00\00O\00W\00N\00E\00R\00D\00E\00A\00D\00\00\00\00\00\00\00\00\00\00\00")
 (data $98 (i32.const 4780) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00P\00E\00R\00M\00\00\00\00\00")
 (data $99 (i32.const 4812) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00P\00I\00P\00E\00\00\00\00\00")
 (data $100 (i32.const 4844) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00P\00R\00O\00T\00O\00\00\00")
 (data $101 (i32.const 4876) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1c\00\00\00P\00R\00O\00T\00O\00N\00O\00S\00U\00P\00P\00O\00R\00T\00")
 (data $102 (i32.const 4924) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\12\00\00\00P\00R\00O\00T\00O\00T\00Y\00P\00E\00\00\00\00\00\00\00\00\00\00\00")
 (data $103 (i32.const 4972) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00R\00A\00N\00G\00E\00\00\00")
 (data $104 (i32.const 5004) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00R\00O\00F\00S\00\00\00\00\00")
 (data $105 (i32.const 5036) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00S\00P\00I\00P\00E\00\00\00")
 (data $106 (i32.const 5068) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00S\00R\00C\00H\00\00\00\00\00")
 (data $107 (i32.const 5100) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\n\00\00\00S\00T\00A\00L\00E\00\00\00")
 (data $108 (i32.const 5132) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\10\00\00\00T\00I\00M\00E\00D\00O\00U\00T\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $109 (i32.const 5180) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0c\00\00\00T\00X\00T\00B\00S\00Y\00")
 (data $110 (i32.const 5212) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00X\00D\00E\00V\00\00\00\00\00")
 (data $111 (i32.const 5244) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\14\00\00\00N\00O\00T\00C\00A\00P\00A\00B\00L\00E\00\00\00\00\00\00\00\00\00")
 (data $112 (i32.const 5292) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\0e\00\00\00U\00N\00K\00N\00O\00W\00N\00\00\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $113 (i32.const 5340) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00(\00\00\00~\00l\00i\00b\00/\00w\00a\00s\00i\00_\00p\00r\00o\00c\00e\00s\00s\00.\00t\00s\00\00\00\00\00")
 (data $114 (i32.const 5404) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00\n\00\00\00\00\00\00\00\00\00\00\00")
 (data $115 (i32.const 5436) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00a\002\00:\00 \00\00\00\00\00")
 (data $116 (i32.const 5468) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s\00\00\00\00\00\00\00\00\00")
 (data $117 (i32.const 5532) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\00 \00\00\00\00\00\00\00\00\00\00\00")
 (data $118 (i32.const 5564) "|\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00d\00\00\00t\00o\00S\00t\00r\00i\00n\00g\00(\00)\00 \00r\00a\00d\00i\00x\00 \00a\00r\00g\00u\00m\00e\00n\00t\00 \00m\00u\00s\00t\00 \00b\00e\00 \00b\00e\00t\00w\00e\00e\00n\00 \002\00 \00a\00n\00d\00 \003\006\00\00\00\00\00\00\00\00\00")
 (data $119 (i32.const 5692) "<\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00u\00t\00i\00l\00/\00n\00u\00m\00b\00e\00r\00.\00t\00s\00\00\00\00\00\00\00")
 (data $120 (i32.const 5756) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\02\00\00\000\00\00\00\00\00\00\00\00\00\00\00")
 (data $121 (i32.const 5788) "\1c\04\00\00\00\00\00\00\00\00\00\00\02\00\00\00\00\04\00\000\000\000\001\000\002\000\003\000\004\000\005\000\006\000\007\000\008\000\009\000\00a\000\00b\000\00c\000\00d\000\00e\000\00f\001\000\001\001\001\002\001\003\001\004\001\005\001\006\001\007\001\008\001\009\001\00a\001\00b\001\00c\001\00d\001\00e\001\00f\002\000\002\001\002\002\002\003\002\004\002\005\002\006\002\007\002\008\002\009\002\00a\002\00b\002\00c\002\00d\002\00e\002\00f\003\000\003\001\003\002\003\003\003\004\003\005\003\006\003\007\003\008\003\009\003\00a\003\00b\003\00c\003\00d\003\00e\003\00f\004\000\004\001\004\002\004\003\004\004\004\005\004\006\004\007\004\008\004\009\004\00a\004\00b\004\00c\004\00d\004\00e\004\00f\005\000\005\001\005\002\005\003\005\004\005\005\005\006\005\007\005\008\005\009\005\00a\005\00b\005\00c\005\00d\005\00e\005\00f\006\000\006\001\006\002\006\003\006\004\006\005\006\006\006\007\006\008\006\009\006\00a\006\00b\006\00c\006\00d\006\00e\006\00f\007\000\007\001\007\002\007\003\007\004\007\005\007\006\007\007\007\008\007\009\007\00a\007\00b\007\00c\007\00d\007\00e\007\00f\008\000\008\001\008\002\008\003\008\004\008\005\008\006\008\007\008\008\008\009\008\00a\008\00b\008\00c\008\00d\008\00e\008\00f\009\000\009\001\009\002\009\003\009\004\009\005\009\006\009\007\009\008\009\009\009\00a\009\00b\009\00c\009\00d\009\00e\009\00f\00a\000\00a\001\00a\002\00a\003\00a\004\00a\005\00a\006\00a\007\00a\008\00a\009\00a\00a\00a\00b\00a\00c\00a\00d\00a\00e\00a\00f\00b\000\00b\001\00b\002\00b\003\00b\004\00b\005\00b\006\00b\007\00b\008\00b\009\00b\00a\00b\00b\00b\00c\00b\00d\00b\00e\00b\00f\00c\000\00c\001\00c\002\00c\003\00c\004\00c\005\00c\006\00c\007\00c\008\00c\009\00c\00a\00c\00b\00c\00c\00c\00d\00c\00e\00c\00f\00d\000\00d\001\00d\002\00d\003\00d\004\00d\005\00d\006\00d\007\00d\008\00d\009\00d\00a\00d\00b\00d\00c\00d\00d\00d\00e\00d\00f\00e\000\00e\001\00e\002\00e\003\00e\004\00e\005\00e\006\00e\007\00e\008\00e\009\00e\00a\00e\00b\00e\00c\00e\00d\00e\00e\00e\00f\00f\000\00f\001\00f\002\00f\003\00f\004\00f\005\00f\006\00f\007\00f\008\00f\009\00f\00a\00f\00b\00f\00c\00f\00d\00f\00e\00f\00f\00\00\00\00\00\00\00\00\00\00\00\00\00")
 (data $122 (i32.const 6844) "\\\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00H\00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f\00g\00h\00i\00j\00k\00l\00m\00n\00o\00p\00q\00r\00s\00t\00u\00v\00w\00x\00y\00z\00\00\00\00\00")
 (data $123 (i32.const 6940) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00a\003\00:\00 \00\00\00\00\00")
 (data $124 (i32.const 6972) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00b\001\00:\00 \00\00\00\00\00")
 (data $125 (i32.const 7008) "\88\02\1c\08\a0\d5\8f\fav\bf>\a2\7f\e1\ae\bav\acU0 \fb\16\8b\ea5\ce]J\89B\cf-;eU\aa\b0k\9a\dfE\1a=\03\cf\1a\e6\ca\c6\9a\c7\17\fep\abO\dc\bc\be\fc\b1w\ff\0c\d6kA\ef\91V\be<\fc\7f\90\ad\1f\d0\8d\83\9aU1(\\Q\d3\b5\c9\a6\ad\8f\acq\9d\cb\8b\ee#w\"\9c\eamSx@\91I\cc\aeW\ce\b6]y\12<\827V\fbM6\94\10\c2O\98H8o\ea\96\90\c7:\82%\cb\85t\d7\f4\97\bf\97\cd\cf\86\a0\e5\ac*\17\98\n4\ef\8e\b25*\fbg8\b2;?\c6\d2\df\d4\c8\84\ba\cd\d3\1a\'D\dd\c5\96\c9%\bb\ce\9fk\93\84\a5b}$l\ac\db\f6\da_\rXf\ab\a3&\f1\c3\de\93\f8\e2\f3\b8\80\ff\aa\a8\ad\b5\b5\8bJ|l\05_b\87S0\c14`\ff\bc\c9U&\ba\91\8c\85N\96\bd~)p$w\f9\df\8f\b8\e5\b8\9f\bd\df\a6\94}t\88\cf_\a9\f8\cf\9b\a8\8f\93pD\b9k\15\0f\bf\f8\f0\08\8a\b611eU%\b0\cd\ac\7f{\d0\c6\e2?\99\06;+*\c4\10\\\e4\d3\92si\99$$\aa\0e\ca\00\83\f2\b5\87\fd\eb\1a\11\92d\08\e5\bc\cc\88Po\t\cc\bc\8c,e\19\e2X\17\b7\d1\00\00\00\00\00\00@\9c\00\00\00\00\10\a5\d4\e8\00\00b\ac\c5\ebx\ad\84\t\94\f8x9?\81\b3\15\07\c9{\ce\97\c0p\\\ea{\ce2~\8fh\80\e9\ab\a48\d2\d5E\"\9a\17&\'O\9f\'\fb\c4\d41\a2c\ed\a8\ad\c8\8c8e\de\b0\dbe\ab\1a\8e\08\c7\83\9a\1dqB\f9\1d]\c4X\e7\1b\a6,iM\92\ea\8dp\1ad\ee\01\daJw\ef\9a\99\a3m\a2\85k}\b4{x\t\f2w\18\ddy\a1\e4T\b4\c2\c5\9b[\92\86[\86=]\96\c8\c5S5\c8\b3\a0\97\fa\\\b4*\95\e3_\a0\99\bd\9fF\de%\8c9\db4\c2\9b\a5\\\9f\98\a3r\9a\c6\f6\ce\be\e9TS\bf\dc\b7\e2A\"\f2\17\f3\fc\88\a5x\\\d3\9b\ce \cc\dfS!{\f3Z\16\98:0\1f\97\dc\b5\a0\e2\96\b3\e3\\S\d1\d9\a8<D\a7\a4\d9|\9b\fb\10D\a4\a7LLv\bb\1a\9c@\b6\ef\8e\ab\8b,\84W\a6\10\ef\1f\d0)1\91\e9\e5\a4\10\9b\9d\0c\9c\a1\fb\9b\10\e7)\f4;b\d9 (\ac\85\cf\a7z^KD\80-\dd\ac\03@\e4!\bf\8f\ffD^/\9cg\8eA\b8\8c\9c\9d\173\d4\a9\1b\e3\b4\92\db\19\9e\d9w\df\ban\bf\96\ebk\ee\f0\9b;\02\87\af")
 (data $126 (i32.const 7704) "<\fbW\fbr\fb\8c\fb\a7\fb\c1\fb\dc\fb\f6\fb\11\fc,\fcF\fca\fc{\fc\96\fc\b1\fc\cb\fc\e6\fc\00\fd\1b\fd5\fdP\fdk\fd\85\fd\a0\fd\ba\fd\d5\fd\ef\fd\n\fe%\fe?\feZ\fet\fe\8f\fe\a9\fe\c4\fe\df\fe\f9\fe\14\ff.\ffI\ffc\ff~\ff\99\ff\b3\ff\ce\ff\e8\ff\03\00\1e\008\00S\00m\00\88\00\a2\00\bd\00\d8\00\f2\00\r\01\'\01B\01\\\01w\01\92\01\ac\01\c7\01\e1\01\fc\01\16\021\02L\02f\02\81\02\9b\02\b6\02\d0\02\eb\02\06\03 \03;\03U\03p\03\8b\03\a5\03\c0\03\da\03\f5\03\0f\04*\04")
 (data $127 (i32.const 7880) "\01\00\00\00\n\00\00\00d\00\00\00\e8\03\00\00\10\'\00\00\a0\86\01\00@B\0f\00\80\96\98\00\00\e1\f5\05\00\ca\9a;")
 (data $128 (i32.const 7932) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00b\002\00:\00 \00\00\00\00\00")
 (data $129 (i32.const 7964) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00b\003\00:\00 \00\00\00\00\00")
 (data $130 (i32.const 7996) ",\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\1a\00\00\00J\00a\00i\00r\00u\00s\00 \00T\00a\00n\00a\00k\00a\00\00\00")
 (data $131 (i32.const 8044) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00p\001\00:\00 \00\00\00\00\00")
 (data $132 (i32.const 8076) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\06\00\00\00u\006\004\00\00\00\00\00\00\00")
 (data $133 (i32.const 8108) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00p\002\00:\00 \00\00\00\00\00")
 (data $134 (i32.const 8140) "\1c\00\00\00\00\00\00\00\00\00\00\00\02\00\00\00\08\00\00\00p\003\00:\00 \00\00\00\00\00")
 (data $135 (i32.const 8176) "\0b\00\00\00 \00\00\00 \00\00\00 \00\00\00\00\00\00\00 \00\00\00\10\01\02\00 \00\00\00A\00\00\00\00\00\00\00 \00\00\00\00\00\00\00")
 (table $0 1 1 funcref)
 (elem $0 (i32.const 1))
 (export "memory" (memory $0))
 (export "_start" (func $~start))
 (func $~lib/bindings/wasi_snapshot_preview1/iovec#set:buf (param $this i32) (param $buf i32)
  local.get $this
  local.get $buf
  i32.store
 )
 (func $~lib/rt/common/OBJECT#get:rtSize (param $this i32) (result i32)
  local.get $this
  i32.load offset=16
 )
 (func $~lib/string/String#get:length (param $this i32) (result i32)
  local.get $this
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  i32.const 1
  i32.shr_u
  return
 )
 (func $~lib/util/string/compareImpl (param $str1 i32) (param $index1 i32) (param $str2 i32) (param $index2 i32) (param $len i32) (result i32)
  (local $ptr1 i32)
  (local $ptr2 i32)
  (local $7 i32)
  (local $a i32)
  (local $b i32)
  local.get $str1
  local.get $index1
  i32.const 1
  i32.shl
  i32.add
  local.set $ptr1
  local.get $str2
  local.get $index2
  i32.const 1
  i32.shl
  i32.add
  local.set $ptr2
  i32.const 0
  i32.const 2
  i32.lt_s
  drop
  local.get $len
  i32.const 4
  i32.ge_u
  if (result i32)
   local.get $ptr1
   i32.const 7
   i32.and
   local.get $ptr2
   i32.const 7
   i32.and
   i32.or
   i32.eqz
  else
   i32.const 0
  end
  if
   block $do-break|0
    loop $do-loop|0
     local.get $ptr1
     i64.load
     local.get $ptr2
     i64.load
     i64.ne
     if
      br $do-break|0
     end
     local.get $ptr1
     i32.const 8
     i32.add
     local.set $ptr1
     local.get $ptr2
     i32.const 8
     i32.add
     local.set $ptr2
     local.get $len
     i32.const 4
     i32.sub
     local.set $len
     local.get $len
     i32.const 4
     i32.ge_u
     br_if $do-loop|0
    end
   end
  end
  loop $while-continue|1
   local.get $len
   local.tee $7
   i32.const 1
   i32.sub
   local.set $len
   local.get $7
   if
    local.get $ptr1
    i32.load16_u
    local.set $a
    local.get $ptr2
    i32.load16_u
    local.set $b
    local.get $a
    local.get $b
    i32.ne
    if
     local.get $a
     local.get $b
     i32.sub
     return
    end
    local.get $ptr1
    i32.const 2
    i32.add
    local.set $ptr1
    local.get $ptr2
    i32.const 2
    i32.add
    local.set $ptr2
    br $while-continue|1
   end
  end
  i32.const 0
  return
 )
 (func $~lib/string/String.UTF8.encodeUnsafe (param $str i32) (param $len i32) (param $buf i32) (param $nullTerminated i32) (param $errorMode i32) (result i32)
  (local $strEnd i32)
  (local $bufOff i32)
  (local $c1 i32)
  (local $b0 i32)
  (local $b1 i32)
  (local $c2 i32)
  (local $b0|11 i32)
  (local $b1|12 i32)
  (local $b2 i32)
  (local $b3 i32)
  (local $b0|15 i32)
  (local $b1|16 i32)
  (local $b2|17 i32)
  (local $18 i32)
  local.get $str
  local.get $len
  i32.const 1
  i32.shl
  i32.add
  local.set $strEnd
  local.get $buf
  local.set $bufOff
  loop $while-continue|0
   local.get $str
   local.get $strEnd
   i32.lt_u
   if
    local.get $str
    i32.load16_u
    local.set $c1
    local.get $c1
    i32.const 128
    i32.lt_u
    if
     local.get $bufOff
     local.get $c1
     i32.store8
     local.get $bufOff
     i32.const 1
     i32.add
     local.set $bufOff
     local.get $nullTerminated
     local.get $c1
     i32.eqz
     i32.and
     if
      local.get $bufOff
      local.get $buf
      i32.sub
      return
     end
    else
     local.get $c1
     i32.const 2048
     i32.lt_u
     if
      local.get $c1
      i32.const 6
      i32.shr_u
      i32.const 192
      i32.or
      local.set $b0
      local.get $c1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      local.set $b1
      local.get $bufOff
      local.get $b1
      i32.const 8
      i32.shl
      local.get $b0
      i32.or
      i32.store16
      local.get $bufOff
      i32.const 2
      i32.add
      local.set $bufOff
     else
      local.get $c1
      i32.const 63488
      i32.and
      i32.const 55296
      i32.eq
      if
       local.get $c1
       i32.const 56320
       i32.lt_u
       if (result i32)
        local.get $str
        i32.const 2
        i32.add
        local.get $strEnd
        i32.lt_u
       else
        i32.const 0
       end
       if
        local.get $str
        i32.load16_u offset=2
        local.set $c2
        local.get $c2
        i32.const 64512
        i32.and
        i32.const 56320
        i32.eq
        if
         i32.const 65536
         local.get $c1
         i32.const 1023
         i32.and
         i32.const 10
         i32.shl
         i32.add
         local.get $c2
         i32.const 1023
         i32.and
         i32.or
         local.set $c1
         local.get $c1
         i32.const 18
         i32.shr_u
         i32.const 240
         i32.or
         local.set $b0|11
         local.get $c1
         i32.const 12
         i32.shr_u
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         local.set $b1|12
         local.get $c1
         i32.const 6
         i32.shr_u
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         local.set $b2
         local.get $c1
         i32.const 63
         i32.and
         i32.const 128
         i32.or
         local.set $b3
         local.get $bufOff
         local.get $b3
         i32.const 24
         i32.shl
         local.get $b2
         i32.const 16
         i32.shl
         i32.or
         local.get $b1|12
         i32.const 8
         i32.shl
         i32.or
         local.get $b0|11
         i32.or
         i32.store
         local.get $bufOff
         i32.const 4
         i32.add
         local.set $bufOff
         local.get $str
         i32.const 4
         i32.add
         local.set $str
         br $while-continue|0
        end
       end
       local.get $errorMode
       i32.const 0
       i32.ne
       if
        local.get $errorMode
        i32.const 2
        i32.eq
        if
         i32.const 32
         i32.const 96
         i32.const 742
         i32.const 49
         call $~lib/wasi_internal/wasi_abort
         unreachable
        end
        i32.const 65533
        local.set $c1
       end
      end
      local.get $c1
      i32.const 12
      i32.shr_u
      i32.const 224
      i32.or
      local.set $b0|15
      local.get $c1
      i32.const 6
      i32.shr_u
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      local.set $b1|16
      local.get $c1
      i32.const 63
      i32.and
      i32.const 128
      i32.or
      local.set $b2|17
      local.get $bufOff
      local.get $b1|16
      i32.const 8
      i32.shl
      local.get $b0|15
      i32.or
      i32.store16
      local.get $bufOff
      local.get $b2|17
      i32.store8 offset=2
      local.get $bufOff
      i32.const 3
      i32.add
      local.set $bufOff
     end
    end
    local.get $str
    i32.const 2
    i32.add
    local.set $str
    br $while-continue|0
   end
  end
  local.get $nullTerminated
  if
   local.get $bufOff
   local.tee $18
   i32.const 1
   i32.add
   local.set $bufOff
   local.get $18
   i32.const 0
   i32.store8
  end
  local.get $bufOff
  local.get $buf
  i32.sub
  return
 )
 (func $~lib/string/String.UTF8.encodeUnsafe@varargs (param $str i32) (param $len i32) (param $buf i32) (param $nullTerminated i32) (param $errorMode i32) (result i32)
  block $2of2
   block $1of2
    block $0of2
     block $outOfRange
      global.get $~argumentsLength
      i32.const 3
      i32.sub
      br_table $0of2 $1of2 $2of2 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $nullTerminated
   end
   i32.const 0
   local.set $errorMode
  end
  local.get $str
  local.get $len
  local.get $buf
  local.get $nullTerminated
  local.get $errorMode
  call $~lib/string/String.UTF8.encodeUnsafe
 )
 (func $~lib/util/number/decimalCount32 (param $value i32) (result i32)
  local.get $value
  i32.const 100000
  i32.lt_u
  if
   local.get $value
   i32.const 100
   i32.lt_u
   if
    i32.const 1
    local.get $value
    i32.const 10
    i32.ge_u
    i32.add
    return
   else
    i32.const 3
    local.get $value
    i32.const 10000
    i32.ge_u
    i32.add
    local.get $value
    i32.const 1000
    i32.ge_u
    i32.add
    return
   end
   unreachable
  else
   local.get $value
   i32.const 10000000
   i32.lt_u
   if
    i32.const 6
    local.get $value
    i32.const 1000000
    i32.ge_u
    i32.add
    return
   else
    i32.const 8
    local.get $value
    i32.const 1000000000
    i32.ge_u
    i32.add
    local.get $value
    i32.const 100000000
    i32.ge_u
    i32.add
    return
   end
   unreachable
  end
  unreachable
 )
 (func $~lib/bindings/wasi_snapshot_preview1/iovec#set:buf_len (param $this i32) (param $buf_len i32)
  local.get $this
  local.get $buf_len
  i32.store offset=4
 )
 (func $~lib/rt/itcms/Object#set:nextWithColor (param $this i32) (param $nextWithColor i32)
  local.get $this
  local.get $nextWithColor
  i32.store offset=4
 )
 (func $~lib/rt/itcms/Object#set:prev (param $this i32) (param $prev i32)
  local.get $this
  local.get $prev
  i32.store offset=8
 )
 (func $~lib/rt/itcms/initLazy (param $space i32) (result i32)
  local.get $space
  local.get $space
  call $~lib/rt/itcms/Object#set:nextWithColor
  local.get $space
  local.get $space
  call $~lib/rt/itcms/Object#set:prev
  local.get $space
  return
 )
 (func $~lib/rt/itcms/Object#get:nextWithColor (param $this i32) (result i32)
  local.get $this
  i32.load offset=4
 )
 (func $~lib/rt/itcms/Object#get:next (param $this i32) (result i32)
  local.get $this
  call $~lib/rt/itcms/Object#get:nextWithColor
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  return
 )
 (func $~lib/rt/itcms/Object#get:color (param $this i32) (result i32)
  local.get $this
  call $~lib/rt/itcms/Object#get:nextWithColor
  i32.const 3
  i32.and
  return
 )
 (func $~lib/rt/itcms/visitRoots (param $cookie i32)
  (local $pn i32)
  (local $iter i32)
  local.get $cookie
  call $~lib/rt/__visit_globals
  global.get $~lib/rt/itcms/pinSpace
  local.set $pn
  local.get $pn
  call $~lib/rt/itcms/Object#get:next
  local.set $iter
  loop $while-continue|0
   local.get $iter
   local.get $pn
   i32.ne
   if
    i32.const 1
    drop
    local.get $iter
    call $~lib/rt/itcms/Object#get:color
    i32.const 3
    i32.eq
    i32.eqz
    if
     i32.const 0
     i32.const 320
     i32.const 160
     i32.const 16
     call $~lib/wasi_internal/wasi_abort
     unreachable
    end
    local.get $iter
    i32.const 20
    i32.add
    local.get $cookie
    call $~lib/rt/__visit_members
    local.get $iter
    call $~lib/rt/itcms/Object#get:next
    local.set $iter
    br $while-continue|0
   end
  end
 )
 (func $~lib/rt/itcms/Object#set:color (param $this i32) (param $color i32)
  local.get $this
  local.get $this
  call $~lib/rt/itcms/Object#get:nextWithColor
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.get $color
  i32.or
  call $~lib/rt/itcms/Object#set:nextWithColor
 )
 (func $~lib/rt/itcms/Object#get:prev (param $this i32) (result i32)
  local.get $this
  i32.load offset=8
 )
 (func $~lib/rt/itcms/Object#set:next (param $this i32) (param $obj i32)
  local.get $this
  local.get $obj
  local.get $this
  call $~lib/rt/itcms/Object#get:nextWithColor
  i32.const 3
  i32.and
  i32.or
  call $~lib/rt/itcms/Object#set:nextWithColor
 )
 (func $~lib/rt/itcms/Object#unlink (param $this i32)
  (local $next i32)
  (local $prev i32)
  local.get $this
  call $~lib/rt/itcms/Object#get:next
  local.set $next
  local.get $next
  i32.const 0
  i32.eq
  if
   i32.const 1
   drop
   local.get $this
   call $~lib/rt/itcms/Object#get:prev
   i32.const 0
   i32.eq
   if (result i32)
    local.get $this
    global.get $~lib/memory/__heap_base
    i32.lt_u
   else
    i32.const 0
   end
   i32.eqz
   if
    i32.const 0
    i32.const 320
    i32.const 128
    i32.const 18
    call $~lib/wasi_internal/wasi_abort
    unreachable
   end
   return
  end
  local.get $this
  call $~lib/rt/itcms/Object#get:prev
  local.set $prev
  i32.const 1
  drop
  local.get $prev
  i32.eqz
  if
   i32.const 0
   i32.const 320
   i32.const 132
   i32.const 16
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $next
  local.get $prev
  call $~lib/rt/itcms/Object#set:prev
  local.get $prev
  local.get $next
  call $~lib/rt/itcms/Object#set:next
 )
 (func $~lib/rt/itcms/Object#get:rtId (param $this i32) (result i32)
  local.get $this
  i32.load offset=12
 )
 (func $~lib/shared/typeinfo/Typeinfo#get:flags (param $this i32) (result i32)
  local.get $this
  i32.load
 )
 (func $~lib/rt/__typeinfo (param $id i32) (result i32)
  (local $ptr i32)
  global.get $~lib/rt/__rtti_base
  local.set $ptr
  local.get $id
  local.get $ptr
  i32.load
  i32.gt_u
  if
   i32.const 448
   i32.const 512
   i32.const 21
   i32.const 28
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $ptr
  i32.const 4
  i32.add
  local.get $id
  i32.const 4
  i32.mul
  i32.add
  call $~lib/shared/typeinfo/Typeinfo#get:flags
  return
 )
 (func $~lib/rt/itcms/Object#get:isPointerfree (param $this i32) (result i32)
  (local $rtId i32)
  local.get $this
  call $~lib/rt/itcms/Object#get:rtId
  local.set $rtId
  local.get $rtId
  i32.const 2
  i32.le_u
  if (result i32)
   i32.const 1
  else
   local.get $rtId
   call $~lib/rt/__typeinfo
   i32.const 32
   i32.and
   i32.const 0
   i32.ne
  end
  return
 )
 (func $~lib/rt/itcms/Object#linkTo (param $this i32) (param $list i32) (param $withColor i32)
  (local $prev i32)
  local.get $list
  call $~lib/rt/itcms/Object#get:prev
  local.set $prev
  local.get $this
  local.get $list
  local.get $withColor
  i32.or
  call $~lib/rt/itcms/Object#set:nextWithColor
  local.get $this
  local.get $prev
  call $~lib/rt/itcms/Object#set:prev
  local.get $prev
  local.get $this
  call $~lib/rt/itcms/Object#set:next
  local.get $list
  local.get $this
  call $~lib/rt/itcms/Object#set:prev
 )
 (func $~lib/rt/itcms/Object#makeGray (param $this i32)
  (local $1 i32)
  local.get $this
  global.get $~lib/rt/itcms/iter
  i32.eq
  if
   local.get $this
   call $~lib/rt/itcms/Object#get:prev
   local.tee $1
   i32.eqz
   if (result i32)
    i32.const 0
    i32.const 320
    i32.const 148
    i32.const 30
    call $~lib/wasi_internal/wasi_abort
    unreachable
   else
    local.get $1
   end
   global.set $~lib/rt/itcms/iter
  end
  local.get $this
  call $~lib/rt/itcms/Object#unlink
  local.get $this
  global.get $~lib/rt/itcms/toSpace
  local.get $this
  call $~lib/rt/itcms/Object#get:isPointerfree
  if (result i32)
   global.get $~lib/rt/itcms/white
   i32.eqz
  else
   i32.const 2
  end
  call $~lib/rt/itcms/Object#linkTo
 )
 (func $~lib/rt/itcms/__visit (param $ptr i32) (param $cookie i32)
  (local $obj i32)
  local.get $ptr
  i32.eqz
  if
   return
  end
  local.get $ptr
  i32.const 20
  i32.sub
  local.set $obj
  i32.const 0
  drop
  local.get $obj
  call $~lib/rt/itcms/Object#get:color
  global.get $~lib/rt/itcms/white
  i32.eq
  if
   local.get $obj
   call $~lib/rt/itcms/Object#makeGray
   global.get $~lib/rt/itcms/visitCount
   i32.const 1
   i32.add
   global.set $~lib/rt/itcms/visitCount
  end
 )
 (func $~lib/rt/itcms/visitStack (param $cookie i32)
  (local $ptr i32)
  global.get $~lib/memory/__stack_pointer
  local.set $ptr
  loop $while-continue|0
   local.get $ptr
   global.get $~lib/memory/__heap_base
   i32.lt_u
   if
    local.get $ptr
    i32.load
    local.get $cookie
    call $~lib/rt/itcms/__visit
    local.get $ptr
    i32.const 4
    i32.add
    local.set $ptr
    br $while-continue|0
   end
  end
 )
 (func $~lib/rt/common/BLOCK#get:mmInfo (param $this i32) (result i32)
  local.get $this
  i32.load
 )
 (func $~lib/rt/itcms/Object#get:size (param $this i32) (result i32)
  i32.const 4
  local.get $this
  call $~lib/rt/common/BLOCK#get:mmInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  i32.add
  return
 )
 (func $~lib/rt/tlsf/Root#set:flMap (param $this i32) (param $flMap i32)
  local.get $this
  local.get $flMap
  i32.store
 )
 (func $~lib/rt/common/BLOCK#set:mmInfo (param $this i32) (param $mmInfo i32)
  local.get $this
  local.get $mmInfo
  i32.store
 )
 (func $~lib/rt/tlsf/Block#set:prev (param $this i32) (param $prev i32)
  local.get $this
  local.get $prev
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/Block#set:next (param $this i32) (param $next i32)
  local.get $this
  local.get $next
  i32.store offset=8
 )
 (func $~lib/rt/tlsf/Block#get:prev (param $this i32) (result i32)
  local.get $this
  i32.load offset=4
 )
 (func $~lib/rt/tlsf/Block#get:next (param $this i32) (result i32)
  local.get $this
  i32.load offset=8
 )
 (func $~lib/rt/tlsf/Root#get:flMap (param $this i32) (result i32)
  local.get $this
  i32.load
 )
 (func $~lib/rt/tlsf/removeBlock (param $root i32) (param $block i32)
  (local $blockInfo i32)
  (local $size i32)
  (local $fl i32)
  (local $sl i32)
  (local $6 i32)
  (local $7 i32)
  (local $boundedSize i32)
  (local $prev i32)
  (local $next i32)
  (local $root|11 i32)
  (local $fl|12 i32)
  (local $sl|13 i32)
  (local $root|14 i32)
  (local $fl|15 i32)
  (local $sl|16 i32)
  (local $head i32)
  (local $root|18 i32)
  (local $fl|19 i32)
  (local $slMap i32)
  (local $root|21 i32)
  (local $fl|22 i32)
  (local $slMap|23 i32)
  local.get $block
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $blockInfo
  i32.const 1
  drop
  local.get $blockInfo
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 268
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $blockInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.set $size
  i32.const 1
  drop
  local.get $size
  i32.const 12
  i32.ge_u
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 270
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $size
  i32.const 256
  i32.lt_u
  if
   i32.const 0
   local.set $fl
   local.get $size
   i32.const 4
   i32.shr_u
   local.set $sl
  else
   local.get $size
   local.tee $6
   i32.const 1073741820
   local.tee $7
   local.get $6
   local.get $7
   i32.lt_u
   select
   local.set $boundedSize
   i32.const 31
   local.get $boundedSize
   i32.clz
   i32.sub
   local.set $fl
   local.get $boundedSize
   local.get $fl
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 1
   i32.const 4
   i32.shl
   i32.xor
   local.set $sl
   local.get $fl
   i32.const 8
   i32.const 1
   i32.sub
   i32.sub
   local.set $fl
  end
  i32.const 1
  drop
  local.get $fl
  i32.const 23
  i32.lt_u
  if (result i32)
   local.get $sl
   i32.const 16
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 284
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $block
  call $~lib/rt/tlsf/Block#get:prev
  local.set $prev
  local.get $block
  call $~lib/rt/tlsf/Block#get:next
  local.set $next
  local.get $prev
  if
   local.get $prev
   local.get $next
   call $~lib/rt/tlsf/Block#set:next
  end
  local.get $next
  if
   local.get $next
   local.get $prev
   call $~lib/rt/tlsf/Block#set:prev
  end
  local.get $block
  block $~lib/rt/tlsf/GETHEAD|inlined.0 (result i32)
   local.get $root
   local.set $root|11
   local.get $fl
   local.set $fl|12
   local.get $sl
   local.set $sl|13
   local.get $root|11
   local.get $fl|12
   i32.const 4
   i32.shl
   local.get $sl|13
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
   br $~lib/rt/tlsf/GETHEAD|inlined.0
  end
  i32.eq
  if
   local.get $root
   local.set $root|14
   local.get $fl
   local.set $fl|15
   local.get $sl
   local.set $sl|16
   local.get $next
   local.set $head
   local.get $root|14
   local.get $fl|15
   i32.const 4
   i32.shl
   local.get $sl|16
   i32.add
   i32.const 2
   i32.shl
   i32.add
   local.get $head
   i32.store offset=96
   local.get $next
   i32.eqz
   if
    block $~lib/rt/tlsf/GETSL|inlined.0 (result i32)
     local.get $root
     local.set $root|18
     local.get $fl
     local.set $fl|19
     local.get $root|18
     local.get $fl|19
     i32.const 2
     i32.shl
     i32.add
     i32.load offset=4
     br $~lib/rt/tlsf/GETSL|inlined.0
    end
    local.set $slMap
    local.get $root
    local.set $root|21
    local.get $fl
    local.set $fl|22
    local.get $slMap
    i32.const 1
    local.get $sl
    i32.shl
    i32.const -1
    i32.xor
    i32.and
    local.tee $slMap
    local.set $slMap|23
    local.get $root|21
    local.get $fl|22
    i32.const 2
    i32.shl
    i32.add
    local.get $slMap|23
    i32.store offset=4
    local.get $slMap
    i32.eqz
    if
     local.get $root
     local.get $root
     call $~lib/rt/tlsf/Root#get:flMap
     i32.const 1
     local.get $fl
     i32.shl
     i32.const -1
     i32.xor
     i32.and
     call $~lib/rt/tlsf/Root#set:flMap
    end
   end
  end
 )
 (func $~lib/rt/tlsf/insertBlock (param $root i32) (param $block i32)
  (local $blockInfo i32)
  (local $block|3 i32)
  (local $right i32)
  (local $rightInfo i32)
  (local $block|6 i32)
  (local $block|7 i32)
  (local $left i32)
  (local $leftInfo i32)
  (local $size i32)
  (local $fl i32)
  (local $sl i32)
  (local $13 i32)
  (local $14 i32)
  (local $boundedSize i32)
  (local $root|16 i32)
  (local $fl|17 i32)
  (local $sl|18 i32)
  (local $head i32)
  (local $root|20 i32)
  (local $fl|21 i32)
  (local $sl|22 i32)
  (local $head|23 i32)
  (local $root|24 i32)
  (local $fl|25 i32)
  (local $root|26 i32)
  (local $fl|27 i32)
  (local $slMap i32)
  i32.const 1
  drop
  local.get $block
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 201
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $block
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $blockInfo
  i32.const 1
  drop
  local.get $blockInfo
  i32.const 1
  i32.and
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 203
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  block $~lib/rt/tlsf/GETRIGHT|inlined.0 (result i32)
   local.get $block
   local.set $block|3
   local.get $block|3
   i32.const 4
   i32.add
   local.get $block|3
   call $~lib/rt/common/BLOCK#get:mmInfo
   i32.const 3
   i32.const -1
   i32.xor
   i32.and
   i32.add
   br $~lib/rt/tlsf/GETRIGHT|inlined.0
  end
  local.set $right
  local.get $right
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $rightInfo
  local.get $rightInfo
  i32.const 1
  i32.and
  if
   local.get $root
   local.get $right
   call $~lib/rt/tlsf/removeBlock
   local.get $block
   local.get $blockInfo
   i32.const 4
   i32.add
   local.get $rightInfo
   i32.const 3
   i32.const -1
   i32.xor
   i32.and
   i32.add
   local.tee $blockInfo
   call $~lib/rt/common/BLOCK#set:mmInfo
   block $~lib/rt/tlsf/GETRIGHT|inlined.1 (result i32)
    local.get $block
    local.set $block|6
    local.get $block|6
    i32.const 4
    i32.add
    local.get $block|6
    call $~lib/rt/common/BLOCK#get:mmInfo
    i32.const 3
    i32.const -1
    i32.xor
    i32.and
    i32.add
    br $~lib/rt/tlsf/GETRIGHT|inlined.1
   end
   local.set $right
   local.get $right
   call $~lib/rt/common/BLOCK#get:mmInfo
   local.set $rightInfo
  end
  local.get $blockInfo
  i32.const 2
  i32.and
  if
   block $~lib/rt/tlsf/GETFREELEFT|inlined.0 (result i32)
    local.get $block
    local.set $block|7
    local.get $block|7
    i32.const 4
    i32.sub
    i32.load
    br $~lib/rt/tlsf/GETFREELEFT|inlined.0
   end
   local.set $left
   local.get $left
   call $~lib/rt/common/BLOCK#get:mmInfo
   local.set $leftInfo
   i32.const 1
   drop
   local.get $leftInfo
   i32.const 1
   i32.and
   i32.eqz
   if
    i32.const 0
    i32.const 592
    i32.const 221
    i32.const 16
    call $~lib/wasi_internal/wasi_abort
    unreachable
   end
   local.get $root
   local.get $left
   call $~lib/rt/tlsf/removeBlock
   local.get $left
   local.set $block
   local.get $block
   local.get $leftInfo
   i32.const 4
   i32.add
   local.get $blockInfo
   i32.const 3
   i32.const -1
   i32.xor
   i32.and
   i32.add
   local.tee $blockInfo
   call $~lib/rt/common/BLOCK#set:mmInfo
  end
  local.get $right
  local.get $rightInfo
  i32.const 2
  i32.or
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $blockInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.set $size
  i32.const 1
  drop
  local.get $size
  i32.const 12
  i32.ge_u
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 233
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  i32.const 1
  drop
  local.get $block
  i32.const 4
  i32.add
  local.get $size
  i32.add
  local.get $right
  i32.eq
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 234
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $right
  i32.const 4
  i32.sub
  local.get $block
  i32.store
  local.get $size
  i32.const 256
  i32.lt_u
  if
   i32.const 0
   local.set $fl
   local.get $size
   i32.const 4
   i32.shr_u
   local.set $sl
  else
   local.get $size
   local.tee $13
   i32.const 1073741820
   local.tee $14
   local.get $13
   local.get $14
   i32.lt_u
   select
   local.set $boundedSize
   i32.const 31
   local.get $boundedSize
   i32.clz
   i32.sub
   local.set $fl
   local.get $boundedSize
   local.get $fl
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 1
   i32.const 4
   i32.shl
   i32.xor
   local.set $sl
   local.get $fl
   i32.const 8
   i32.const 1
   i32.sub
   i32.sub
   local.set $fl
  end
  i32.const 1
  drop
  local.get $fl
  i32.const 23
  i32.lt_u
  if (result i32)
   local.get $sl
   i32.const 16
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 251
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  block $~lib/rt/tlsf/GETHEAD|inlined.1 (result i32)
   local.get $root
   local.set $root|16
   local.get $fl
   local.set $fl|17
   local.get $sl
   local.set $sl|18
   local.get $root|16
   local.get $fl|17
   i32.const 4
   i32.shl
   local.get $sl|18
   i32.add
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=96
   br $~lib/rt/tlsf/GETHEAD|inlined.1
  end
  local.set $head
  local.get $block
  i32.const 0
  call $~lib/rt/tlsf/Block#set:prev
  local.get $block
  local.get $head
  call $~lib/rt/tlsf/Block#set:next
  local.get $head
  if
   local.get $head
   local.get $block
   call $~lib/rt/tlsf/Block#set:prev
  end
  local.get $root
  local.set $root|20
  local.get $fl
  local.set $fl|21
  local.get $sl
  local.set $sl|22
  local.get $block
  local.set $head|23
  local.get $root|20
  local.get $fl|21
  i32.const 4
  i32.shl
  local.get $sl|22
  i32.add
  i32.const 2
  i32.shl
  i32.add
  local.get $head|23
  i32.store offset=96
  local.get $root
  local.get $root
  call $~lib/rt/tlsf/Root#get:flMap
  i32.const 1
  local.get $fl
  i32.shl
  i32.or
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $root
  local.set $root|26
  local.get $fl
  local.set $fl|27
  block $~lib/rt/tlsf/GETSL|inlined.1 (result i32)
   local.get $root
   local.set $root|24
   local.get $fl
   local.set $fl|25
   local.get $root|24
   local.get $fl|25
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=4
   br $~lib/rt/tlsf/GETSL|inlined.1
  end
  i32.const 1
  local.get $sl
  i32.shl
  i32.or
  local.set $slMap
  local.get $root|26
  local.get $fl|27
  i32.const 2
  i32.shl
  i32.add
  local.get $slMap
  i32.store offset=4
 )
 (func $~lib/rt/tlsf/addMemory (param $root i32) (param $start i32) (param $endU64 i64) (result i32)
  (local $end i32)
  (local $root|4 i32)
  (local $tail i32)
  (local $tailInfo i32)
  (local $size i32)
  (local $leftSize i32)
  (local $left i32)
  (local $root|10 i32)
  (local $tail|11 i32)
  local.get $endU64
  i32.wrap_i64
  local.set $end
  i32.const 1
  drop
  local.get $start
  i64.extend_i32_u
  local.get $endU64
  i64.le_u
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 382
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $start
  i32.const 4
  i32.add
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  i32.const 4
  i32.sub
  local.set $start
  local.get $end
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  local.set $end
  block $~lib/rt/tlsf/GETTAIL|inlined.0 (result i32)
   local.get $root
   local.set $root|4
   local.get $root|4
   i32.load offset=1568
   br $~lib/rt/tlsf/GETTAIL|inlined.0
  end
  local.set $tail
  i32.const 0
  local.set $tailInfo
  local.get $tail
  if
   i32.const 1
   drop
   local.get $start
   local.get $tail
   i32.const 4
   i32.add
   i32.ge_u
   i32.eqz
   if
    i32.const 0
    i32.const 592
    i32.const 389
    i32.const 16
    call $~lib/wasi_internal/wasi_abort
    unreachable
   end
   local.get $start
   i32.const 16
   i32.sub
   local.get $tail
   i32.eq
   if
    local.get $start
    i32.const 16
    i32.sub
    local.set $start
    local.get $tail
    call $~lib/rt/common/BLOCK#get:mmInfo
    local.set $tailInfo
   else
   end
  else
   i32.const 1
   drop
   local.get $start
   local.get $root
   i32.const 1572
   i32.add
   i32.ge_u
   i32.eqz
   if
    i32.const 0
    i32.const 592
    i32.const 402
    i32.const 5
    call $~lib/wasi_internal/wasi_abort
    unreachable
   end
  end
  local.get $end
  local.get $start
  i32.sub
  local.set $size
  local.get $size
  i32.const 4
  i32.const 12
  i32.add
  i32.const 4
  i32.add
  i32.lt_u
  if
   i32.const 0
   return
  end
  local.get $size
  i32.const 2
  i32.const 4
  i32.mul
  i32.sub
  local.set $leftSize
  local.get $start
  local.set $left
  local.get $left
  local.get $leftSize
  i32.const 1
  i32.or
  local.get $tailInfo
  i32.const 2
  i32.and
  i32.or
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $left
  i32.const 0
  call $~lib/rt/tlsf/Block#set:prev
  local.get $left
  i32.const 0
  call $~lib/rt/tlsf/Block#set:next
  local.get $start
  i32.const 4
  i32.add
  local.get $leftSize
  i32.add
  local.set $tail
  local.get $tail
  i32.const 0
  i32.const 2
  i32.or
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $root
  local.set $root|10
  local.get $tail
  local.set $tail|11
  local.get $root|10
  local.get $tail|11
  i32.store offset=1568
  local.get $root
  local.get $left
  call $~lib/rt/tlsf/insertBlock
  i32.const 1
  return
 )
 (func $~lib/rt/tlsf/initialize
  (local $rootOffset i32)
  (local $pagesBefore i32)
  (local $pagesNeeded i32)
  (local $root i32)
  (local $root|4 i32)
  (local $tail i32)
  (local $fl i32)
  (local $root|7 i32)
  (local $fl|8 i32)
  (local $slMap i32)
  (local $sl i32)
  (local $root|11 i32)
  (local $fl|12 i32)
  (local $sl|13 i32)
  (local $head i32)
  (local $memStart i32)
  i32.const 0
  drop
  global.get $~lib/memory/__heap_base
  i32.const 15
  i32.add
  i32.const 15
  i32.const -1
  i32.xor
  i32.and
  local.set $rootOffset
  memory.size
  local.set $pagesBefore
  local.get $rootOffset
  i32.const 1572
  i32.add
  i32.const 65535
  i32.add
  i32.const 65535
  i32.const -1
  i32.xor
  i32.and
  i32.const 16
  i32.shr_u
  local.set $pagesNeeded
  local.get $pagesNeeded
  local.get $pagesBefore
  i32.gt_s
  if (result i32)
   local.get $pagesNeeded
   local.get $pagesBefore
   i32.sub
   memory.grow
   i32.const 0
   i32.lt_s
  else
   i32.const 0
  end
  if
   unreachable
  end
  local.get $rootOffset
  local.set $root
  local.get $root
  i32.const 0
  call $~lib/rt/tlsf/Root#set:flMap
  local.get $root
  local.set $root|4
  i32.const 0
  local.set $tail
  local.get $root|4
  local.get $tail
  i32.store offset=1568
  i32.const 0
  local.set $fl
  loop $for-loop|0
   local.get $fl
   i32.const 23
   i32.lt_u
   if
    local.get $root
    local.set $root|7
    local.get $fl
    local.set $fl|8
    i32.const 0
    local.set $slMap
    local.get $root|7
    local.get $fl|8
    i32.const 2
    i32.shl
    i32.add
    local.get $slMap
    i32.store offset=4
    i32.const 0
    local.set $sl
    loop $for-loop|1
     local.get $sl
     i32.const 16
     i32.lt_u
     if
      local.get $root
      local.set $root|11
      local.get $fl
      local.set $fl|12
      local.get $sl
      local.set $sl|13
      i32.const 0
      local.set $head
      local.get $root|11
      local.get $fl|12
      i32.const 4
      i32.shl
      local.get $sl|13
      i32.add
      i32.const 2
      i32.shl
      i32.add
      local.get $head
      i32.store offset=96
      local.get $sl
      i32.const 1
      i32.add
      local.set $sl
      br $for-loop|1
     end
    end
    local.get $fl
    i32.const 1
    i32.add
    local.set $fl
    br $for-loop|0
   end
  end
  local.get $rootOffset
  i32.const 1572
  i32.add
  local.set $memStart
  i32.const 0
  drop
  local.get $root
  local.get $memStart
  memory.size
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  drop
  local.get $root
  global.set $~lib/rt/tlsf/ROOT
 )
 (func $~lib/rt/tlsf/checkUsedBlock (param $ptr i32) (result i32)
  (local $block i32)
  local.get $ptr
  i32.const 4
  i32.sub
  local.set $block
  local.get $ptr
  i32.const 0
  i32.ne
  if (result i32)
   local.get $ptr
   i32.const 15
   i32.and
   i32.eqz
  else
   i32.const 0
  end
  if (result i32)
   local.get $block
   call $~lib/rt/common/BLOCK#get:mmInfo
   i32.const 1
   i32.and
   i32.eqz
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 562
   i32.const 3
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $block
  return
 )
 (func $~lib/rt/tlsf/freeBlock (param $root i32) (param $block i32)
  i32.const 0
  drop
  local.get $block
  local.get $block
  call $~lib/rt/common/BLOCK#get:mmInfo
  i32.const 1
  i32.or
  call $~lib/rt/common/BLOCK#set:mmInfo
  local.get $root
  local.get $block
  call $~lib/rt/tlsf/insertBlock
 )
 (func $~lib/rt/tlsf/__free (param $ptr i32)
  local.get $ptr
  global.get $~lib/memory/__heap_base
  i32.lt_u
  if
   return
  end
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.get $ptr
  call $~lib/rt/tlsf/checkUsedBlock
  call $~lib/rt/tlsf/freeBlock
 )
 (func $~lib/rt/itcms/free (param $obj i32)
  local.get $obj
  global.get $~lib/memory/__heap_base
  i32.lt_u
  if
   local.get $obj
   i32.const 0
   call $~lib/rt/itcms/Object#set:nextWithColor
   local.get $obj
   i32.const 0
   call $~lib/rt/itcms/Object#set:prev
  else
   global.get $~lib/rt/itcms/total
   local.get $obj
   call $~lib/rt/itcms/Object#get:size
   i32.sub
   global.set $~lib/rt/itcms/total
   i32.const 0
   drop
   local.get $obj
   i32.const 4
   i32.add
   call $~lib/rt/tlsf/__free
  end
 )
 (func $~lib/rt/itcms/step (result i32)
  (local $obj i32)
  (local $1 i32)
  (local $black i32)
  (local $from i32)
  block $break|0
   block $case2|0
    block $case1|0
     block $case0|0
      global.get $~lib/rt/itcms/state
      local.set $1
      local.get $1
      i32.const 0
      i32.eq
      br_if $case0|0
      local.get $1
      i32.const 1
      i32.eq
      br_if $case1|0
      local.get $1
      i32.const 2
      i32.eq
      br_if $case2|0
      br $break|0
     end
     i32.const 1
     global.set $~lib/rt/itcms/state
     i32.const 0
     global.set $~lib/rt/itcms/visitCount
     i32.const 0
     call $~lib/rt/itcms/visitRoots
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/iter
     global.get $~lib/rt/itcms/visitCount
     i32.const 1
     i32.mul
     return
    end
    global.get $~lib/rt/itcms/white
    i32.eqz
    local.set $black
    global.get $~lib/rt/itcms/iter
    call $~lib/rt/itcms/Object#get:next
    local.set $obj
    loop $while-continue|1
     local.get $obj
     global.get $~lib/rt/itcms/toSpace
     i32.ne
     if
      local.get $obj
      global.set $~lib/rt/itcms/iter
      local.get $obj
      call $~lib/rt/itcms/Object#get:color
      local.get $black
      i32.ne
      if
       local.get $obj
       local.get $black
       call $~lib/rt/itcms/Object#set:color
       i32.const 0
       global.set $~lib/rt/itcms/visitCount
       local.get $obj
       i32.const 20
       i32.add
       i32.const 0
       call $~lib/rt/__visit_members
       global.get $~lib/rt/itcms/visitCount
       i32.const 1
       i32.mul
       return
      end
      local.get $obj
      call $~lib/rt/itcms/Object#get:next
      local.set $obj
      br $while-continue|1
     end
    end
    i32.const 0
    global.set $~lib/rt/itcms/visitCount
    i32.const 0
    call $~lib/rt/itcms/visitRoots
    global.get $~lib/rt/itcms/iter
    call $~lib/rt/itcms/Object#get:next
    local.set $obj
    local.get $obj
    global.get $~lib/rt/itcms/toSpace
    i32.eq
    if
     i32.const 0
     call $~lib/rt/itcms/visitStack
     global.get $~lib/rt/itcms/iter
     call $~lib/rt/itcms/Object#get:next
     local.set $obj
     loop $while-continue|2
      local.get $obj
      global.get $~lib/rt/itcms/toSpace
      i32.ne
      if
       local.get $obj
       call $~lib/rt/itcms/Object#get:color
       local.get $black
       i32.ne
       if
        local.get $obj
        local.get $black
        call $~lib/rt/itcms/Object#set:color
        local.get $obj
        i32.const 20
        i32.add
        i32.const 0
        call $~lib/rt/__visit_members
       end
       local.get $obj
       call $~lib/rt/itcms/Object#get:next
       local.set $obj
       br $while-continue|2
      end
     end
     global.get $~lib/rt/itcms/fromSpace
     local.set $from
     global.get $~lib/rt/itcms/toSpace
     global.set $~lib/rt/itcms/fromSpace
     local.get $from
     global.set $~lib/rt/itcms/toSpace
     local.get $black
     global.set $~lib/rt/itcms/white
     local.get $from
     call $~lib/rt/itcms/Object#get:next
     global.set $~lib/rt/itcms/iter
     i32.const 2
     global.set $~lib/rt/itcms/state
    end
    global.get $~lib/rt/itcms/visitCount
    i32.const 1
    i32.mul
    return
   end
   global.get $~lib/rt/itcms/iter
   local.set $obj
   local.get $obj
   global.get $~lib/rt/itcms/toSpace
   i32.ne
   if
    local.get $obj
    call $~lib/rt/itcms/Object#get:next
    global.set $~lib/rt/itcms/iter
    i32.const 1
    drop
    local.get $obj
    call $~lib/rt/itcms/Object#get:color
    global.get $~lib/rt/itcms/white
    i32.eqz
    i32.eq
    i32.eqz
    if
     i32.const 0
     i32.const 320
     i32.const 229
     i32.const 20
     call $~lib/wasi_internal/wasi_abort
     unreachable
    end
    local.get $obj
    call $~lib/rt/itcms/free
    i32.const 10
    return
   end
   global.get $~lib/rt/itcms/toSpace
   global.get $~lib/rt/itcms/toSpace
   call $~lib/rt/itcms/Object#set:nextWithColor
   global.get $~lib/rt/itcms/toSpace
   global.get $~lib/rt/itcms/toSpace
   call $~lib/rt/itcms/Object#set:prev
   i32.const 0
   global.set $~lib/rt/itcms/state
   br $break|0
  end
  i32.const 0
  return
 )
 (func $~lib/rt/itcms/interrupt
  (local $budget i32)
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 1024
  i32.const 200
  i32.mul
  i32.const 100
  i32.div_u
  local.set $budget
  loop $do-loop|0
   local.get $budget
   call $~lib/rt/itcms/step
   i32.sub
   local.set $budget
   global.get $~lib/rt/itcms/state
   i32.const 0
   i32.eq
   if
    i32.const 0
    drop
    global.get $~lib/rt/itcms/total
    i64.extend_i32_u
    i32.const 200
    i64.extend_i32_u
    i64.mul
    i64.const 100
    i64.div_u
    i32.wrap_i64
    i32.const 1024
    i32.add
    global.set $~lib/rt/itcms/threshold
    i32.const 0
    drop
    return
   end
   local.get $budget
   i32.const 0
   i32.gt_s
   br_if $do-loop|0
  end
  i32.const 0
  drop
  global.get $~lib/rt/itcms/total
  i32.const 1024
  global.get $~lib/rt/itcms/total
  global.get $~lib/rt/itcms/threshold
  i32.sub
  i32.const 1024
  i32.lt_u
  i32.mul
  i32.add
  global.set $~lib/rt/itcms/threshold
  i32.const 0
  drop
 )
 (func $~lib/rt/tlsf/computeSize (param $size i32) (result i32)
  local.get $size
  i32.const 12
  i32.le_u
  if (result i32)
   i32.const 12
  else
   local.get $size
   i32.const 4
   i32.add
   i32.const 15
   i32.add
   i32.const 15
   i32.const -1
   i32.xor
   i32.and
   i32.const 4
   i32.sub
  end
  return
 )
 (func $~lib/rt/tlsf/prepareSize (param $size i32) (result i32)
  local.get $size
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 256
   i32.const 592
   i32.const 461
   i32.const 29
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $size
  call $~lib/rt/tlsf/computeSize
  return
 )
 (func $~lib/rt/tlsf/roundSize (param $size i32) (result i32)
  local.get $size
  i32.const 536870910
  i32.lt_u
  if (result i32)
   local.get $size
   i32.const 1
   i32.const 27
   local.get $size
   i32.clz
   i32.sub
   i32.shl
   i32.add
   i32.const 1
   i32.sub
  else
   local.get $size
  end
  return
 )
 (func $~lib/rt/tlsf/searchBlock (param $root i32) (param $size i32) (result i32)
  (local $fl i32)
  (local $sl i32)
  (local $requestSize i32)
  (local $root|5 i32)
  (local $fl|6 i32)
  (local $slMap i32)
  (local $head i32)
  (local $flMap i32)
  (local $root|10 i32)
  (local $fl|11 i32)
  (local $root|12 i32)
  (local $fl|13 i32)
  (local $sl|14 i32)
  (local $root|15 i32)
  (local $fl|16 i32)
  (local $sl|17 i32)
  local.get $size
  i32.const 256
  i32.lt_u
  if
   i32.const 0
   local.set $fl
   local.get $size
   i32.const 4
   i32.shr_u
   local.set $sl
  else
   local.get $size
   call $~lib/rt/tlsf/roundSize
   local.set $requestSize
   i32.const 4
   i32.const 8
   i32.mul
   i32.const 1
   i32.sub
   local.get $requestSize
   i32.clz
   i32.sub
   local.set $fl
   local.get $requestSize
   local.get $fl
   i32.const 4
   i32.sub
   i32.shr_u
   i32.const 1
   i32.const 4
   i32.shl
   i32.xor
   local.set $sl
   local.get $fl
   i32.const 8
   i32.const 1
   i32.sub
   i32.sub
   local.set $fl
  end
  i32.const 1
  drop
  local.get $fl
  i32.const 23
  i32.lt_u
  if (result i32)
   local.get $sl
   i32.const 16
   i32.lt_u
  else
   i32.const 0
  end
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 334
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  block $~lib/rt/tlsf/GETSL|inlined.2 (result i32)
   local.get $root
   local.set $root|5
   local.get $fl
   local.set $fl|6
   local.get $root|5
   local.get $fl|6
   i32.const 2
   i32.shl
   i32.add
   i32.load offset=4
   br $~lib/rt/tlsf/GETSL|inlined.2
  end
  i32.const 0
  i32.const -1
  i32.xor
  local.get $sl
  i32.shl
  i32.and
  local.set $slMap
  i32.const 0
  local.set $head
  local.get $slMap
  i32.eqz
  if
   local.get $root
   call $~lib/rt/tlsf/Root#get:flMap
   i32.const 0
   i32.const -1
   i32.xor
   local.get $fl
   i32.const 1
   i32.add
   i32.shl
   i32.and
   local.set $flMap
   local.get $flMap
   i32.eqz
   if
    i32.const 0
    local.set $head
   else
    local.get $flMap
    i32.ctz
    local.set $fl
    block $~lib/rt/tlsf/GETSL|inlined.3 (result i32)
     local.get $root
     local.set $root|10
     local.get $fl
     local.set $fl|11
     local.get $root|10
     local.get $fl|11
     i32.const 2
     i32.shl
     i32.add
     i32.load offset=4
     br $~lib/rt/tlsf/GETSL|inlined.3
    end
    local.set $slMap
    i32.const 1
    drop
    local.get $slMap
    i32.eqz
    if
     i32.const 0
     i32.const 592
     i32.const 347
     i32.const 18
     call $~lib/wasi_internal/wasi_abort
     unreachable
    end
    block $~lib/rt/tlsf/GETHEAD|inlined.2 (result i32)
     local.get $root
     local.set $root|12
     local.get $fl
     local.set $fl|13
     local.get $slMap
     i32.ctz
     local.set $sl|14
     local.get $root|12
     local.get $fl|13
     i32.const 4
     i32.shl
     local.get $sl|14
     i32.add
     i32.const 2
     i32.shl
     i32.add
     i32.load offset=96
     br $~lib/rt/tlsf/GETHEAD|inlined.2
    end
    local.set $head
   end
  else
   block $~lib/rt/tlsf/GETHEAD|inlined.3 (result i32)
    local.get $root
    local.set $root|15
    local.get $fl
    local.set $fl|16
    local.get $slMap
    i32.ctz
    local.set $sl|17
    local.get $root|15
    local.get $fl|16
    i32.const 4
    i32.shl
    local.get $sl|17
    i32.add
    i32.const 2
    i32.shl
    i32.add
    i32.load offset=96
    br $~lib/rt/tlsf/GETHEAD|inlined.3
   end
   local.set $head
  end
  local.get $head
  return
 )
 (func $~lib/rt/tlsf/growMemory (param $root i32) (param $size i32)
  (local $pagesBefore i32)
  (local $root|3 i32)
  (local $pagesNeeded i32)
  (local $5 i32)
  (local $6 i32)
  (local $pagesWanted i32)
  (local $pagesAfter i32)
  i32.const 0
  drop
  local.get $size
  i32.const 256
  i32.ge_u
  if
   local.get $size
   call $~lib/rt/tlsf/roundSize
   local.set $size
  end
  memory.size
  local.set $pagesBefore
  local.get $size
  i32.const 4
  local.get $pagesBefore
  i32.const 16
  i32.shl
  i32.const 4
  i32.sub
  block $~lib/rt/tlsf/GETTAIL|inlined.1 (result i32)
   local.get $root
   local.set $root|3
   local.get $root|3
   i32.load offset=1568
   br $~lib/rt/tlsf/GETTAIL|inlined.1
  end
  i32.ne
  i32.shl
  i32.add
  local.set $size
  local.get $size
  i32.const 65535
  i32.add
  i32.const 65535
  i32.const -1
  i32.xor
  i32.and
  i32.const 16
  i32.shr_u
  local.set $pagesNeeded
  local.get $pagesBefore
  local.tee $5
  local.get $pagesNeeded
  local.tee $6
  local.get $5
  local.get $6
  i32.gt_s
  select
  local.set $pagesWanted
  local.get $pagesWanted
  memory.grow
  i32.const 0
  i32.lt_s
  if
   local.get $pagesNeeded
   memory.grow
   i32.const 0
   i32.lt_s
   if
    unreachable
   end
  end
  memory.size
  local.set $pagesAfter
  local.get $root
  local.get $pagesBefore
  i32.const 16
  i32.shl
  local.get $pagesAfter
  i64.extend_i32_s
  i64.const 16
  i64.shl
  call $~lib/rt/tlsf/addMemory
  drop
 )
 (func $~lib/rt/tlsf/prepareBlock (param $root i32) (param $block i32) (param $size i32)
  (local $blockInfo i32)
  (local $remaining i32)
  (local $spare i32)
  (local $block|6 i32)
  (local $block|7 i32)
  local.get $block
  call $~lib/rt/common/BLOCK#get:mmInfo
  local.set $blockInfo
  i32.const 1
  drop
  local.get $size
  i32.const 4
  i32.add
  i32.const 15
  i32.and
  i32.eqz
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 361
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $blockInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.get $size
  i32.sub
  local.set $remaining
  local.get $remaining
  i32.const 4
  i32.const 12
  i32.add
  i32.ge_u
  if
   local.get $block
   local.get $size
   local.get $blockInfo
   i32.const 2
   i32.and
   i32.or
   call $~lib/rt/common/BLOCK#set:mmInfo
   local.get $block
   i32.const 4
   i32.add
   local.get $size
   i32.add
   local.set $spare
   local.get $spare
   local.get $remaining
   i32.const 4
   i32.sub
   i32.const 1
   i32.or
   call $~lib/rt/common/BLOCK#set:mmInfo
   local.get $root
   local.get $spare
   call $~lib/rt/tlsf/insertBlock
  else
   local.get $block
   local.get $blockInfo
   i32.const 1
   i32.const -1
   i32.xor
   i32.and
   call $~lib/rt/common/BLOCK#set:mmInfo
   block $~lib/rt/tlsf/GETRIGHT|inlined.3 (result i32)
    local.get $block
    local.set $block|7
    local.get $block|7
    i32.const 4
    i32.add
    local.get $block|7
    call $~lib/rt/common/BLOCK#get:mmInfo
    i32.const 3
    i32.const -1
    i32.xor
    i32.and
    i32.add
    br $~lib/rt/tlsf/GETRIGHT|inlined.3
   end
   block $~lib/rt/tlsf/GETRIGHT|inlined.2 (result i32)
    local.get $block
    local.set $block|6
    local.get $block|6
    i32.const 4
    i32.add
    local.get $block|6
    call $~lib/rt/common/BLOCK#get:mmInfo
    i32.const 3
    i32.const -1
    i32.xor
    i32.and
    i32.add
    br $~lib/rt/tlsf/GETRIGHT|inlined.2
   end
   call $~lib/rt/common/BLOCK#get:mmInfo
   i32.const 2
   i32.const -1
   i32.xor
   i32.and
   call $~lib/rt/common/BLOCK#set:mmInfo
  end
 )
 (func $~lib/rt/tlsf/allocateBlock (param $root i32) (param $size i32) (result i32)
  (local $payloadSize i32)
  (local $block i32)
  local.get $size
  call $~lib/rt/tlsf/prepareSize
  local.set $payloadSize
  local.get $root
  local.get $payloadSize
  call $~lib/rt/tlsf/searchBlock
  local.set $block
  local.get $block
  i32.eqz
  if
   local.get $root
   local.get $payloadSize
   call $~lib/rt/tlsf/growMemory
   local.get $root
   local.get $payloadSize
   call $~lib/rt/tlsf/searchBlock
   local.set $block
   i32.const 1
   drop
   local.get $block
   i32.eqz
   if
    i32.const 0
    i32.const 592
    i32.const 499
    i32.const 16
    call $~lib/wasi_internal/wasi_abort
    unreachable
   end
  end
  i32.const 1
  drop
  local.get $block
  call $~lib/rt/common/BLOCK#get:mmInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  local.get $payloadSize
  i32.ge_u
  i32.eqz
  if
   i32.const 0
   i32.const 592
   i32.const 501
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $root
  local.get $block
  call $~lib/rt/tlsf/removeBlock
  local.get $root
  local.get $block
  local.get $payloadSize
  call $~lib/rt/tlsf/prepareBlock
  i32.const 0
  drop
  local.get $block
  return
 )
 (func $~lib/rt/tlsf/__alloc (param $size i32) (result i32)
  global.get $~lib/rt/tlsf/ROOT
  i32.eqz
  if
   call $~lib/rt/tlsf/initialize
  end
  global.get $~lib/rt/tlsf/ROOT
  local.get $size
  call $~lib/rt/tlsf/allocateBlock
  i32.const 4
  i32.add
  return
 )
 (func $~lib/rt/itcms/Object#set:rtId (param $this i32) (param $rtId i32)
  local.get $this
  local.get $rtId
  i32.store offset=12
 )
 (func $~lib/rt/itcms/Object#set:rtSize (param $this i32) (param $rtSize i32)
  local.get $this
  local.get $rtSize
  i32.store offset=16
 )
 (func $~lib/rt/itcms/__new (param $size i32) (param $id i32) (result i32)
  (local $obj i32)
  (local $ptr i32)
  local.get $size
  i32.const 1073741804
  i32.ge_u
  if
   i32.const 256
   i32.const 320
   i32.const 261
   i32.const 31
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  global.get $~lib/rt/itcms/total
  global.get $~lib/rt/itcms/threshold
  i32.ge_u
  if
   call $~lib/rt/itcms/interrupt
  end
  i32.const 16
  local.get $size
  i32.add
  call $~lib/rt/tlsf/__alloc
  i32.const 4
  i32.sub
  local.set $obj
  local.get $obj
  local.get $id
  call $~lib/rt/itcms/Object#set:rtId
  local.get $obj
  local.get $size
  call $~lib/rt/itcms/Object#set:rtSize
  local.get $obj
  global.get $~lib/rt/itcms/fromSpace
  global.get $~lib/rt/itcms/white
  call $~lib/rt/itcms/Object#linkTo
  global.get $~lib/rt/itcms/total
  local.get $obj
  call $~lib/rt/itcms/Object#get:size
  i32.add
  global.set $~lib/rt/itcms/total
  local.get $obj
  i32.const 20
  i32.add
  local.set $ptr
  local.get $ptr
  i32.const 0
  local.get $size
  memory.fill
  local.get $ptr
  return
 )
 (func $start:~lib/json-as/lib/as-bs
  memory.size
  i32.const 16
  i32.shl
  global.get $~lib/memory/__heap_base
  i32.sub
  i32.const 1
  i32.shr_u
  global.set $~lib/rt/itcms/threshold
  i32.const 368
  call $~lib/rt/itcms/initLazy
  global.set $~lib/rt/itcms/pinSpace
  i32.const 400
  call $~lib/rt/itcms/initLazy
  global.set $~lib/rt/itcms/toSpace
  i32.const 544
  call $~lib/rt/itcms/initLazy
  global.set $~lib/rt/itcms/fromSpace
  i32.const 0
  i32.const 32
  call $~lib/arraybuffer/ArrayBuffer#constructor
  global.set $~lib/json-as/lib/as-bs/bs.buffer
  global.get $~lib/json-as/lib/as-bs/bs.buffer
  global.set $~lib/json-as/lib/as-bs/bs.offset
 )
 (func $~lib/rt/itcms/__link (param $parentPtr i32) (param $childPtr i32) (param $expectMultiple i32)
  (local $child i32)
  (local $parent i32)
  (local $parentColor i32)
  local.get $childPtr
  i32.eqz
  if
   return
  end
  i32.const 1
  drop
  local.get $parentPtr
  i32.eqz
  if
   i32.const 0
   i32.const 320
   i32.const 295
   i32.const 14
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $childPtr
  i32.const 20
  i32.sub
  local.set $child
  local.get $child
  call $~lib/rt/itcms/Object#get:color
  global.get $~lib/rt/itcms/white
  i32.eq
  if
   local.get $parentPtr
   i32.const 20
   i32.sub
   local.set $parent
   local.get $parent
   call $~lib/rt/itcms/Object#get:color
   local.set $parentColor
   local.get $parentColor
   global.get $~lib/rt/itcms/white
   i32.eqz
   i32.eq
   if
    local.get $expectMultiple
    if
     local.get $parent
     call $~lib/rt/itcms/Object#makeGray
    else
     local.get $child
     call $~lib/rt/itcms/Object#makeGray
    end
   else
    local.get $parentColor
    i32.const 3
    i32.eq
    if (result i32)
     global.get $~lib/rt/itcms/state
     i32.const 1
     i32.eq
    else
     i32.const 0
    end
    if
     local.get $child
     call $~lib/rt/itcms/Object#makeGray
    end
   end
  end
 )
 (func $"~lib/map/Map<u32,u32>#set:buckets" (param $this i32) (param $buckets i32)
  local.get $this
  local.get $buckets
  i32.store
  local.get $this
  local.get $buckets
  i32.const 0
  call $~lib/rt/itcms/__link
 )
 (func $"~lib/map/Map<u32,u32>#set:bucketsMask" (param $this i32) (param $bucketsMask i32)
  local.get $this
  local.get $bucketsMask
  i32.store offset=4
 )
 (func $"~lib/map/Map<u32,u32>#set:entries" (param $this i32) (param $entries i32)
  local.get $this
  local.get $entries
  i32.store offset=8
  local.get $this
  local.get $entries
  i32.const 0
  call $~lib/rt/itcms/__link
 )
 (func $"~lib/map/Map<u32,u32>#set:entriesCapacity" (param $this i32) (param $entriesCapacity i32)
  local.get $this
  local.get $entriesCapacity
  i32.store offset=12
 )
 (func $"~lib/map/Map<u32,u32>#set:entriesOffset" (param $this i32) (param $entriesOffset i32)
  local.get $this
  local.get $entriesOffset
  i32.store offset=16
 )
 (func $"~lib/map/Map<u32,u32>#set:entriesCount" (param $this i32) (param $entriesCount i32)
  local.get $this
  local.get $entriesCount
  i32.store offset=20
 )
 (func $start:~lib/json-as/assembly/index
  i32.const 0
  call $"~lib/map/Map<u32,u32>#constructor"
  global.set $~lib/json-as/assembly/index/JSON.Value.METHODS
 )
 (func $start:~lib/json-as/index
  call $start:~lib/json-as/assembly/index
 )
 (func $assembly/test/Vec3#set:x (param $this i32) (param $x i32)
  local.get $this
  local.get $x
  i32.store8
 )
 (func $assembly/test/Vec3#set:y (param $this i32) (param $y i32)
  local.get $this
  local.get $y
  i32.store8 offset=1
 )
 (func $assembly/test/Vec3#set:z (param $this i32) (param $z i32)
  local.get $this
  local.get $z
  i32.store8 offset=2
 )
 (func $~lib/rt/itcms/Object#get:rtSize (param $this i32) (result i32)
  local.get $this
  i32.load offset=16
 )
 (func $~lib/rt/itcms/__renew (param $oldPtr i32) (param $size i32) (result i32)
  (local $oldObj i32)
  (local $newPtr i32)
  (local $4 i32)
  (local $5 i32)
  local.get $oldPtr
  i32.const 20
  i32.sub
  local.set $oldObj
  local.get $size
  local.get $oldObj
  call $~lib/rt/common/BLOCK#get:mmInfo
  i32.const 3
  i32.const -1
  i32.xor
  i32.and
  i32.const 16
  i32.sub
  i32.le_u
  if
   local.get $oldObj
   local.get $size
   call $~lib/rt/itcms/Object#set:rtSize
   local.get $oldPtr
   return
  end
  local.get $size
  local.get $oldObj
  call $~lib/rt/itcms/Object#get:rtId
  call $~lib/rt/itcms/__new
  local.set $newPtr
  local.get $newPtr
  local.get $oldPtr
  local.get $size
  local.tee $4
  local.get $oldObj
  call $~lib/rt/itcms/Object#get:rtSize
  local.tee $5
  local.get $4
  local.get $5
  i32.lt_u
  select
  memory.copy
  local.get $newPtr
  return
 )
 (func $~lib/util/number/utoa32_dec_lut (param $buffer i32) (param $num i32) (param $offset i32)
  (local $t i32)
  (local $r i32)
  (local $d1 i32)
  (local $d2 i32)
  (local $digits1 i64)
  (local $digits2 i64)
  (local $t|9 i32)
  (local $d1|10 i32)
  (local $digits i32)
  (local $digits|12 i32)
  (local $digit i32)
  loop $while-continue|0
   local.get $num
   i32.const 10000
   i32.ge_u
   if
    local.get $num
    i32.const 10000
    i32.div_u
    local.set $t
    local.get $num
    i32.const 10000
    i32.rem_u
    local.set $r
    local.get $t
    local.set $num
    local.get $r
    i32.const 100
    i32.div_u
    local.set $d1
    local.get $r
    i32.const 100
    i32.rem_u
    local.set $d2
    i32.const 1900
    local.get $d1
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $digits1
    i32.const 1900
    local.get $d2
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $digits2
    local.get $offset
    i32.const 4
    i32.sub
    local.set $offset
    local.get $buffer
    local.get $offset
    i32.const 1
    i32.shl
    i32.add
    local.get $digits1
    local.get $digits2
    i64.const 32
    i64.shl
    i64.or
    i64.store
    br $while-continue|0
   end
  end
  local.get $num
  i32.const 100
  i32.ge_u
  if
   local.get $num
   i32.const 100
   i32.div_u
   local.set $t|9
   local.get $num
   i32.const 100
   i32.rem_u
   local.set $d1|10
   local.get $t|9
   local.set $num
   local.get $offset
   i32.const 2
   i32.sub
   local.set $offset
   i32.const 1900
   local.get $d1|10
   i32.const 2
   i32.shl
   i32.add
   i32.load
   local.set $digits
   local.get $buffer
   local.get $offset
   i32.const 1
   i32.shl
   i32.add
   local.get $digits
   i32.store
  end
  local.get $num
  i32.const 10
  i32.ge_u
  if
   local.get $offset
   i32.const 2
   i32.sub
   local.set $offset
   i32.const 1900
   local.get $num
   i32.const 2
   i32.shl
   i32.add
   i32.load
   local.set $digits|12
   local.get $buffer
   local.get $offset
   i32.const 1
   i32.shl
   i32.add
   local.get $digits|12
   i32.store
  else
   local.get $offset
   i32.const 1
   i32.sub
   local.set $offset
   i32.const 48
   local.get $num
   i32.add
   local.set $digit
   local.get $buffer
   local.get $offset
   i32.const 1
   i32.shl
   i32.add
   local.get $digit
   i32.store16
  end
 )
 (func $~lib/util/number/itoa_buffered<u8> (param $buffer i32) (param $value i32) (result i32)
  (local $sign i32)
  (local $dest i32)
  (local $decimals i32)
  (local $val32 i32)
  (local $buffer|6 i32)
  (local $num i32)
  (local $offset i32)
  i32.const 0
  local.set $sign
  i32.const 0
  drop
  local.get $buffer
  local.get $sign
  i32.const 1
  i32.shl
  i32.add
  local.set $dest
  i32.const 0
  i32.const 1
  i32.le_s
  drop
  i32.const 0
  drop
  local.get $value
  i32.const 255
  i32.and
  i32.const 10
  i32.lt_u
  if
   local.get $buffer
   local.get $value
   i32.const 255
   i32.and
   i32.const 48
   i32.or
   i32.store16
   i32.const 1
   return
  end
  i32.const 0
  local.set $decimals
  i32.const 1
  i32.const 4
  i32.le_u
  drop
  local.get $value
  i32.const 255
  i32.and
  local.set $val32
  local.get $val32
  call $~lib/util/number/decimalCount32
  local.set $decimals
  local.get $dest
  local.set $buffer|6
  local.get $val32
  local.set $num
  local.get $decimals
  local.set $offset
  i32.const 0
  i32.const 1
  i32.ge_s
  drop
  local.get $buffer|6
  local.get $num
  local.get $offset
  call $~lib/util/number/utoa32_dec_lut
  local.get $sign
  local.get $decimals
  i32.add
  return
 )
 (func $~lib/bindings/wasi_snapshot_preview1/errnoToString (param $err i32) (result i32)
  (local $1 i32)
  block $break|0
   block $case76|0
    block $case75|0
     block $case74|0
      block $case73|0
       block $case72|0
        block $case71|0
         block $case70|0
          block $case69|0
           block $case68|0
            block $case67|0
             block $case66|0
              block $case65|0
               block $case64|0
                block $case63|0
                 block $case62|0
                  block $case61|0
                   block $case60|0
                    block $case59|0
                     block $case58|0
                      block $case57|0
                       block $case56|0
                        block $case55|0
                         block $case54|0
                          block $case53|0
                           block $case52|0
                            block $case51|0
                             block $case50|0
                              block $case49|0
                               block $case48|0
                                block $case47|0
                                 block $case46|0
                                  block $case45|0
                                   block $case44|0
                                    block $case43|0
                                     block $case42|0
                                      block $case41|0
                                       block $case40|0
                                        block $case39|0
                                         block $case38|0
                                          block $case37|0
                                           block $case36|0
                                            block $case35|0
                                             block $case34|0
                                              block $case33|0
                                               block $case32|0
                                                block $case31|0
                                                 block $case30|0
                                                  block $case29|0
                                                   block $case28|0
                                                    block $case27|0
                                                     block $case26|0
                                                      block $case25|0
                                                       block $case24|0
                                                        block $case23|0
                                                         block $case22|0
                                                          block $case21|0
                                                           block $case20|0
                                                            block $case19|0
                                                             block $case18|0
                                                              block $case17|0
                                                               block $case16|0
                                                                block $case15|0
                                                                 block $case14|0
                                                                  block $case13|0
                                                                   block $case12|0
                                                                    block $case11|0
                                                                     block $case10|0
                                                                      block $case9|0
                                                                       block $case8|0
                                                                        block $case7|0
                                                                         block $case6|0
                                                                          block $case5|0
                                                                           block $case4|0
                                                                            block $case3|0
                                                                             block $case2|0
                                                                              block $case1|0
                                                                               block $case0|0
                                                                                local.get $err
                                                                                i32.const 65535
                                                                                i32.and
                                                                                local.set $1
                                                                                local.get $1
                                                                                i32.const 0
                                                                                i32.eq
                                                                                br_if $case0|0
                                                                                local.get $1
                                                                                i32.const 1
                                                                                i32.eq
                                                                                br_if $case1|0
                                                                                local.get $1
                                                                                i32.const 2
                                                                                i32.eq
                                                                                br_if $case2|0
                                                                                local.get $1
                                                                                i32.const 3
                                                                                i32.eq
                                                                                br_if $case3|0
                                                                                local.get $1
                                                                                i32.const 4
                                                                                i32.eq
                                                                                br_if $case4|0
                                                                                local.get $1
                                                                                i32.const 5
                                                                                i32.eq
                                                                                br_if $case5|0
                                                                                local.get $1
                                                                                i32.const 6
                                                                                i32.eq
                                                                                br_if $case6|0
                                                                                local.get $1
                                                                                i32.const 7
                                                                                i32.eq
                                                                                br_if $case7|0
                                                                                local.get $1
                                                                                i32.const 8
                                                                                i32.eq
                                                                                br_if $case8|0
                                                                                local.get $1
                                                                                i32.const 9
                                                                                i32.eq
                                                                                br_if $case9|0
                                                                                local.get $1
                                                                                i32.const 10
                                                                                i32.eq
                                                                                br_if $case10|0
                                                                                local.get $1
                                                                                i32.const 11
                                                                                i32.eq
                                                                                br_if $case11|0
                                                                                local.get $1
                                                                                i32.const 12
                                                                                i32.eq
                                                                                br_if $case12|0
                                                                                local.get $1
                                                                                i32.const 13
                                                                                i32.eq
                                                                                br_if $case13|0
                                                                                local.get $1
                                                                                i32.const 14
                                                                                i32.eq
                                                                                br_if $case14|0
                                                                                local.get $1
                                                                                i32.const 15
                                                                                i32.eq
                                                                                br_if $case15|0
                                                                                local.get $1
                                                                                i32.const 16
                                                                                i32.eq
                                                                                br_if $case16|0
                                                                                local.get $1
                                                                                i32.const 17
                                                                                i32.eq
                                                                                br_if $case17|0
                                                                                local.get $1
                                                                                i32.const 18
                                                                                i32.eq
                                                                                br_if $case18|0
                                                                                local.get $1
                                                                                i32.const 19
                                                                                i32.eq
                                                                                br_if $case19|0
                                                                                local.get $1
                                                                                i32.const 20
                                                                                i32.eq
                                                                                br_if $case20|0
                                                                                local.get $1
                                                                                i32.const 21
                                                                                i32.eq
                                                                                br_if $case21|0
                                                                                local.get $1
                                                                                i32.const 22
                                                                                i32.eq
                                                                                br_if $case22|0
                                                                                local.get $1
                                                                                i32.const 23
                                                                                i32.eq
                                                                                br_if $case23|0
                                                                                local.get $1
                                                                                i32.const 24
                                                                                i32.eq
                                                                                br_if $case24|0
                                                                                local.get $1
                                                                                i32.const 25
                                                                                i32.eq
                                                                                br_if $case25|0
                                                                                local.get $1
                                                                                i32.const 26
                                                                                i32.eq
                                                                                br_if $case26|0
                                                                                local.get $1
                                                                                i32.const 27
                                                                                i32.eq
                                                                                br_if $case27|0
                                                                                local.get $1
                                                                                i32.const 28
                                                                                i32.eq
                                                                                br_if $case28|0
                                                                                local.get $1
                                                                                i32.const 29
                                                                                i32.eq
                                                                                br_if $case29|0
                                                                                local.get $1
                                                                                i32.const 30
                                                                                i32.eq
                                                                                br_if $case30|0
                                                                                local.get $1
                                                                                i32.const 31
                                                                                i32.eq
                                                                                br_if $case31|0
                                                                                local.get $1
                                                                                i32.const 32
                                                                                i32.eq
                                                                                br_if $case32|0
                                                                                local.get $1
                                                                                i32.const 33
                                                                                i32.eq
                                                                                br_if $case33|0
                                                                                local.get $1
                                                                                i32.const 34
                                                                                i32.eq
                                                                                br_if $case34|0
                                                                                local.get $1
                                                                                i32.const 35
                                                                                i32.eq
                                                                                br_if $case35|0
                                                                                local.get $1
                                                                                i32.const 36
                                                                                i32.eq
                                                                                br_if $case36|0
                                                                                local.get $1
                                                                                i32.const 37
                                                                                i32.eq
                                                                                br_if $case37|0
                                                                                local.get $1
                                                                                i32.const 38
                                                                                i32.eq
                                                                                br_if $case38|0
                                                                                local.get $1
                                                                                i32.const 39
                                                                                i32.eq
                                                                                br_if $case39|0
                                                                                local.get $1
                                                                                i32.const 40
                                                                                i32.eq
                                                                                br_if $case40|0
                                                                                local.get $1
                                                                                i32.const 41
                                                                                i32.eq
                                                                                br_if $case41|0
                                                                                local.get $1
                                                                                i32.const 42
                                                                                i32.eq
                                                                                br_if $case42|0
                                                                                local.get $1
                                                                                i32.const 43
                                                                                i32.eq
                                                                                br_if $case43|0
                                                                                local.get $1
                                                                                i32.const 44
                                                                                i32.eq
                                                                                br_if $case44|0
                                                                                local.get $1
                                                                                i32.const 45
                                                                                i32.eq
                                                                                br_if $case45|0
                                                                                local.get $1
                                                                                i32.const 46
                                                                                i32.eq
                                                                                br_if $case46|0
                                                                                local.get $1
                                                                                i32.const 47
                                                                                i32.eq
                                                                                br_if $case47|0
                                                                                local.get $1
                                                                                i32.const 48
                                                                                i32.eq
                                                                                br_if $case48|0
                                                                                local.get $1
                                                                                i32.const 49
                                                                                i32.eq
                                                                                br_if $case49|0
                                                                                local.get $1
                                                                                i32.const 50
                                                                                i32.eq
                                                                                br_if $case50|0
                                                                                local.get $1
                                                                                i32.const 51
                                                                                i32.eq
                                                                                br_if $case51|0
                                                                                local.get $1
                                                                                i32.const 52
                                                                                i32.eq
                                                                                br_if $case52|0
                                                                                local.get $1
                                                                                i32.const 53
                                                                                i32.eq
                                                                                br_if $case53|0
                                                                                local.get $1
                                                                                i32.const 54
                                                                                i32.eq
                                                                                br_if $case54|0
                                                                                local.get $1
                                                                                i32.const 55
                                                                                i32.eq
                                                                                br_if $case55|0
                                                                                local.get $1
                                                                                i32.const 56
                                                                                i32.eq
                                                                                br_if $case56|0
                                                                                local.get $1
                                                                                i32.const 57
                                                                                i32.eq
                                                                                br_if $case57|0
                                                                                local.get $1
                                                                                i32.const 58
                                                                                i32.eq
                                                                                br_if $case58|0
                                                                                local.get $1
                                                                                i32.const 59
                                                                                i32.eq
                                                                                br_if $case59|0
                                                                                local.get $1
                                                                                i32.const 60
                                                                                i32.eq
                                                                                br_if $case60|0
                                                                                local.get $1
                                                                                i32.const 61
                                                                                i32.eq
                                                                                br_if $case61|0
                                                                                local.get $1
                                                                                i32.const 62
                                                                                i32.eq
                                                                                br_if $case62|0
                                                                                local.get $1
                                                                                i32.const 63
                                                                                i32.eq
                                                                                br_if $case63|0
                                                                                local.get $1
                                                                                i32.const 64
                                                                                i32.eq
                                                                                br_if $case64|0
                                                                                local.get $1
                                                                                i32.const 65
                                                                                i32.eq
                                                                                br_if $case65|0
                                                                                local.get $1
                                                                                i32.const 66
                                                                                i32.eq
                                                                                br_if $case66|0
                                                                                local.get $1
                                                                                i32.const 67
                                                                                i32.eq
                                                                                br_if $case67|0
                                                                                local.get $1
                                                                                i32.const 68
                                                                                i32.eq
                                                                                br_if $case68|0
                                                                                local.get $1
                                                                                i32.const 69
                                                                                i32.eq
                                                                                br_if $case69|0
                                                                                local.get $1
                                                                                i32.const 70
                                                                                i32.eq
                                                                                br_if $case70|0
                                                                                local.get $1
                                                                                i32.const 71
                                                                                i32.eq
                                                                                br_if $case71|0
                                                                                local.get $1
                                                                                i32.const 72
                                                                                i32.eq
                                                                                br_if $case72|0
                                                                                local.get $1
                                                                                i32.const 73
                                                                                i32.eq
                                                                                br_if $case73|0
                                                                                local.get $1
                                                                                i32.const 74
                                                                                i32.eq
                                                                                br_if $case74|0
                                                                                local.get $1
                                                                                i32.const 75
                                                                                i32.eq
                                                                                br_if $case75|0
                                                                                local.get $1
                                                                                i32.const 76
                                                                                i32.eq
                                                                                br_if $case76|0
                                                                                br $break|0
                                                                               end
                                                                               i32.const 2384
                                                                               return
                                                                              end
                                                                              i32.const 2432
                                                                              return
                                                                             end
                                                                             i32.const 2464
                                                                             return
                                                                            end
                                                                            i32.const 2496
                                                                            return
                                                                           end
                                                                           i32.const 2544
                                                                           return
                                                                          end
                                                                          i32.const 2592
                                                                          return
                                                                         end
                                                                         i32.const 2640
                                                                         return
                                                                        end
                                                                        i32.const 2672
                                                                        return
                                                                       end
                                                                       i32.const 2720
                                                                       return
                                                                      end
                                                                      i32.const 2752
                                                                      return
                                                                     end
                                                                     i32.const 2784
                                                                     return
                                                                    end
                                                                    i32.const 2816
                                                                    return
                                                                   end
                                                                   i32.const 2864
                                                                   return
                                                                  end
                                                                  i32.const 2896
                                                                  return
                                                                 end
                                                                 i32.const 2944
                                                                 return
                                                                end
                                                                i32.const 2992
                                                                return
                                                               end
                                                               i32.const 3040
                                                               return
                                                              end
                                                              i32.const 3072
                                                              return
                                                             end
                                                             i32.const 3120
                                                             return
                                                            end
                                                            i32.const 3152
                                                            return
                                                           end
                                                           i32.const 3184
                                                           return
                                                          end
                                                          i32.const 3216
                                                          return
                                                         end
                                                         i32.const 3248
                                                         return
                                                        end
                                                        i32.const 3280
                                                        return
                                                       end
                                                       i32.const 3328
                                                       return
                                                      end
                                                      i32.const 3360
                                                      return
                                                     end
                                                     i32.const 3392
                                                     return
                                                    end
                                                    i32.const 3440
                                                    return
                                                   end
                                                   i32.const 3472
                                                   return
                                                  end
                                                  i32.const 3504
                                                  return
                                                 end
                                                 i32.const 3536
                                                 return
                                                end
                                                i32.const 3568
                                                return
                                               end
                                               i32.const 3600
                                               return
                                              end
                                              i32.const 3632
                                              return
                                             end
                                             i32.const 3664
                                             return
                                            end
                                            i32.const 3696
                                            return
                                           end
                                           i32.const 3744
                                           return
                                          end
                                          i32.const 3792
                                          return
                                         end
                                         i32.const 3840
                                         return
                                        end
                                        i32.const 3888
                                        return
                                       end
                                       i32.const 3936
                                       return
                                      end
                                      i32.const 3984
                                      return
                                     end
                                     i32.const 4016
                                     return
                                    end
                                    i32.const 4048
                                    return
                                   end
                                   i32.const 4080
                                   return
                                  end
                                  i32.const 4112
                                  return
                                 end
                                 i32.const 4144
                                 return
                                end
                                i32.const 4176
                                return
                               end
                               i32.const 4208
                               return
                              end
                              i32.const 4240
                              return
                             end
                             i32.const 4272
                             return
                            end
                            i32.const 4320
                            return
                           end
                           i32.const 4352
                           return
                          end
                          i32.const 4384
                          return
                         end
                         i32.const 4432
                         return
                        end
                        i32.const 4464
                        return
                       end
                       i32.const 4512
                       return
                      end
                      i32.const 4560
                      return
                     end
                     i32.const 4608
                     return
                    end
                    i32.const 4640
                    return
                   end
                   i32.const 4672
                   return
                  end
                  i32.const 4704
                  return
                 end
                 i32.const 4752
                 return
                end
                i32.const 4800
                return
               end
               i32.const 4832
               return
              end
              i32.const 4864
              return
             end
             i32.const 4896
             return
            end
            i32.const 4944
            return
           end
           i32.const 4992
           return
          end
          i32.const 5024
          return
         end
         i32.const 5056
         return
        end
        i32.const 5088
        return
       end
       i32.const 5120
       return
      end
      i32.const 5152
      return
     end
     i32.const 5200
     return
    end
    i32.const 5232
    return
   end
   i32.const 5264
   return
  end
  i32.const 5312
  return
 )
 (func $~lib/string/String.UTF8.byteLength (param $str i32) (param $nullTerminated i32) (result i32)
  (local $strOff i32)
  (local $strEnd i32)
  (local $bufLen i32)
  (local $c1 i32)
  local.get $str
  local.set $strOff
  local.get $strOff
  local.get $str
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  i32.add
  local.set $strEnd
  local.get $nullTerminated
  i32.const 0
  i32.ne
  local.set $bufLen
  block $while-break|0
   loop $while-continue|0
    local.get $strOff
    local.get $strEnd
    i32.lt_u
    if
     local.get $strOff
     i32.load16_u
     local.set $c1
     local.get $c1
     i32.const 128
     i32.lt_u
     if
      local.get $nullTerminated
      local.get $c1
      i32.eqz
      i32.and
      if
       br $while-break|0
      end
      local.get $bufLen
      i32.const 1
      i32.add
      local.set $bufLen
     else
      local.get $c1
      i32.const 2048
      i32.lt_u
      if
       local.get $bufLen
       i32.const 2
       i32.add
       local.set $bufLen
      else
       local.get $c1
       i32.const 64512
       i32.and
       i32.const 55296
       i32.eq
       if (result i32)
        local.get $strOff
        i32.const 2
        i32.add
        local.get $strEnd
        i32.lt_u
       else
        i32.const 0
       end
       if
        local.get $strOff
        i32.load16_u offset=2
        i32.const 64512
        i32.and
        i32.const 56320
        i32.eq
        if
         local.get $bufLen
         i32.const 4
         i32.add
         local.set $bufLen
         local.get $strOff
         i32.const 4
         i32.add
         local.set $strOff
         br $while-continue|0
        end
       end
       local.get $bufLen
       i32.const 3
       i32.add
       local.set $bufLen
      end
     end
     local.get $strOff
     i32.const 2
     i32.add
     local.set $strOff
     br $while-continue|0
    end
   end
  end
  local.get $bufLen
  return
 )
 (func $~lib/arraybuffer/ArrayBuffer#get:byteLength (param $this i32) (result i32)
  local.get $this
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  return
 )
 (func $~lib/arraybuffer/ArrayBufferView#get:dataStart (param $this i32) (result i32)
  local.get $this
  i32.load offset=4
 )
 (func $~lib/arraybuffer/ArrayBufferView#get:byteLength (param $this i32) (result i32)
  local.get $this
  i32.load offset=8
 )
 (func $~lib/util/number/utoa_hex_lut (param $buffer i32) (param $num i64) (param $offset i32)
  loop $while-continue|0
   local.get $offset
   i32.const 2
   i32.ge_u
   if
    local.get $offset
    i32.const 2
    i32.sub
    local.set $offset
    local.get $buffer
    local.get $offset
    i32.const 1
    i32.shl
    i32.add
    i32.const 5808
    local.get $num
    i32.wrap_i64
    i32.const 255
    i32.and
    i32.const 2
    i32.shl
    i32.add
    i32.load
    i32.store
    local.get $num
    i64.const 8
    i64.shr_u
    local.set $num
    br $while-continue|0
   end
  end
  local.get $offset
  i32.const 1
  i32.and
  if
   local.get $buffer
   i32.const 5808
   local.get $num
   i32.wrap_i64
   i32.const 6
   i32.shl
   i32.add
   i32.load16_u
   i32.store16
  end
 )
 (func $~lib/util/number/ulog_base (param $num i64) (param $base i32) (result i32)
  (local $value i32)
  (local $b64 i64)
  (local $b i64)
  (local $e i32)
  block $~lib/util/number/isPowerOf2<i32>|inlined.0 (result i32)
   local.get $base
   local.set $value
   local.get $value
   i32.popcnt
   i32.const 1
   i32.eq
   br $~lib/util/number/isPowerOf2<i32>|inlined.0
  end
  if
   i32.const 63
   local.get $num
   i64.clz
   i32.wrap_i64
   i32.sub
   i32.const 31
   local.get $base
   i32.clz
   i32.sub
   i32.div_u
   i32.const 1
   i32.add
   return
  end
  local.get $base
  i64.extend_i32_s
  local.set $b64
  local.get $b64
  local.set $b
  i32.const 1
  local.set $e
  loop $while-continue|0
   local.get $num
   local.get $b
   i64.ge_u
   if
    local.get $num
    local.get $b
    i64.div_u
    local.set $num
    local.get $b
    local.get $b
    i64.mul
    local.set $b
    local.get $e
    i32.const 1
    i32.shl
    local.set $e
    br $while-continue|0
   end
  end
  loop $while-continue|1
   local.get $num
   i64.const 1
   i64.ge_u
   if
    local.get $num
    local.get $b64
    i64.div_u
    local.set $num
    local.get $e
    i32.const 1
    i32.add
    local.set $e
    br $while-continue|1
   end
  end
  local.get $e
  i32.const 1
  i32.sub
  return
 )
 (func $~lib/util/number/utoa64_any_core (param $buffer i32) (param $num i64) (param $offset i32) (param $radix i32)
  (local $base i64)
  (local $shift i64)
  (local $mask i64)
  (local $q i64)
  local.get $radix
  i64.extend_i32_s
  local.set $base
  local.get $radix
  local.get $radix
  i32.const 1
  i32.sub
  i32.and
  i32.const 0
  i32.eq
  if
   local.get $radix
   i32.ctz
   i32.const 7
   i32.and
   i64.extend_i32_s
   local.set $shift
   local.get $base
   i64.const 1
   i64.sub
   local.set $mask
   loop $do-loop|0
    local.get $offset
    i32.const 1
    i32.sub
    local.set $offset
    local.get $buffer
    local.get $offset
    i32.const 1
    i32.shl
    i32.add
    i32.const 6864
    local.get $num
    local.get $mask
    i64.and
    i32.wrap_i64
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.store16
    local.get $num
    local.get $shift
    i64.shr_u
    local.set $num
    local.get $num
    i64.const 0
    i64.ne
    br_if $do-loop|0
   end
  else
   loop $do-loop|1
    local.get $offset
    i32.const 1
    i32.sub
    local.set $offset
    local.get $num
    local.get $base
    i64.div_u
    local.set $q
    local.get $buffer
    local.get $offset
    i32.const 1
    i32.shl
    i32.add
    i32.const 6864
    local.get $num
    local.get $q
    local.get $base
    i64.mul
    i64.sub
    i32.wrap_i64
    i32.const 1
    i32.shl
    i32.add
    i32.load16_u
    i32.store16
    local.get $q
    local.set $num
    local.get $num
    i64.const 0
    i64.ne
    br_if $do-loop|1
   end
  end
 )
 (func $assembly/test/Movement#set:moving (param $this i32) (param $moving i32)
  local.get $this
  local.get $moving
  i32.store8
 )
 (func $assembly/test/Movement#set:speed (param $this i32) (param $speed f32)
  local.get $this
  local.get $speed
  f32.store offset=4
 )
 (func $assembly/test/Movement#set:direction (param $this i32) (param $direction i32)
  local.get $this
  local.get $direction
  i32.store offset=8
  local.get $this
  local.get $direction
  i32.const 0
  call $~lib/rt/itcms/__link
 )
 (func $assembly/test/Direction#set:pitch (param $this i32) (param $pitch f32)
  local.get $this
  local.get $pitch
  f32.store
 )
 (func $assembly/test/Direction#set:yaw (param $this i32) (param $yaw f32)
  local.get $this
  local.get $yaw
  f32.store offset=4
 )
 (func $assembly/test/Direction#set:facing (param $this i32) (param $facing f32)
  local.get $this
  local.get $facing
  f32.store offset=8
 )
 (func $~lib/json-as/assembly/serialize/simple/bool/serializeBool (param $data i32)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  (local $size|5 i32)
  (local $n|6 i32)
  (local $deltaBytes|7 i32)
  (local $newPtr|8 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $data
  i32.const 0
  i32.ne
  i32.const 1
  i32.eq
  if
   i32.const 8
   local.set $size
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $size
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.6 (result i32)
     local.get $size
     local.set $n
     i32.const 1
     i32.const 32
     local.get $n
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.6
    end
    local.set $deltaBytes
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr
    i32.store
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28429475166421108
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 8
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
  else
   i32.const 10
   local.set $size|5
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $size|5
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.7 (result i32)
     local.get $size|5
     local.set $n|6
     i32.const 1
     i32.const 32
     local.get $n|6
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.7
    end
    local.set $deltaBytes|7
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes|7
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr|8
    i32.store offset=4
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|8
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|8
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 32370086184550502
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 101
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 10
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<bool> (param $src i32)
  i32.const 1
  drop
  local.get $src
  call $~lib/json-as/assembly/serialize/simple/bool/serializeBool
 )
 (func $~lib/util/number/genDigits (param $buffer i32) (param $w_frc i64) (param $w_exp i32) (param $mp_frc i64) (param $mp_exp i32) (param $delta i64) (param $sign i32) (result i32)
  (local $one_exp i32)
  (local $one_frc i64)
  (local $mask i64)
  (local $wp_w_frc i64)
  (local $p1 i32)
  (local $p2 i64)
  (local $kappa i32)
  (local $len i32)
  (local $d i32)
  (local $16 i32)
  (local $17 i32)
  (local $tmp i64)
  (local $buffer|19 i32)
  (local $len|20 i32)
  (local $delta|21 i64)
  (local $rest i64)
  (local $ten_kappa i64)
  (local $wp_w i64)
  (local $lastp i32)
  (local $digit i32)
  (local $d|27 i64)
  (local $28 i32)
  (local $buffer|29 i32)
  (local $len|30 i32)
  (local $delta|31 i64)
  (local $rest|32 i64)
  (local $ten_kappa|33 i64)
  (local $wp_w|34 i64)
  (local $lastp|35 i32)
  (local $digit|36 i32)
  i32.const 0
  local.get $mp_exp
  i32.sub
  local.set $one_exp
  i64.const 1
  local.get $one_exp
  i64.extend_i32_s
  i64.shl
  local.set $one_frc
  local.get $one_frc
  i64.const 1
  i64.sub
  local.set $mask
  local.get $mp_frc
  local.get $w_frc
  i64.sub
  local.set $wp_w_frc
  local.get $mp_frc
  local.get $one_exp
  i64.extend_i32_s
  i64.shr_u
  i32.wrap_i64
  local.set $p1
  local.get $mp_frc
  local.get $mask
  i64.and
  local.set $p2
  local.get $p1
  call $~lib/util/number/decimalCount32
  local.set $kappa
  local.get $sign
  local.set $len
  loop $while-continue|0
   local.get $kappa
   i32.const 0
   i32.gt_s
   if
    block $break|1
     block $case10|1
      block $case9|1
       block $case8|1
        block $case7|1
         block $case6|1
          block $case5|1
           block $case4|1
            block $case3|1
             block $case2|1
              block $case1|1
               block $case0|1
                local.get $kappa
                local.set $16
                local.get $16
                i32.const 10
                i32.eq
                br_if $case0|1
                local.get $16
                i32.const 9
                i32.eq
                br_if $case1|1
                local.get $16
                i32.const 8
                i32.eq
                br_if $case2|1
                local.get $16
                i32.const 7
                i32.eq
                br_if $case3|1
                local.get $16
                i32.const 6
                i32.eq
                br_if $case4|1
                local.get $16
                i32.const 5
                i32.eq
                br_if $case5|1
                local.get $16
                i32.const 4
                i32.eq
                br_if $case6|1
                local.get $16
                i32.const 3
                i32.eq
                br_if $case7|1
                local.get $16
                i32.const 2
                i32.eq
                br_if $case8|1
                local.get $16
                i32.const 1
                i32.eq
                br_if $case9|1
                br $case10|1
               end
               local.get $p1
               i32.const 1000000000
               i32.div_u
               local.set $d
               local.get $p1
               i32.const 1000000000
               i32.rem_u
               local.set $p1
               br $break|1
              end
              local.get $p1
              i32.const 100000000
              i32.div_u
              local.set $d
              local.get $p1
              i32.const 100000000
              i32.rem_u
              local.set $p1
              br $break|1
             end
             local.get $p1
             i32.const 10000000
             i32.div_u
             local.set $d
             local.get $p1
             i32.const 10000000
             i32.rem_u
             local.set $p1
             br $break|1
            end
            local.get $p1
            i32.const 1000000
            i32.div_u
            local.set $d
            local.get $p1
            i32.const 1000000
            i32.rem_u
            local.set $p1
            br $break|1
           end
           local.get $p1
           i32.const 100000
           i32.div_u
           local.set $d
           local.get $p1
           i32.const 100000
           i32.rem_u
           local.set $p1
           br $break|1
          end
          local.get $p1
          i32.const 10000
          i32.div_u
          local.set $d
          local.get $p1
          i32.const 10000
          i32.rem_u
          local.set $p1
          br $break|1
         end
         local.get $p1
         i32.const 1000
         i32.div_u
         local.set $d
         local.get $p1
         i32.const 1000
         i32.rem_u
         local.set $p1
         br $break|1
        end
        local.get $p1
        i32.const 100
        i32.div_u
        local.set $d
        local.get $p1
        i32.const 100
        i32.rem_u
        local.set $p1
        br $break|1
       end
       local.get $p1
       i32.const 10
       i32.div_u
       local.set $d
       local.get $p1
       i32.const 10
       i32.rem_u
       local.set $p1
       br $break|1
      end
      local.get $p1
      local.set $d
      i32.const 0
      local.set $p1
      br $break|1
     end
     i32.const 0
     local.set $d
     br $break|1
    end
    local.get $d
    local.get $len
    i32.or
    if
     local.get $buffer
     local.get $len
     local.tee $17
     i32.const 1
     i32.add
     local.set $len
     local.get $17
     i32.const 1
     i32.shl
     i32.add
     i32.const 48
     local.get $d
     i32.const 65535
     i32.and
     i32.add
     i32.store16
    end
    local.get $kappa
    i32.const 1
    i32.sub
    local.set $kappa
    local.get $p1
    i64.extend_i32_u
    local.get $one_exp
    i64.extend_i32_s
    i64.shl
    local.get $p2
    i64.add
    local.set $tmp
    local.get $tmp
    local.get $delta
    i64.le_u
    if
     global.get $~lib/util/number/_K
     local.get $kappa
     i32.add
     global.set $~lib/util/number/_K
     local.get $buffer
     local.set $buffer|19
     local.get $len
     local.set $len|20
     local.get $delta
     local.set $delta|21
     local.get $tmp
     local.set $rest
     i32.const 7880
     local.get $kappa
     i32.const 2
     i32.shl
     i32.add
     i64.load32_u
     local.get $one_exp
     i64.extend_i32_s
     i64.shl
     local.set $ten_kappa
     local.get $wp_w_frc
     local.set $wp_w
     local.get $buffer|19
     local.get $len|20
     i32.const 1
     i32.sub
     i32.const 1
     i32.shl
     i32.add
     local.set $lastp
     local.get $lastp
     i32.load16_u
     local.set $digit
     loop $while-continue|3
      local.get $rest
      local.get $wp_w
      i64.lt_u
      if (result i32)
       local.get $delta|21
       local.get $rest
       i64.sub
       local.get $ten_kappa
       i64.ge_u
      else
       i32.const 0
      end
      if (result i32)
       local.get $rest
       local.get $ten_kappa
       i64.add
       local.get $wp_w
       i64.lt_u
       if (result i32)
        i32.const 1
       else
        local.get $wp_w
        local.get $rest
        i64.sub
        local.get $rest
        local.get $ten_kappa
        i64.add
        local.get $wp_w
        i64.sub
        i64.gt_u
       end
      else
       i32.const 0
      end
      if
       local.get $digit
       i32.const 1
       i32.sub
       local.set $digit
       local.get $rest
       local.get $ten_kappa
       i64.add
       local.set $rest
       br $while-continue|3
      end
     end
     local.get $lastp
     local.get $digit
     i32.store16
     local.get $len
     return
    end
    br $while-continue|0
   end
  end
  loop $while-continue|4
   i32.const 1
   if
    local.get $p2
    i64.const 10
    i64.mul
    local.set $p2
    local.get $delta
    i64.const 10
    i64.mul
    local.set $delta
    local.get $p2
    local.get $one_exp
    i64.extend_i32_s
    i64.shr_u
    local.set $d|27
    local.get $d|27
    local.get $len
    i64.extend_i32_s
    i64.or
    i64.const 0
    i64.ne
    if
     local.get $buffer
     local.get $len
     local.tee $28
     i32.const 1
     i32.add
     local.set $len
     local.get $28
     i32.const 1
     i32.shl
     i32.add
     i32.const 48
     local.get $d|27
     i32.wrap_i64
     i32.const 65535
     i32.and
     i32.add
     i32.store16
    end
    local.get $p2
    local.get $mask
    i64.and
    local.set $p2
    local.get $kappa
    i32.const 1
    i32.sub
    local.set $kappa
    local.get $p2
    local.get $delta
    i64.lt_u
    if
     global.get $~lib/util/number/_K
     local.get $kappa
     i32.add
     global.set $~lib/util/number/_K
     local.get $wp_w_frc
     i32.const 7880
     i32.const 0
     local.get $kappa
     i32.sub
     i32.const 2
     i32.shl
     i32.add
     i64.load32_u
     i64.mul
     local.set $wp_w_frc
     local.get $buffer
     local.set $buffer|29
     local.get $len
     local.set $len|30
     local.get $delta
     local.set $delta|31
     local.get $p2
     local.set $rest|32
     local.get $one_frc
     local.set $ten_kappa|33
     local.get $wp_w_frc
     local.set $wp_w|34
     local.get $buffer|29
     local.get $len|30
     i32.const 1
     i32.sub
     i32.const 1
     i32.shl
     i32.add
     local.set $lastp|35
     local.get $lastp|35
     i32.load16_u
     local.set $digit|36
     loop $while-continue|6
      local.get $rest|32
      local.get $wp_w|34
      i64.lt_u
      if (result i32)
       local.get $delta|31
       local.get $rest|32
       i64.sub
       local.get $ten_kappa|33
       i64.ge_u
      else
       i32.const 0
      end
      if (result i32)
       local.get $rest|32
       local.get $ten_kappa|33
       i64.add
       local.get $wp_w|34
       i64.lt_u
       if (result i32)
        i32.const 1
       else
        local.get $wp_w|34
        local.get $rest|32
        i64.sub
        local.get $rest|32
        local.get $ten_kappa|33
        i64.add
        local.get $wp_w|34
        i64.sub
        i64.gt_u
       end
      else
       i32.const 0
      end
      if
       local.get $digit|36
       i32.const 1
       i32.sub
       local.set $digit|36
       local.get $rest|32
       local.get $ten_kappa|33
       i64.add
       local.set $rest|32
       br $while-continue|6
      end
     end
     local.get $lastp|35
     local.get $digit|36
     i32.store16
     local.get $len
     return
    end
    br $while-continue|4
   end
  end
  unreachable
 )
 (func $~lib/util/number/prettify (param $buffer i32) (param $length i32) (param $k i32) (result i32)
  (local $kk i32)
  (local $i i32)
  (local $ptr i32)
  (local $offset i32)
  (local $i|7 i32)
  (local $buffer|8 i32)
  (local $k|9 i32)
  (local $sign i32)
  (local $decimals i32)
  (local $buffer|12 i32)
  (local $num i32)
  (local $offset|14 i32)
  (local $len i32)
  (local $buffer|16 i32)
  (local $k|17 i32)
  (local $sign|18 i32)
  (local $decimals|19 i32)
  (local $buffer|20 i32)
  (local $num|21 i32)
  (local $offset|22 i32)
  local.get $k
  i32.eqz
  if
   local.get $buffer
   local.get $length
   i32.const 1
   i32.shl
   i32.add
   i32.const 46
   i32.const 48
   i32.const 16
   i32.shl
   i32.or
   i32.store
   local.get $length
   i32.const 2
   i32.add
   return
  end
  local.get $length
  local.get $k
  i32.add
  local.set $kk
  local.get $length
  local.get $kk
  i32.le_s
  if (result i32)
   local.get $kk
   i32.const 21
   i32.le_s
  else
   i32.const 0
  end
  if
   local.get $length
   local.set $i
   loop $for-loop|0
    local.get $i
    local.get $kk
    i32.lt_s
    if
     local.get $buffer
     local.get $i
     i32.const 1
     i32.shl
     i32.add
     i32.const 48
     i32.store16
     local.get $i
     i32.const 1
     i32.add
     local.set $i
     br $for-loop|0
    end
   end
   local.get $buffer
   local.get $kk
   i32.const 1
   i32.shl
   i32.add
   i32.const 46
   i32.const 48
   i32.const 16
   i32.shl
   i32.or
   i32.store
   local.get $kk
   i32.const 2
   i32.add
   return
  else
   local.get $kk
   i32.const 0
   i32.gt_s
   if (result i32)
    local.get $kk
    i32.const 21
    i32.le_s
   else
    i32.const 0
   end
   if
    local.get $buffer
    local.get $kk
    i32.const 1
    i32.shl
    i32.add
    local.set $ptr
    local.get $ptr
    i32.const 2
    i32.add
    local.get $ptr
    i32.const 0
    local.get $k
    i32.sub
    i32.const 1
    i32.shl
    memory.copy
    local.get $buffer
    local.get $kk
    i32.const 1
    i32.shl
    i32.add
    i32.const 46
    i32.store16
    local.get $length
    i32.const 1
    i32.add
    return
   else
    i32.const -6
    local.get $kk
    i32.lt_s
    if (result i32)
     local.get $kk
     i32.const 0
     i32.le_s
    else
     i32.const 0
    end
    if
     i32.const 2
     local.get $kk
     i32.sub
     local.set $offset
     local.get $buffer
     local.get $offset
     i32.const 1
     i32.shl
     i32.add
     local.get $buffer
     local.get $length
     i32.const 1
     i32.shl
     memory.copy
     local.get $buffer
     i32.const 48
     i32.const 46
     i32.const 16
     i32.shl
     i32.or
     i32.store
     i32.const 2
     local.set $i|7
     loop $for-loop|1
      local.get $i|7
      local.get $offset
      i32.lt_s
      if
       local.get $buffer
       local.get $i|7
       i32.const 1
       i32.shl
       i32.add
       i32.const 48
       i32.store16
       local.get $i|7
       i32.const 1
       i32.add
       local.set $i|7
       br $for-loop|1
      end
     end
     local.get $length
     local.get $offset
     i32.add
     return
    else
     local.get $length
     i32.const 1
     i32.eq
     if
      local.get $buffer
      i32.const 101
      i32.store16 offset=2
      block $~lib/util/number/genExponent|inlined.0 (result i32)
       local.get $buffer
       i32.const 4
       i32.add
       local.set $buffer|8
       local.get $kk
       i32.const 1
       i32.sub
       local.set $k|9
       local.get $k|9
       i32.const 0
       i32.lt_s
       local.set $sign
       local.get $sign
       if
        i32.const 0
        local.get $k|9
        i32.sub
        local.set $k|9
       end
       local.get $k|9
       call $~lib/util/number/decimalCount32
       i32.const 1
       i32.add
       local.set $decimals
       local.get $buffer|8
       local.set $buffer|12
       local.get $k|9
       local.set $num
       local.get $decimals
       local.set $offset|14
       i32.const 0
       i32.const 1
       i32.ge_s
       drop
       local.get $buffer|12
       local.get $num
       local.get $offset|14
       call $~lib/util/number/utoa32_dec_lut
       local.get $buffer|8
       i32.const 45
       i32.const 43
       local.get $sign
       select
       i32.store16
       local.get $decimals
       br $~lib/util/number/genExponent|inlined.0
      end
      local.set $length
      local.get $length
      i32.const 2
      i32.add
      return
     else
      local.get $length
      i32.const 1
      i32.shl
      local.set $len
      local.get $buffer
      i32.const 4
      i32.add
      local.get $buffer
      i32.const 2
      i32.add
      local.get $len
      i32.const 2
      i32.sub
      memory.copy
      local.get $buffer
      i32.const 46
      i32.store16 offset=2
      local.get $buffer
      local.get $len
      i32.add
      i32.const 101
      i32.store16 offset=2
      local.get $length
      block $~lib/util/number/genExponent|inlined.1 (result i32)
       local.get $buffer
       local.get $len
       i32.add
       i32.const 4
       i32.add
       local.set $buffer|16
       local.get $kk
       i32.const 1
       i32.sub
       local.set $k|17
       local.get $k|17
       i32.const 0
       i32.lt_s
       local.set $sign|18
       local.get $sign|18
       if
        i32.const 0
        local.get $k|17
        i32.sub
        local.set $k|17
       end
       local.get $k|17
       call $~lib/util/number/decimalCount32
       i32.const 1
       i32.add
       local.set $decimals|19
       local.get $buffer|16
       local.set $buffer|20
       local.get $k|17
       local.set $num|21
       local.get $decimals|19
       local.set $offset|22
       i32.const 0
       i32.const 1
       i32.ge_s
       drop
       local.get $buffer|20
       local.get $num|21
       local.get $offset|22
       call $~lib/util/number/utoa32_dec_lut
       local.get $buffer|16
       i32.const 45
       i32.const 43
       local.get $sign|18
       select
       i32.store16
       local.get $decimals|19
       br $~lib/util/number/genExponent|inlined.1
      end
      i32.add
      local.set $length
      local.get $length
      i32.const 2
      i32.add
      return
     end
     unreachable
    end
    unreachable
   end
   unreachable
  end
  unreachable
 )
 (func $~lib/util/number/dtoa_core (param $buffer i32) (param $value f64) (param $isSingle i32) (result i32)
  (local $sign i32)
  (local $value|4 f64)
  (local $buffer|5 i32)
  (local $sign|6 i32)
  (local $isSingle|7 i32)
  (local $frc i64)
  (local $exp i32)
  (local $uv i32)
  (local $sid i32)
  (local $uv|12 i64)
  (local $sid|13 i64)
  (local $f i64)
  (local $e i32)
  (local $isSingle|16 i32)
  (local $frc|17 i64)
  (local $exp|18 i32)
  (local $off i32)
  (local $m i32)
  (local $minExp i32)
  (local $dk f64)
  (local $k i32)
  (local $index i32)
  (local $off|25 i32)
  (local $frc_pow i64)
  (local $exp_pow i32)
  (local $u i64)
  (local $v i64)
  (local $u0 i64)
  (local $v0 i64)
  (local $u1 i64)
  (local $v1 i64)
  (local $l i64)
  (local $t i64)
  (local $w i64)
  (local $w_frc i64)
  (local $e1 i32)
  (local $e2 i32)
  (local $w_exp i32)
  (local $u|41 i64)
  (local $v|42 i64)
  (local $u0|43 i64)
  (local $v0|44 i64)
  (local $u1|45 i64)
  (local $v1|46 i64)
  (local $l|47 i64)
  (local $t|48 i64)
  (local $w|49 i64)
  (local $wp_frc i64)
  (local $e1|51 i32)
  (local $e2|52 i32)
  (local $wp_exp i32)
  (local $u|54 i64)
  (local $v|55 i64)
  (local $u0|56 i64)
  (local $v0|57 i64)
  (local $u1|58 i64)
  (local $v1|59 i64)
  (local $l|60 i64)
  (local $t|61 i64)
  (local $w|62 i64)
  (local $wm_frc i64)
  (local $delta i64)
  (local $len i32)
  local.get $value
  f64.const 0
  f64.lt
  local.set $sign
  local.get $sign
  if
   local.get $value
   f64.neg
   local.set $value
   local.get $buffer
   i32.const 45
   i32.store16
  end
  block $~lib/util/number/grisu2|inlined.0 (result i32)
   local.get $value
   local.set $value|4
   local.get $buffer
   local.set $buffer|5
   local.get $sign
   local.set $sign|6
   local.get $isSingle
   local.set $isSingle|7
   local.get $isSingle|7
   if
    local.get $value|4
    f32.demote_f64
    i32.reinterpret_f32
    local.set $uv
    local.get $uv
    i32.const 2139095040
    i32.and
    i32.const 23
    i32.shr_u
    local.set $exp
    local.get $uv
    i32.const 8388607
    i32.and
    local.set $sid
    local.get $exp
    i32.const 0
    i32.ne
    i64.extend_i32_u
    i64.const 23
    i64.shl
    local.get $sid
    i64.extend_i32_u
    i64.add
    local.set $frc
    local.get $exp
    if (result i32)
     local.get $exp
    else
     i32.const 1
    end
    i32.const 127
    i32.const 23
    i32.add
    i32.sub
    local.set $exp
   else
    local.get $value|4
    i64.reinterpret_f64
    local.set $uv|12
    local.get $uv|12
    i64.const 9218868437227405312
    i64.and
    i64.const 52
    i64.shr_u
    i32.wrap_i64
    local.set $exp
    local.get $uv|12
    i64.const 4503599627370495
    i64.and
    local.set $sid|13
    local.get $exp
    i32.const 0
    i32.ne
    i64.extend_i32_u
    i64.const 52
    i64.shl
    local.get $sid|13
    i64.add
    local.set $frc
    local.get $exp
    if (result i32)
     local.get $exp
    else
     i32.const 1
    end
    i32.const 1023
    i32.const 52
    i32.add
    i32.sub
    local.set $exp
   end
   local.get $frc
   local.set $f
   local.get $exp
   local.set $e
   local.get $isSingle|7
   local.set $isSingle|16
   local.get $f
   i64.const 1
   i64.shl
   i64.const 1
   i64.add
   local.set $frc|17
   local.get $e
   i32.const 1
   i32.sub
   local.set $exp|18
   local.get $frc|17
   i64.clz
   i32.wrap_i64
   local.set $off
   local.get $frc|17
   local.get $off
   i64.extend_i32_s
   i64.shl
   local.set $frc|17
   local.get $exp|18
   local.get $off
   i32.sub
   local.set $exp|18
   i32.const 1
   local.get $f
   local.get $isSingle|16
   if (result i64)
    i64.const 8388608
   else
    i64.const 4503599627370496
   end
   i64.eq
   i32.add
   local.set $m
   local.get $frc|17
   global.set $~lib/util/number/_frc_plus
   local.get $f
   local.get $m
   i64.extend_i32_s
   i64.shl
   i64.const 1
   i64.sub
   local.get $e
   local.get $m
   i32.sub
   local.get $exp|18
   i32.sub
   i64.extend_i32_s
   i64.shl
   global.set $~lib/util/number/_frc_minus
   local.get $exp|18
   global.set $~lib/util/number/_exp
   global.get $~lib/util/number/_exp
   local.set $minExp
   i32.const -61
   local.get $minExp
   i32.sub
   f64.convert_i32_s
   f64.const 0.30102999566398114
   f64.mul
   f64.const 347
   f64.add
   local.set $dk
   local.get $dk
   i32.trunc_sat_f64_s
   local.set $k
   local.get $k
   local.get $k
   f64.convert_i32_s
   local.get $dk
   f64.ne
   i32.add
   local.set $k
   local.get $k
   i32.const 3
   i32.shr_s
   i32.const 1
   i32.add
   local.set $index
   i32.const 348
   local.get $index
   i32.const 3
   i32.shl
   i32.sub
   global.set $~lib/util/number/_K
   i32.const 7008
   local.get $index
   i32.const 3
   i32.shl
   i32.add
   i64.load
   global.set $~lib/util/number/_frc_pow
   i32.const 7704
   local.get $index
   i32.const 1
   i32.shl
   i32.add
   i32.load16_s
   global.set $~lib/util/number/_exp_pow
   local.get $frc
   i64.clz
   i32.wrap_i64
   local.set $off|25
   local.get $frc
   local.get $off|25
   i64.extend_i32_s
   i64.shl
   local.set $frc
   local.get $exp
   local.get $off|25
   i32.sub
   local.set $exp
   global.get $~lib/util/number/_frc_pow
   local.set $frc_pow
   global.get $~lib/util/number/_exp_pow
   local.set $exp_pow
   block $~lib/util/number/umul64f|inlined.0 (result i64)
    local.get $frc
    local.set $u
    local.get $frc_pow
    local.set $v
    local.get $u
    i64.const 4294967295
    i64.and
    local.set $u0
    local.get $v
    i64.const 4294967295
    i64.and
    local.set $v0
    local.get $u
    i64.const 32
    i64.shr_u
    local.set $u1
    local.get $v
    i64.const 32
    i64.shr_u
    local.set $v1
    local.get $u0
    local.get $v0
    i64.mul
    local.set $l
    local.get $u1
    local.get $v0
    i64.mul
    local.get $l
    i64.const 32
    i64.shr_u
    i64.add
    local.set $t
    local.get $u0
    local.get $v1
    i64.mul
    local.get $t
    i64.const 4294967295
    i64.and
    i64.add
    local.set $w
    local.get $w
    i64.const 2147483647
    i64.add
    local.set $w
    local.get $t
    i64.const 32
    i64.shr_u
    local.set $t
    local.get $w
    i64.const 32
    i64.shr_u
    local.set $w
    local.get $u1
    local.get $v1
    i64.mul
    local.get $t
    i64.add
    local.get $w
    i64.add
    br $~lib/util/number/umul64f|inlined.0
   end
   local.set $w_frc
   block $~lib/util/number/umul64e|inlined.0 (result i32)
    local.get $exp
    local.set $e1
    local.get $exp_pow
    local.set $e2
    local.get $e1
    local.get $e2
    i32.add
    i32.const 64
    i32.add
    br $~lib/util/number/umul64e|inlined.0
   end
   local.set $w_exp
   block $~lib/util/number/umul64f|inlined.1 (result i64)
    global.get $~lib/util/number/_frc_plus
    local.set $u|41
    local.get $frc_pow
    local.set $v|42
    local.get $u|41
    i64.const 4294967295
    i64.and
    local.set $u0|43
    local.get $v|42
    i64.const 4294967295
    i64.and
    local.set $v0|44
    local.get $u|41
    i64.const 32
    i64.shr_u
    local.set $u1|45
    local.get $v|42
    i64.const 32
    i64.shr_u
    local.set $v1|46
    local.get $u0|43
    local.get $v0|44
    i64.mul
    local.set $l|47
    local.get $u1|45
    local.get $v0|44
    i64.mul
    local.get $l|47
    i64.const 32
    i64.shr_u
    i64.add
    local.set $t|48
    local.get $u0|43
    local.get $v1|46
    i64.mul
    local.get $t|48
    i64.const 4294967295
    i64.and
    i64.add
    local.set $w|49
    local.get $w|49
    i64.const 2147483647
    i64.add
    local.set $w|49
    local.get $t|48
    i64.const 32
    i64.shr_u
    local.set $t|48
    local.get $w|49
    i64.const 32
    i64.shr_u
    local.set $w|49
    local.get $u1|45
    local.get $v1|46
    i64.mul
    local.get $t|48
    i64.add
    local.get $w|49
    i64.add
    br $~lib/util/number/umul64f|inlined.1
   end
   i64.const 1
   i64.sub
   local.set $wp_frc
   block $~lib/util/number/umul64e|inlined.1 (result i32)
    global.get $~lib/util/number/_exp
    local.set $e1|51
    local.get $exp_pow
    local.set $e2|52
    local.get $e1|51
    local.get $e2|52
    i32.add
    i32.const 64
    i32.add
    br $~lib/util/number/umul64e|inlined.1
   end
   local.set $wp_exp
   block $~lib/util/number/umul64f|inlined.2 (result i64)
    global.get $~lib/util/number/_frc_minus
    local.set $u|54
    local.get $frc_pow
    local.set $v|55
    local.get $u|54
    i64.const 4294967295
    i64.and
    local.set $u0|56
    local.get $v|55
    i64.const 4294967295
    i64.and
    local.set $v0|57
    local.get $u|54
    i64.const 32
    i64.shr_u
    local.set $u1|58
    local.get $v|55
    i64.const 32
    i64.shr_u
    local.set $v1|59
    local.get $u0|56
    local.get $v0|57
    i64.mul
    local.set $l|60
    local.get $u1|58
    local.get $v0|57
    i64.mul
    local.get $l|60
    i64.const 32
    i64.shr_u
    i64.add
    local.set $t|61
    local.get $u0|56
    local.get $v1|59
    i64.mul
    local.get $t|61
    i64.const 4294967295
    i64.and
    i64.add
    local.set $w|62
    local.get $w|62
    i64.const 2147483647
    i64.add
    local.set $w|62
    local.get $t|61
    i64.const 32
    i64.shr_u
    local.set $t|61
    local.get $w|62
    i64.const 32
    i64.shr_u
    local.set $w|62
    local.get $u1|58
    local.get $v1|59
    i64.mul
    local.get $t|61
    i64.add
    local.get $w|62
    i64.add
    br $~lib/util/number/umul64f|inlined.2
   end
   i64.const 1
   i64.add
   local.set $wm_frc
   local.get $wp_frc
   local.get $wm_frc
   i64.sub
   local.set $delta
   local.get $buffer|5
   local.get $w_frc
   local.get $w_exp
   local.get $wp_frc
   local.get $wp_exp
   local.get $delta
   local.get $sign|6
   call $~lib/util/number/genDigits
   br $~lib/util/number/grisu2|inlined.0
  end
  local.set $len
  local.get $buffer
  local.get $sign
  i32.const 1
  i32.shl
  i32.add
  local.get $len
  local.get $sign
  i32.sub
  global.get $~lib/util/number/_K
  call $~lib/util/number/prettify
  local.set $len
  local.get $len
  local.get $sign
  i32.add
  return
 )
 (func $~lib/util/number/dtoa_buffered<f32> (param $buffer i32) (param $value f32) (result i32)
  (local $buffer|2 i32)
  (local $value|3 f64)
  (local $isSingle i32)
  (local $sign i32)
  block $~lib/util/number/dtoa_buffered_impl|inlined.0 (result i32)
   local.get $buffer
   local.set $buffer|2
   local.get $value
   f64.promote_f32
   local.set $value|3
   i32.const 1
   local.set $isSingle
   local.get $value|3
   f64.const 0
   f64.eq
   if
    local.get $buffer|2
    i32.const 48
    i32.store16
    local.get $buffer|2
    i32.const 46
    i32.store16 offset=2
    local.get $buffer|2
    i32.const 48
    i32.store16 offset=4
    i32.const 3
    br $~lib/util/number/dtoa_buffered_impl|inlined.0
   end
   local.get $value|3
   local.get $value|3
   f64.sub
   f64.const 0
   f64.eq
   i32.eqz
   if
    local.get $value|3
    local.get $value|3
    f64.ne
    if
     local.get $buffer|2
     i32.const 78
     i32.store16
     local.get $buffer|2
     i32.const 97
     i32.store16 offset=2
     local.get $buffer|2
     i32.const 78
     i32.store16 offset=4
     i32.const 3
     br $~lib/util/number/dtoa_buffered_impl|inlined.0
    else
     local.get $value|3
     f64.const 0
     f64.lt
     local.set $sign
     local.get $sign
     if
      local.get $buffer|2
      i32.const 45
      i32.store16
      local.get $buffer|2
      i32.const 2
      i32.add
      local.set $buffer|2
     end
     local.get $buffer|2
     i64.const 29555310648492105
     i64.store
     local.get $buffer|2
     i64.const 34058970405077102
     i64.store offset=8
     i32.const 8
     local.get $sign
     i32.add
     br $~lib/util/number/dtoa_buffered_impl|inlined.0
    end
    unreachable
   end
   local.get $buffer|2
   local.get $value|3
   local.get $isSingle
   call $~lib/util/number/dtoa_core
   br $~lib/util/number/dtoa_buffered_impl|inlined.0
  end
  return
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<f32> (param $src f32)
  (local $data f32)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 1
  drop
  local.get $src
  local.set $data
  i32.const 64
  local.set $size
  global.get $~lib/json-as/lib/as-bs/bs.offset
  local.get $size
  i32.add
  global.get $~lib/json-as/lib/as-bs/bs.bufferSize
  global.get $~lib/json-as/lib/as-bs/bs.buffer
  i32.add
  i32.gt_u
  if
   block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.8 (result i32)
    local.get $size
    i32.const 64
    i32.add
    local.set $n
    i32.const 1
    i32.const 32
    local.get $n
    i32.const 1
    i32.sub
    i32.clz
    i32.sub
    i32.shl
    br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.8
   end
   local.set $deltaBytes
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   local.get $deltaBytes
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.bufferSize
   global.get $~lib/memory/__stack_pointer
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   call $~lib/rt/itcms/__renew
   local.tee $newPtr
   i32.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   i32.add
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   i32.sub
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   global.set $~lib/json-as/lib/as-bs/bs.buffer
  end
  global.get $~lib/json-as/lib/as-bs/bs.offset
  global.get $~lib/json-as/lib/as-bs/bs.offset
  local.get $data
  call $~lib/util/number/dtoa_buffered<f32>
  i32.const 1
  i32.shl
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/test/Direction#__SERIALIZE (param $this i32) (param $ptr i32)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  i32.const 54
  local.set $size
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  local.get $size
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.bufferSize
  i32.gt_u
  if
   block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.9 (result i32)
    local.get $size
    local.set $n
    i32.const 1
    i32.const 32
    local.get $n
    i32.const 1
    i32.sub
    i32.clz
    i32.sub
    i32.shl
    br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.9
   end
   local.set $deltaBytes
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   local.get $deltaBytes
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.bufferSize
   global.get $~lib/memory/__stack_pointer
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   call $~lib/rt/itcms/__renew
   local.tee $newPtr
   i32.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   i32.add
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   i32.sub
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   global.set $~lib/json-as/lib/as-bs/bs.buffer
  end
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 29555353593184379
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 9570595891249268
  i64.store offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 58
  i32.store16 offset=16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 18
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  f32.load
  call $~lib/json-as/assembly/index/JSON.__serialize<f32>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 27303592434204716
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 2228343
  i32.store offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 58
  i32.store16 offset=12
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 14
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  f32.load offset=4
  call $~lib/json-as/assembly/index/JSON.__serialize<f32>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 27303510829826092
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 28992395054481507
  i64.store offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 3801122
  i32.store offset=16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 20
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  f32.load offset=8
  call $~lib/json-as/assembly/index/JSON.__serialize<f32>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 125
  i32.store16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 2
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/test/Player#set:active (param $this i32) (param $active i32)
  local.get $this
  local.get $active
  i32.store8
 )
 (func $assembly/test/Player#set:name (param $this i32) (param $name i32)
  local.get $this
  local.get $name
  i32.store offset=4
  local.get $this
  local.get $name
  i32.const 0
  call $~lib/rt/itcms/__link
 )
 (func $assembly/test/Player#set:id (param $this i32) (param $id i64)
  local.get $this
  local.get $id
  i64.store offset=8
 )
 (func $assembly/test/Player#set:pos (param $this i32) (param $pos i32)
  local.get $this
  local.get $pos
  i32.store offset=16
  local.get $this
  local.get $pos
  i32.const 0
  call $~lib/rt/itcms/__link
 )
 (func $assembly/test/Player#set:movement (param $this i32) (param $movement i32)
  local.get $this
  local.get $movement
  i32.store offset=20
  local.get $this
  local.get $movement
  i32.const 0
  call $~lib/rt/itcms/__link
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<~lib/string/String> (param $src i32)
  (local $src|1 i32)
  (local $o i32)
  (local $srcSize i32)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  (local $srcPtr i32)
  (local $srcEnd i32)
  (local $lastPtr i32)
  (local $code i32)
  (local $remBytes i32)
  (local $escaped i32)
  (local $size|14 i32)
  (local $n|15 i32)
  (local $deltaBytes|16 i32)
  (local $newPtr|17 i32)
  (local $size|18 i32)
  (local $n|19 i32)
  (local $deltaBytes|20 i32)
  (local $newPtr|21 i32)
  (local $remBytes|22 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 20
  memory.fill
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 1
  drop
  global.get $~lib/memory/__stack_pointer
  local.get $src
  local.tee $src|1
  i32.store
  block $~lib/json-as/assembly/util/bytes/bytes<~lib/string/String>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   local.get $src|1
   local.tee $o
   i32.store offset=4
   i32.const 0
   drop
   i32.const 1
   drop
   local.get $o
   i32.const 20
   i32.sub
   call $~lib/rt/common/OBJECT#get:rtSize
   br $~lib/json-as/assembly/util/bytes/bytes<~lib/string/String>|inlined.0
  end
  local.set $srcSize
  local.get $srcSize
  i32.const 4
  i32.add
  local.set $size
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  local.get $size
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.bufferSize
  i32.gt_u
  if
   block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.12 (result i32)
    local.get $size
    local.set $n
    i32.const 1
    i32.const 32
    local.get $n
    i32.const 1
    i32.sub
    i32.clz
    i32.sub
    i32.shl
    br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.12
   end
   local.set $deltaBytes
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   local.get $deltaBytes
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.bufferSize
   global.get $~lib/memory/__stack_pointer
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   call $~lib/rt/itcms/__renew
   local.tee $newPtr
   i32.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   i32.add
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   i32.sub
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   global.set $~lib/json-as/lib/as-bs/bs.buffer
  end
  local.get $src|1
  local.set $srcPtr
  local.get $srcPtr
  local.get $srcSize
  i32.add
  local.set $srcEnd
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 34
  i32.store16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 2
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $srcPtr
  local.set $lastPtr
  loop $while-continue|0
   local.get $srcPtr
   local.get $srcEnd
   i32.lt_u
   if
    local.get $srcPtr
    i32.load16_u
    local.set $code
    local.get $code
    i32.const 34
    i32.eq
    if (result i32)
     i32.const 1
    else
     local.get $code
     i32.const 92
     i32.eq
    end
    if (result i32)
     i32.const 1
    else
     local.get $code
     i32.const 32
     i32.lt_u
    end
    if
     local.get $srcPtr
     local.get $lastPtr
     i32.sub
     local.set $remBytes
     global.get $~lib/json-as/lib/as-bs/bs.offset
     local.get $lastPtr
     local.get $remBytes
     memory.copy
     global.get $~lib/json-as/lib/as-bs/bs.offset
     local.get $remBytes
     i32.add
     global.set $~lib/json-as/lib/as-bs/bs.offset
     global.get $~lib/json-as/assembly/globals/tables/SERIALIZE_ESCAPE_TABLE
     local.get $code
     i32.const 2
     i32.const 15
     i32.and
     i32.shl
     i32.const 65535
     i32.and
     i32.add
     i32.load
     local.set $escaped
     local.get $escaped
     i32.const 65535
     i32.and
     i32.const 92
     i32.ne
     if
      i32.const 10
      local.set $size|14
      global.get $~lib/json-as/lib/as-bs/bs.stackSize
      local.get $size|14
      i32.add
      global.set $~lib/json-as/lib/as-bs/bs.stackSize
      global.get $~lib/json-as/lib/as-bs/bs.stackSize
      global.get $~lib/json-as/lib/as-bs/bs.bufferSize
      i32.gt_u
      if
       block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.13 (result i32)
        local.get $size|14
        i32.const 64
        i32.add
        local.set $n|15
        i32.const 1
        i32.const 32
        local.get $n|15
        i32.const 1
        i32.sub
        i32.clz
        i32.sub
        i32.shl
        br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.13
       end
       local.set $deltaBytes|16
       global.get $~lib/json-as/lib/as-bs/bs.bufferSize
       local.get $deltaBytes|16
       i32.add
       global.set $~lib/json-as/lib/as-bs/bs.bufferSize
       global.get $~lib/memory/__stack_pointer
       global.get $~lib/json-as/lib/as-bs/bs.buffer
       global.get $~lib/json-as/lib/as-bs/bs.bufferSize
       call $~lib/rt/itcms/__renew
       local.tee $newPtr|17
       i32.store offset=12
       global.get $~lib/json-as/lib/as-bs/bs.offset
       local.get $newPtr|17
       i32.add
       global.get $~lib/json-as/lib/as-bs/bs.buffer
       i32.sub
       global.set $~lib/json-as/lib/as-bs/bs.offset
       local.get $newPtr|17
       global.set $~lib/json-as/lib/as-bs/bs.buffer
      end
      global.get $~lib/json-as/lib/as-bs/bs.offset
      i64.const 13511005048209500
      i64.store
      global.get $~lib/json-as/lib/as-bs/bs.offset
      local.get $escaped
      i32.store offset=8
      global.get $~lib/json-as/lib/as-bs/bs.offset
      i32.const 12
      i32.add
      global.set $~lib/json-as/lib/as-bs/bs.offset
     else
      i32.const 2
      local.set $size|18
      global.get $~lib/json-as/lib/as-bs/bs.stackSize
      local.get $size|18
      i32.add
      global.set $~lib/json-as/lib/as-bs/bs.stackSize
      global.get $~lib/json-as/lib/as-bs/bs.stackSize
      global.get $~lib/json-as/lib/as-bs/bs.bufferSize
      i32.gt_u
      if
       block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.14 (result i32)
        local.get $size|18
        i32.const 64
        i32.add
        local.set $n|19
        i32.const 1
        i32.const 32
        local.get $n|19
        i32.const 1
        i32.sub
        i32.clz
        i32.sub
        i32.shl
        br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.14
       end
       local.set $deltaBytes|20
       global.get $~lib/json-as/lib/as-bs/bs.bufferSize
       local.get $deltaBytes|20
       i32.add
       global.set $~lib/json-as/lib/as-bs/bs.bufferSize
       global.get $~lib/memory/__stack_pointer
       global.get $~lib/json-as/lib/as-bs/bs.buffer
       global.get $~lib/json-as/lib/as-bs/bs.bufferSize
       call $~lib/rt/itcms/__renew
       local.tee $newPtr|21
       i32.store offset=16
       global.get $~lib/json-as/lib/as-bs/bs.offset
       local.get $newPtr|21
       i32.add
       global.get $~lib/json-as/lib/as-bs/bs.buffer
       i32.sub
       global.set $~lib/json-as/lib/as-bs/bs.offset
       local.get $newPtr|21
       global.set $~lib/json-as/lib/as-bs/bs.buffer
      end
      global.get $~lib/json-as/lib/as-bs/bs.offset
      local.get $escaped
      i32.store
      global.get $~lib/json-as/lib/as-bs/bs.offset
      i32.const 4
      i32.add
      global.set $~lib/json-as/lib/as-bs/bs.offset
     end
     local.get $srcPtr
     i32.const 2
     i32.add
     local.set $lastPtr
    end
    local.get $srcPtr
    i32.const 2
    i32.add
    local.set $srcPtr
    br $while-continue|0
   end
  end
  local.get $srcEnd
  local.get $lastPtr
  i32.sub
  local.set $remBytes|22
  global.get $~lib/json-as/lib/as-bs/bs.offset
  local.get $lastPtr
  local.get $remBytes|22
  memory.copy
  global.get $~lib/json-as/lib/as-bs/bs.offset
  local.get $remBytes|22
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 34
  i32.store16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 2
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/util/number/decimalCount64High (param $value i64) (result i32)
  local.get $value
  i64.const 1000000000000000
  i64.lt_u
  if
   local.get $value
   i64.const 1000000000000
   i64.lt_u
   if
    i32.const 10
    local.get $value
    i64.const 100000000000
    i64.ge_u
    i32.add
    local.get $value
    i64.const 10000000000
    i64.ge_u
    i32.add
    return
   else
    i32.const 13
    local.get $value
    i64.const 100000000000000
    i64.ge_u
    i32.add
    local.get $value
    i64.const 10000000000000
    i64.ge_u
    i32.add
    return
   end
   unreachable
  else
   local.get $value
   i64.const 100000000000000000
   i64.lt_u
   if
    i32.const 16
    local.get $value
    i64.const 10000000000000000
    i64.ge_u
    i32.add
    return
   else
    i32.const 18
    local.get $value
    i64.const -8446744073709551616
    i64.ge_u
    i32.add
    local.get $value
    i64.const 1000000000000000000
    i64.ge_u
    i32.add
    return
   end
   unreachable
  end
  unreachable
 )
 (func $~lib/util/number/utoa64_dec_lut (param $buffer i32) (param $num i64) (param $offset i32)
  (local $t i64)
  (local $r i32)
  (local $b i32)
  (local $c i32)
  (local $b1 i32)
  (local $b2 i32)
  (local $c1 i32)
  (local $c2 i32)
  (local $digits1 i64)
  (local $digits2 i64)
  loop $while-continue|0
   local.get $num
   i64.const 100000000
   i64.ge_u
   if
    local.get $num
    i64.const 100000000
    i64.div_u
    local.set $t
    local.get $num
    local.get $t
    i64.const 100000000
    i64.mul
    i64.sub
    i32.wrap_i64
    local.set $r
    local.get $t
    local.set $num
    local.get $r
    i32.const 10000
    i32.div_u
    local.set $b
    local.get $r
    i32.const 10000
    i32.rem_u
    local.set $c
    local.get $b
    i32.const 100
    i32.div_u
    local.set $b1
    local.get $b
    i32.const 100
    i32.rem_u
    local.set $b2
    local.get $c
    i32.const 100
    i32.div_u
    local.set $c1
    local.get $c
    i32.const 100
    i32.rem_u
    local.set $c2
    i32.const 1900
    local.get $c1
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $digits1
    i32.const 1900
    local.get $c2
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $digits2
    local.get $offset
    i32.const 4
    i32.sub
    local.set $offset
    local.get $buffer
    local.get $offset
    i32.const 1
    i32.shl
    i32.add
    local.get $digits1
    local.get $digits2
    i64.const 32
    i64.shl
    i64.or
    i64.store
    i32.const 1900
    local.get $b1
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $digits1
    i32.const 1900
    local.get $b2
    i32.const 2
    i32.shl
    i32.add
    i64.load32_u
    local.set $digits2
    local.get $offset
    i32.const 4
    i32.sub
    local.set $offset
    local.get $buffer
    local.get $offset
    i32.const 1
    i32.shl
    i32.add
    local.get $digits1
    local.get $digits2
    i64.const 32
    i64.shl
    i64.or
    i64.store
    br $while-continue|0
   end
  end
  local.get $buffer
  local.get $num
  i32.wrap_i64
  local.get $offset
  call $~lib/util/number/utoa32_dec_lut
 )
 (func $~lib/util/number/itoa_buffered<u64> (param $buffer i32) (param $value i64) (result i32)
  (local $sign i32)
  (local $dest i32)
  (local $decimals i32)
  (local $val32 i32)
  (local $buffer|6 i32)
  (local $num i32)
  (local $offset i32)
  (local $val64 i64)
  (local $buffer|10 i32)
  (local $num|11 i64)
  (local $offset|12 i32)
  i32.const 0
  local.set $sign
  i32.const 0
  drop
  local.get $buffer
  local.get $sign
  i32.const 1
  i32.shl
  i32.add
  local.set $dest
  i32.const 0
  i32.const 1
  i32.le_s
  drop
  i32.const 0
  drop
  local.get $value
  i64.const 10
  i64.lt_u
  if
   local.get $buffer
   local.get $value
   i32.const 48
   i64.extend_i32_s
   i64.or
   i64.store16
   i32.const 1
   return
  end
  i32.const 0
  local.set $decimals
  i32.const 8
  i32.const 4
  i32.le_u
  drop
  local.get $value
  global.get $~lib/builtins/u32.MAX_VALUE
  i64.extend_i32_u
  i64.le_u
  if
   local.get $value
   i32.wrap_i64
   local.set $val32
   local.get $val32
   call $~lib/util/number/decimalCount32
   local.set $decimals
   local.get $dest
   local.set $buffer|6
   local.get $val32
   local.set $num
   local.get $decimals
   local.set $offset
   i32.const 0
   i32.const 1
   i32.ge_s
   drop
   local.get $buffer|6
   local.get $num
   local.get $offset
   call $~lib/util/number/utoa32_dec_lut
  else
   local.get $value
   local.set $val64
   local.get $val64
   call $~lib/util/number/decimalCount64High
   local.set $decimals
   local.get $dest
   local.set $buffer|10
   local.get $val64
   local.set $num|11
   local.get $decimals
   local.set $offset|12
   i32.const 0
   i32.const 1
   i32.ge_s
   drop
   local.get $buffer|10
   local.get $num|11
   local.get $offset|12
   call $~lib/util/number/utoa64_dec_lut
  end
  local.get $sign
  local.get $decimals
  i32.add
  return
 )
 (func $assembly/test/Vec3#__SERIALIZE (param $this i32) (param $ptr i32)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  i32.const 50
  local.set $size
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  local.get $size
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.bufferSize
  i32.gt_u
  if
   block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.18 (result i32)
    local.get $size
    local.set $n
    i32.const 1
    i32.const 32
    local.get $n
    i32.const 1
    i32.sub
    i32.clz
    i32.sub
    i32.shl
    br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.18
   end
   local.set $deltaBytes
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   local.get $deltaBytes
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.bufferSize
   global.get $~lib/memory/__stack_pointer
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   call $~lib/rt/itcms/__renew
   local.tee $newPtr
   i32.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   i32.add
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   i32.sub
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   global.set $~lib/json-as/lib/as-bs/bs.buffer
  end
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 9570664606466171
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 58
  i32.store16 offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 10
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  i32.load8_u
  call $~lib/json-as/assembly/index/JSON.__serialize<u8>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 9570668901433388
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 58
  i32.store16 offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 10
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  i32.load8_u offset=1
  call $~lib/json-as/assembly/index/JSON.__serialize<u8>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 9570673196400684
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 58
  i32.store16 offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 10
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  i32.load8_u offset=2
  call $~lib/json-as/assembly/index/JSON.__serialize<u8>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 125
  i32.store16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 2
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/string/String.UTF16.byteLength (param $str i32) (result i32)
  local.get $str
  i32.const 20
  i32.sub
  call $~lib/rt/common/OBJECT#get:rtSize
  return
 )
 (func $~lib/string/String.UTF16.encodeUnsafe (param $str i32) (param $len i32) (param $buf i32) (result i32)
  (local $size i32)
  local.get $len
  i32.const 1
  i32.shl
  local.set $size
  local.get $buf
  local.get $str
  local.get $size
  memory.copy
  local.get $size
  return
 )
 (func $~lib/rt/__visit_globals (param $0 i32)
  (local $1 i32)
  global.get $assembly/test/a1
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/a2
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/a3
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/b1
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/b2
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/b3
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/p1
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/p2
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $assembly/test/p3
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  i32.const 448
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 144
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 256
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 32
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 5808
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 6864
  local.get $0
  call $~lib/rt/itcms/__visit
  global.get $~lib/json-as/assembly/index/JSON.Value.METHODS
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  global.get $~lib/json-as/lib/as-bs/bs.buffer
  local.tee $1
  if
   local.get $1
   local.get $0
   call $~lib/rt/itcms/__visit
  end
  i32.const 656
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 688
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 720
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 752
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 784
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 816
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 848
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 880
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 912
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 944
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 976
  local.get $0
  call $~lib/rt/itcms/__visit
  i32.const 1008
  local.get $0
  call $~lib/rt/itcms/__visit
 )
 (func $~lib/arraybuffer/ArrayBufferView~visit (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/object/Object~visit
  local.get $0
  i32.load
  local.tee $2
  if
   local.get $2
   local.get $1
   call $~lib/rt/itcms/__visit
  end
 )
 (func $~lib/object/Object~visit (param $0 i32) (param $1 i32)
 )
 (func $"~lib/map/Map<u32,u32>#get:buckets" (param $this i32) (result i32)
  local.get $this
  i32.load
 )
 (func $"~lib/map/Map<u32,u32>#get:entries" (param $this i32) (result i32)
  local.get $this
  i32.load offset=8
 )
 (func $"~lib/map/Map<u32,u32>~visit" (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  call $~lib/object/Object~visit
  local.get $0
  local.get $1
  call $"~lib/map/Map<u32,u32>#__visit"
 )
 (func $~lib/typedarray/Uint8Array~visit (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView~visit
 )
 (func $assembly/test/Movement~visit (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/object/Object~visit
  local.get $0
  i32.load offset=8
  local.tee $2
  if
   local.get $2
   local.get $1
   call $~lib/rt/itcms/__visit
  end
 )
 (func $assembly/test/Player~visit (param $0 i32) (param $1 i32)
  (local $2 i32)
  local.get $0
  local.get $1
  call $~lib/object/Object~visit
  local.get $0
  i32.load offset=4
  local.tee $2
  if
   local.get $2
   local.get $1
   call $~lib/rt/itcms/__visit
  end
  local.get $0
  i32.load offset=16
  local.tee $2
  if
   local.get $2
   local.get $1
   call $~lib/rt/itcms/__visit
  end
  local.get $0
  i32.load offset=20
  local.tee $2
  if
   local.get $2
   local.get $1
   call $~lib/rt/itcms/__visit
  end
 )
 (func $~lib/rt/__visit_members (param $0 i32) (param $1 i32)
  block $invalid
   block $assembly/test/Player
    block $assembly/test/Direction
     block $assembly/test/Movement
      block $~lib/typedarray/Uint8Array
       block $assembly/test/Vec3
        block $"~lib/map/Map<u32,u32>"
         block $~lib/json-as/assembly/index/JSON.Value
          block $~lib/arraybuffer/ArrayBufferView
           block $~lib/string/String
            block $~lib/arraybuffer/ArrayBuffer
             block $~lib/object/Object
              local.get $0
              i32.const 8
              i32.sub
              i32.load
              br_table $~lib/object/Object $~lib/arraybuffer/ArrayBuffer $~lib/string/String $~lib/arraybuffer/ArrayBufferView $~lib/json-as/assembly/index/JSON.Value $"~lib/map/Map<u32,u32>" $assembly/test/Vec3 $~lib/typedarray/Uint8Array $assembly/test/Movement $assembly/test/Direction $assembly/test/Player $invalid
             end
             return
            end
            return
           end
           return
          end
          local.get $0
          local.get $1
          call $~lib/arraybuffer/ArrayBufferView~visit
          return
         end
         return
        end
        local.get $0
        local.get $1
        call $"~lib/map/Map<u32,u32>~visit"
        return
       end
       return
      end
      local.get $0
      local.get $1
      call $~lib/typedarray/Uint8Array~visit
      return
     end
     local.get $0
     local.get $1
     call $assembly/test/Movement~visit
     return
    end
    return
   end
   local.get $0
   local.get $1
   call $assembly/test/Player~visit
   return
  end
  unreachable
 )
 (func $~start
  global.get $~started
  if
   return
  end
  i32.const 1
  global.set $~started
  call $start:assembly/test
 )
 (func $~stack_check
  global.get $~lib/memory/__stack_pointer
  global.get $~lib/memory/__data_end
  i32.lt_s
  if
   i32.const 41024
   i32.const 41072
   i32.const 1
   i32.const 1
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
 )
 (func $~lib/string/String.__eq (param $left i32) (param $right i32) (result i32)
  (local $leftLength i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $left
  local.get $right
  i32.eq
  if
   i32.const 1
   local.set $3
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $3
   return
  end
  local.get $left
  i32.const 0
  i32.eq
  if (result i32)
   i32.const 1
  else
   local.get $right
   i32.const 0
   i32.eq
  end
  if
   i32.const 0
   local.set $3
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $3
   return
  end
  local.get $left
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  call $~lib/string/String#get:length
  local.set $leftLength
  local.get $leftLength
  local.get $right
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  call $~lib/string/String#get:length
  i32.ne
  if
   i32.const 0
   local.set $3
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $3
   return
  end
  local.get $left
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  i32.const 0
  local.get $right
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store offset=4
  local.get $3
  i32.const 0
  local.get $leftLength
  call $~lib/util/string/compareImpl
  i32.eqz
  local.set $3
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $3
  return
 )
 (func $~lib/string/String.__ne (param $left i32) (param $right i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $left
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  local.get $right
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  call $~lib/string/String.__eq
  i32.eqz
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
  return
 )
 (func $~lib/wasi_internal/wasi_abort (param $message i32) (param $fileName i32) (param $lineNumber i32) (param $columnNumber i32)
  (local $ptr i32)
  (local $5 i32)
  (local $len i32)
  (local $t i32)
  (local $8 i32)
  (local $t|9 i32)
  (local $10 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  i32.const 0
  i32.const 12
  call $~lib/bindings/wasi_snapshot_preview1/iovec#set:buf
  i32.const 12
  local.set $ptr
  local.get $ptr
  i64.const 9071471065260641
  i64.store
  local.get $ptr
  i32.const 7
  i32.add
  local.set $ptr
  local.get $message
  local.set $10
  global.get $~lib/memory/__stack_pointer
  local.get $10
  i32.store
  local.get $10
  i32.const 0
  call $~lib/string/String.__ne
  if
   local.get $ptr
   local.get $message
   local.get $message
   local.set $10
   global.get $~lib/memory/__stack_pointer
   local.get $10
   i32.store
   local.get $10
   call $~lib/string/String#get:length
   local.get $ptr
   i32.const 0
   i32.const 3
   global.set $~argumentsLength
   i32.const 0
   call $~lib/string/String.UTF8.encodeUnsafe@varargs
   i32.add
   local.set $ptr
  end
  local.get $ptr
  i32.const 544106784
  i32.store
  local.get $ptr
  i32.const 4
  i32.add
  local.set $ptr
  local.get $fileName
  local.set $10
  global.get $~lib/memory/__stack_pointer
  local.get $10
  i32.store
  local.get $10
  i32.const 0
  call $~lib/string/String.__ne
  if
   local.get $ptr
   local.get $fileName
   local.get $fileName
   local.set $10
   global.get $~lib/memory/__stack_pointer
   local.get $10
   i32.store
   local.get $10
   call $~lib/string/String#get:length
   local.get $ptr
   i32.const 0
   i32.const 3
   global.set $~argumentsLength
   i32.const 0
   call $~lib/string/String.UTF8.encodeUnsafe@varargs
   i32.add
   local.set $ptr
  end
  local.get $ptr
  local.tee $5
  i32.const 1
  i32.add
  local.set $ptr
  local.get $5
  i32.const 40
  i32.store8
  local.get $lineNumber
  call $~lib/util/number/decimalCount32
  local.set $len
  local.get $ptr
  local.get $len
  i32.add
  local.set $ptr
  loop $do-loop|0
   local.get $lineNumber
   i32.const 10
   i32.div_u
   local.set $t
   local.get $ptr
   i32.const 1
   i32.sub
   local.tee $ptr
   i32.const 48
   local.get $lineNumber
   i32.const 10
   i32.rem_u
   i32.add
   i32.store8
   local.get $t
   local.set $lineNumber
   local.get $lineNumber
   br_if $do-loop|0
  end
  local.get $ptr
  local.get $len
  i32.add
  local.set $ptr
  local.get $ptr
  local.tee $8
  i32.const 1
  i32.add
  local.set $ptr
  local.get $8
  i32.const 58
  i32.store8
  local.get $columnNumber
  call $~lib/util/number/decimalCount32
  local.set $len
  local.get $ptr
  local.get $len
  i32.add
  local.set $ptr
  loop $do-loop|1
   local.get $columnNumber
   i32.const 10
   i32.div_u
   local.set $t|9
   local.get $ptr
   i32.const 1
   i32.sub
   local.tee $ptr
   i32.const 48
   local.get $columnNumber
   i32.const 10
   i32.rem_u
   i32.add
   i32.store8
   local.get $t|9
   local.set $columnNumber
   local.get $columnNumber
   br_if $do-loop|1
  end
  local.get $ptr
  local.get $len
  i32.add
  local.set $ptr
  local.get $ptr
  i32.const 2601
  i32.store16
  local.get $ptr
  i32.const 2
  i32.add
  local.set $ptr
  i32.const 0
  local.get $ptr
  i32.const 12
  i32.sub
  call $~lib/bindings/wasi_snapshot_preview1/iovec#set:buf_len
  i32.const 2
  i32.const 0
  i32.const 1
  i32.const 8
  call $~lib/bindings/wasi_snapshot_preview1/fd_write
  drop
  i32.const 255
  call $~lib/bindings/wasi_snapshot_preview1/proc_exit
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<u32,u32>#constructor" (param $this i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  local.get $this
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.const 5
   call $~lib/rt/itcms/__new
   local.tee $this
   i32.store
  end
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.const 4
  i32.const 4
  i32.mul
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  local.get $1
  call $"~lib/map/Map<u32,u32>#set:buckets"
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 4
  i32.const 1
  i32.sub
  call $"~lib/map/Map<u32,u32>#set:bucketsMask"
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  i32.const 4
  block $"~lib/map/ENTRY_SIZE<u32,u32>|inlined.0" (result i32)
   i32.const 12
   br $"~lib/map/ENTRY_SIZE<u32,u32>|inlined.0"
  end
  i32.mul
  call $~lib/arraybuffer/ArrayBuffer#constructor
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=8
  local.get $1
  call $"~lib/map/Map<u32,u32>#set:entries"
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 4
  call $"~lib/map/Map<u32,u32>#set:entriesCapacity"
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  call $"~lib/map/Map<u32,u32>#set:entriesOffset"
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store offset=4
  local.get $1
  i32.const 0
  call $"~lib/map/Map<u32,u32>#set:entriesCount"
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
 )
 (func $assembly/test/Vec3#constructor (param $this i32) (param $x i32) (param $y i32) (param $z i32) (result i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $this
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 3
   i32.const 6
   call $~lib/rt/itcms/__new
   local.tee $this
   i32.store
  end
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  i32.const 0
  call $assembly/test/Vec3#set:x
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  i32.const 0
  call $assembly/test/Vec3#set:y
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  i32.const 0
  call $assembly/test/Vec3#set:z
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $x
  call $assembly/test/Vec3#set:x
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $y
  call $assembly/test/Vec3#set:y
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $z
  call $assembly/test/Vec3#set:z
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $4
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<u8> (param $src i32)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  (local $data i32)
  (local $size|6 i32)
  (local $n|7 i32)
  (local $deltaBytes|8 i32)
  (local $newPtr|9 i32)
  (local $bytesWritten i32)
  (local $size|11 i32)
  (local $n|12 i32)
  (local $deltaBytes|13 i32)
  (local $newPtr|14 i32)
  (local $15 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 20
  memory.fill
  i32.const 0
  drop
  i32.const 1856
  local.set $15
  global.get $~lib/memory/__stack_pointer
  local.get $15
  i32.store
  local.get $15
  i32.const 1888
  local.set $15
  global.get $~lib/memory/__stack_pointer
  local.get $15
  i32.store offset=4
  local.get $15
  call $~lib/string/String.__eq
  if (result i32)
   local.get $src
   i32.const 255
   i32.and
   i32.const 0
   i32.eq
  else
   i32.const 0
  end
  if
   i32.const 8
   local.set $size
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $size
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.1 (result i32)
     local.get $size
     local.set $n
     i32.const 1
     i32.const 32
     local.get $n
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.1
    end
    local.set $deltaBytes
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr
    i32.store offset=8
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 30399761348886638
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 8
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
  else
   i32.const 1
   drop
   local.get $src
   local.set $data
   i32.const 1
   i32.const 3
   i32.shl
   local.set $size|6
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $size|6
   i32.add
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   i32.add
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.2 (result i32)
     local.get $size|6
     i32.const 64
     i32.add
     local.set $n|7
     i32.const 1
     i32.const 32
     local.get $n|7
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.2
    end
    local.set $deltaBytes|8
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes|8
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr|9
    i32.store offset=12
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|9
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|9
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $data
   call $~lib/util/number/itoa_buffered<u8>
   i32.const 1
   i32.shl
   local.set $bytesWritten
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $bytesWritten
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $bytesWritten
   local.set $size|11
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $size|11
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.3 (result i32)
     local.get $size|11
     i32.const 64
     i32.add
     local.set $n|12
     i32.const 1
     i32.const 32
     local.get $n|12
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.3
    end
    local.set $deltaBytes|13
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes|13
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr|14
    i32.store offset=16
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|14
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|14
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/string/String#concat (param $this i32) (param $other i32) (result i32)
  (local $thisSize i32)
  (local $otherSize i32)
  (local $outSize i32)
  (local $out i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store
  local.get $6
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.set $thisSize
  local.get $other
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store
  local.get $6
  call $~lib/string/String#get:length
  i32.const 1
  i32.shl
  local.set $otherSize
  local.get $thisSize
  local.get $otherSize
  i32.add
  local.set $outSize
  local.get $outSize
  i32.const 0
  i32.eq
  if
   i32.const 2320
   local.set $6
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $6
   return
  end
  global.get $~lib/memory/__stack_pointer
  local.get $outSize
  i32.const 2
  call $~lib/rt/itcms/__new
  local.tee $out
  i32.store offset=4
  local.get $out
  local.get $this
  local.get $thisSize
  memory.copy
  local.get $out
  local.get $thisSize
  i32.add
  local.get $other
  local.get $otherSize
  memory.copy
  local.get $out
  local.set $6
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $6
  return
 )
 (func $~lib/string/String.__concat (param $left i32) (param $right i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $left
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  local.get $right
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  call $~lib/string/String#concat
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
  return
 )
 (func $~lib/wasi_process/writeString (param $fd i32) (param $data i32)
  (local $len i32)
  (local $char2 i32)
  (local $char3 i32)
  (local $char4 i32)
  (local $6 i32)
  (local $char1 i32)
  (local $err i32)
  (local $utf8len i32)
  (local $utf8buf i32)
  (local $err|11 i32)
  (local $12 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $data
  local.set $12
  global.get $~lib/memory/__stack_pointer
  local.get $12
  i32.store
  local.get $12
  call $~lib/string/String#get:length
  local.set $len
  i32.const 0
  local.set $char2
  i32.const 0
  local.set $char3
  i32.const 0
  local.set $char4
  block $break|0
   block $case4|0
    block $case3|0
     block $case2|0
      block $case1|0
       block $case0|0
        local.get $len
        local.set $6
        local.get $6
        i32.const 4
        i32.eq
        br_if $case0|0
        local.get $6
        i32.const 3
        i32.eq
        br_if $case1|0
        local.get $6
        i32.const 2
        i32.eq
        br_if $case2|0
        local.get $6
        i32.const 1
        i32.eq
        br_if $case3|0
        local.get $6
        i32.const 0
        i32.eq
        br_if $case4|0
        br $break|0
       end
       local.get $data
       i32.load16_u offset=6
       local.set $char4
       local.get $char4
       i32.const 128
       i32.ge_u
       if
        br $break|0
       end
      end
      local.get $data
      i32.load16_u offset=4
      local.set $char3
      local.get $char3
      i32.const 128
      i32.ge_u
      if
       br $break|0
      end
     end
     local.get $data
     i32.load16_u offset=2
     local.set $char2
     local.get $char2
     i32.const 128
     i32.ge_u
     if
      br $break|0
     end
    end
    local.get $data
    i32.load16_u
    local.set $char1
    local.get $char1
    i32.const 128
    i32.ge_u
    if
     br $break|0
    end
    global.get $~lib/wasi_internal/tempbuf
    global.get $~lib/wasi_internal/tempbuf
    i32.const 2
    i32.const 4
    i32.mul
    i32.add
    i32.store
    global.get $~lib/wasi_internal/tempbuf
    local.get $len
    i32.store offset=4
    global.get $~lib/wasi_internal/tempbuf
    local.get $char1
    local.get $char2
    i32.const 8
    i32.shl
    i32.or
    local.get $char3
    i32.const 16
    i32.shl
    i32.or
    local.get $char4
    i32.const 24
    i32.shl
    i32.or
    i32.store offset=8
    local.get $fd
    global.get $~lib/wasi_internal/tempbuf
    i32.const 1
    global.get $~lib/wasi_internal/tempbuf
    i32.const 3
    i32.const 4
    i32.mul
    i32.add
    call $~lib/bindings/wasi_snapshot_preview1/fd_write
    local.set $err
    local.get $err
    i32.const 65535
    i32.and
    if
     local.get $err
     call $~lib/bindings/wasi_snapshot_preview1/errnoToString
     i32.const 5360
     i32.const 177
     i32.const 16
     call $~lib/wasi_internal/wasi_abort
     unreachable
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   return
  end
  local.get $data
  local.set $12
  global.get $~lib/memory/__stack_pointer
  local.get $12
  i32.store
  local.get $12
  i32.const 0
  call $~lib/string/String.UTF8.byteLength
  local.set $utf8len
  local.get $utf8len
  call $~lib/rt/tlsf/__alloc
  local.set $utf8buf
  local.get $data
  local.get $len
  local.get $utf8buf
  i32.const 0
  i32.const 3
  global.set $~argumentsLength
  i32.const 0
  call $~lib/string/String.UTF8.encodeUnsafe@varargs
  local.get $utf8len
  i32.eq
  i32.eqz
  if
   i32.const 0
   i32.const 5360
   i32.const 183
   i32.const 3
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  global.get $~lib/wasi_internal/tempbuf
  local.get $utf8buf
  i32.store
  global.get $~lib/wasi_internal/tempbuf
  local.get $utf8len
  i32.store offset=4
  local.get $fd
  global.get $~lib/wasi_internal/tempbuf
  i32.const 1
  global.get $~lib/wasi_internal/tempbuf
  i32.const 2
  i32.const 4
  i32.mul
  i32.add
  call $~lib/bindings/wasi_snapshot_preview1/fd_write
  local.set $err|11
  local.get $utf8buf
  call $~lib/rt/tlsf/__free
  local.get $err|11
  i32.const 65535
  i32.and
  if
   local.get $err|11
   call $~lib/bindings/wasi_snapshot_preview1/errnoToString
   i32.const 5360
   i32.const 188
   i32.const 12
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/wasi_process/WritableStream#write<~lib/string/String> (param $this i32) (param $data i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  i32.const 1
  drop
  local.get $this
  local.get $data
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  call $~lib/wasi_process/writeString
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/wasi_console/wasi_console.log (param $message i32)
  (local $stdout i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  global.get $~lib/wasi_process/wasi_process.stdout
  local.set $stdout
  local.get $stdout
  local.get $message
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  call $~lib/wasi_process/WritableStream#write<~lib/string/String>
  local.get $stdout
  i32.const 5424
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  call $~lib/wasi_process/WritableStream#write<~lib/string/String>
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/typedarray/Uint8Array.wrap (param $buffer i32) (param $byteOffset i32) (param $length i32) (result i32)
  (local $buffer|3 i32)
  (local $byteOffset|4 i32)
  (local $len i32)
  (local $byteLength i32)
  (local $bufferByteLength i32)
  (local $out i32)
  (local $9 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  block $"~lib/typedarray/WRAP<~lib/typedarray/Uint8Array,u8>|inlined.0" (result i32)
   global.get $~lib/memory/__stack_pointer
   local.get $buffer
   local.tee $buffer|3
   i32.store
   local.get $byteOffset
   local.set $byteOffset|4
   local.get $length
   local.set $len
   local.get $buffer|3
   local.set $9
   global.get $~lib/memory/__stack_pointer
   local.get $9
   i32.store offset=4
   local.get $9
   call $~lib/arraybuffer/ArrayBuffer#get:byteLength
   local.set $bufferByteLength
   local.get $byteOffset|4
   local.get $bufferByteLength
   i32.gt_u
   local.get $byteOffset|4
   i32.const 0
   i32.and
   i32.or
   if
    i32.const 448
    i32.const 5488
    i32.const 1860
    i32.const 5
    call $~lib/wasi_internal/wasi_abort
    unreachable
   end
   local.get $len
   i32.const 0
   i32.lt_s
   if
    local.get $len
    i32.const -1
    i32.eq
    if
     local.get $bufferByteLength
     i32.const 0
     i32.and
     if
      i32.const 144
      i32.const 5488
      i32.const 1865
      i32.const 9
      call $~lib/wasi_internal/wasi_abort
      unreachable
     end
     local.get $bufferByteLength
     local.get $byteOffset|4
     i32.sub
     local.set $byteLength
    else
     i32.const 144
     i32.const 5488
     i32.const 1869
     i32.const 7
     call $~lib/wasi_internal/wasi_abort
     unreachable
    end
   else
    local.get $len
    i32.const 0
    i32.shl
    local.set $byteLength
    local.get $byteOffset|4
    local.get $byteLength
    i32.add
    local.get $bufferByteLength
    i32.gt_s
    if
     i32.const 144
     i32.const 5488
     i32.const 1874
     i32.const 7
     call $~lib/wasi_internal/wasi_abort
     unreachable
    end
   end
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.const 7
   call $~lib/rt/itcms/__new
   local.tee $out
   i32.store offset=8
   local.get $out
   local.get $buffer|3
   i32.store
   local.get $out
   local.get $buffer|3
   i32.const 0
   call $~lib/rt/itcms/__link
   local.get $out
   local.get $byteLength
   i32.store offset=8
   local.get $out
   local.get $buffer|3
   local.get $byteOffset|4
   i32.add
   i32.store offset=4
   local.get $out
   br $"~lib/typedarray/WRAP<~lib/typedarray/Uint8Array,u8>|inlined.0"
  end
  local.set $9
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $9
  return
 )
 (func $~lib/typedarray/Uint8Array.wrap@varargs (param $buffer i32) (param $byteOffset i32) (param $length i32) (result i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  block $2of2
   block $1of2
    block $0of2
     block $outOfRange
      global.get $~argumentsLength
      i32.const 1
      i32.sub
      br_table $0of2 $1of2 $2of2 $outOfRange
     end
     unreachable
    end
    i32.const 0
    local.set $byteOffset
   end
   i32.const -1
   local.set $length
  end
  local.get $buffer
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  local.get $byteOffset
  local.get $length
  call $~lib/typedarray/Uint8Array.wrap
  local.set $3
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $3
 )
 (func $~lib/typedarray/Uint8Array#get:length (param $this i32) (result i32)
  (local $1 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $this
  local.set $1
  global.get $~lib/memory/__stack_pointer
  local.get $1
  i32.store
  local.get $1
  call $~lib/arraybuffer/ArrayBufferView#get:byteLength
  local.set $1
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $1
  return
 )
 (func $~lib/string/String#substring (param $this i32) (param $start i32) (param $end i32) (result i32)
  (local $len i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $finalStart i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $finalEnd i32)
  (local $14 i32)
  (local $15 i32)
  (local $fromPos i32)
  (local $17 i32)
  (local $18 i32)
  (local $toPos i32)
  (local $size i32)
  (local $out i32)
  (local $22 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $this
  local.set $22
  global.get $~lib/memory/__stack_pointer
  local.get $22
  i32.store
  local.get $22
  call $~lib/string/String#get:length
  local.set $len
  local.get $start
  local.tee $4
  i32.const 0
  local.tee $5
  local.get $4
  local.get $5
  i32.gt_s
  select
  local.tee $6
  local.get $len
  local.tee $7
  local.get $6
  local.get $7
  i32.lt_s
  select
  local.set $finalStart
  local.get $end
  local.tee $9
  i32.const 0
  local.tee $10
  local.get $9
  local.get $10
  i32.gt_s
  select
  local.tee $11
  local.get $len
  local.tee $12
  local.get $11
  local.get $12
  i32.lt_s
  select
  local.set $finalEnd
  local.get $finalStart
  local.tee $14
  local.get $finalEnd
  local.tee $15
  local.get $14
  local.get $15
  i32.lt_s
  select
  i32.const 1
  i32.shl
  local.set $fromPos
  local.get $finalStart
  local.tee $17
  local.get $finalEnd
  local.tee $18
  local.get $17
  local.get $18
  i32.gt_s
  select
  i32.const 1
  i32.shl
  local.set $toPos
  local.get $toPos
  local.get $fromPos
  i32.sub
  local.set $size
  local.get $size
  i32.eqz
  if
   i32.const 2320
   local.set $22
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $22
   return
  end
  local.get $fromPos
  i32.eqz
  if (result i32)
   local.get $toPos
   local.get $len
   i32.const 1
   i32.shl
   i32.eq
  else
   i32.const 0
  end
  if
   local.get $this
   local.set $22
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $22
   return
  end
  global.get $~lib/memory/__stack_pointer
  local.get $size
  i32.const 2
  call $~lib/rt/itcms/__new
  local.tee $out
  i32.store offset=4
  local.get $out
  local.get $this
  local.get $fromPos
  i32.add
  local.get $size
  memory.copy
  local.get $out
  local.set $22
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $22
  return
 )
 (func $~lib/util/string/joinIntegerArray<u8> (param $dataStart i32) (param $length i32) (param $separator i32) (result i32)
  (local $lastIndex i32)
  (local $value i32)
  (local $sepLen i32)
  (local $estLen i32)
  (local $result i32)
  (local $offset i32)
  (local $value|9 i32)
  (local $i i32)
  (local $11 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $length
  i32.const 1
  i32.sub
  local.set $lastIndex
  local.get $lastIndex
  i32.const 0
  i32.lt_s
  if
   i32.const 2320
   local.set $11
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $11
   return
  end
  local.get $lastIndex
  i32.eqz
  if
   local.get $dataStart
   i32.load8_u
   local.set $value
   i32.const 0
   drop
   i32.const 1
   i32.const 4
   i32.le_u
   drop
   local.get $value
   i32.const 10
   call $~lib/util/number/utoa32
   local.set $11
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $11
   return
  end
  local.get $separator
  local.set $11
  global.get $~lib/memory/__stack_pointer
  local.get $11
  i32.store
  local.get $11
  call $~lib/string/String#get:length
  local.set $sepLen
  i32.const 10
  local.get $sepLen
  i32.add
  local.get $lastIndex
  i32.mul
  i32.const 10
  i32.add
  local.set $estLen
  global.get $~lib/memory/__stack_pointer
  local.get $estLen
  i32.const 1
  i32.shl
  i32.const 2
  call $~lib/rt/itcms/__new
  local.tee $result
  i32.store offset=4
  i32.const 0
  local.set $offset
  i32.const 0
  local.set $i
  loop $for-loop|0
   local.get $i
   local.get $lastIndex
   i32.lt_s
   if
    local.get $dataStart
    local.get $i
    i32.const 0
    i32.shl
    i32.add
    i32.load8_u
    local.set $value|9
    local.get $offset
    local.get $result
    local.get $offset
    i32.const 1
    i32.shl
    i32.add
    local.get $value|9
    call $~lib/util/number/itoa_buffered<u8>
    i32.add
    local.set $offset
    local.get $sepLen
    if
     local.get $result
     local.get $offset
     i32.const 1
     i32.shl
     i32.add
     local.get $separator
     local.get $sepLen
     i32.const 1
     i32.shl
     memory.copy
     local.get $offset
     local.get $sepLen
     i32.add
     local.set $offset
    end
    local.get $i
    i32.const 1
    i32.add
    local.set $i
    br $for-loop|0
   end
  end
  local.get $dataStart
  local.get $lastIndex
  i32.const 0
  i32.shl
  i32.add
  i32.load8_u
  local.set $value|9
  local.get $offset
  local.get $result
  local.get $offset
  i32.const 1
  i32.shl
  i32.add
  local.get $value|9
  call $~lib/util/number/itoa_buffered<u8>
  i32.add
  local.set $offset
  local.get $estLen
  local.get $offset
  i32.gt_s
  if
   local.get $result
   local.set $11
   global.get $~lib/memory/__stack_pointer
   local.get $11
   i32.store
   local.get $11
   i32.const 0
   local.get $offset
   call $~lib/string/String#substring
   local.set $11
   global.get $~lib/memory/__stack_pointer
   i32.const 8
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $11
   return
  end
  local.get $result
  local.set $11
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $11
  return
 )
 (func $~lib/typedarray/Uint8Array#join (param $this i32) (param $separator i32) (result i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $this
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  call $~lib/arraybuffer/ArrayBufferView#get:dataStart
  local.get $this
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  call $~lib/typedarray/Uint8Array#get:length
  local.get $separator
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  call $~lib/util/string/joinIntegerArray<u8>
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
  return
 )
 (func $assembly/test/visualise (param $data i32) (result i32)
  (local $bytes i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  global.get $~lib/memory/__stack_pointer
  local.get $data
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  i32.const 0
  i32.const 1
  global.set $~argumentsLength
  i32.const 0
  call $~lib/typedarray/Uint8Array.wrap@varargs
  local.tee $bytes
  i32.store offset=4
  local.get $bytes
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  i32.const 5552
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=8
  local.get $2
  call $~lib/typedarray/Uint8Array#join
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
  return
 )
 (func $assembly/test/Movement#constructor (param $this i32) (param $moving i32) (param $speed f32) (param $direction i32) (result i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  local.get $this
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.const 8
   call $~lib/rt/itcms/__new
   local.tee $this
   i32.store
  end
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  i32.const 0
  call $assembly/test/Movement#set:moving
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  f32.const 0
  call $assembly/test/Movement#set:speed
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  i32.const 0
  call $assembly/test/Movement#set:direction
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $moving
  call $assembly/test/Movement#set:moving
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $speed
  call $assembly/test/Movement#set:speed
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $direction
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=8
  local.get $4
  call $assembly/test/Movement#set:direction
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $4
 )
 (func $assembly/test/Direction#constructor (param $this i32) (param $pitch f32) (param $yaw f32) (param $facing f32) (result i32)
  (local $4 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  local.get $this
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.const 9
   call $~lib/rt/itcms/__new
   local.tee $this
   i32.store
  end
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  f32.const 0
  call $assembly/test/Direction#set:pitch
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  f32.const 0
  call $assembly/test/Direction#set:yaw
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  f32.const 0
  call $assembly/test/Direction#set:facing
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $pitch
  call $assembly/test/Direction#set:pitch
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $yaw
  call $assembly/test/Direction#set:yaw
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  local.get $4
  i32.store offset=4
  local.get $4
  local.get $facing
  call $assembly/test/Direction#set:facing
  local.get $this
  local.set $4
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $4
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Direction> (param $src i32)
  (local $data i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 1
  drop
  global.get $~lib/memory/__stack_pointer
  local.get $src
  local.tee $data
  i32.store
  local.get $data
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $data
  call $assembly/test/Direction#__SERIALIZE
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/test/Player#constructor (param $this i32) (param $active i32) (param $name i32) (param $id i64) (param $pos i32) (param $movement i32) (result i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store offset=8
  local.get $this
  i32.eqz
  if
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.const 10
   call $~lib/rt/itcms/__new
   local.tee $this
   i32.store
  end
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  i32.const 0
  call $assembly/test/Player#set:active
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  i32.const 0
  call $assembly/test/Player#set:name
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  i64.const 0
  call $assembly/test/Player#set:id
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  i32.const 0
  call $assembly/test/Player#set:pos
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  i32.const 0
  call $assembly/test/Player#set:movement
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  local.get $active
  call $assembly/test/Player#set:active
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  local.get $name
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=8
  local.get $6
  call $assembly/test/Player#set:name
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  local.get $id
  call $assembly/test/Player#set:id
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  local.get $pos
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=8
  local.get $6
  call $assembly/test/Player#set:pos
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  local.get $movement
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=8
  local.get $6
  call $assembly/test/Player#set:movement
  local.get $this
  local.set $6
  global.get $~lib/memory/__stack_pointer
  i32.const 12
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $6
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<u64> (param $src i64)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  (local $data i64)
  (local $size|6 i32)
  (local $n|7 i32)
  (local $deltaBytes|8 i32)
  (local $newPtr|9 i32)
  (local $bytesWritten i32)
  (local $size|11 i32)
  (local $n|12 i32)
  (local $deltaBytes|13 i32)
  (local $newPtr|14 i32)
  (local $15 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 20
  memory.fill
  i32.const 0
  drop
  i32.const 8096
  local.set $15
  global.get $~lib/memory/__stack_pointer
  local.get $15
  i32.store
  local.get $15
  i32.const 1888
  local.set $15
  global.get $~lib/memory/__stack_pointer
  local.get $15
  i32.store offset=4
  local.get $15
  call $~lib/string/String.__eq
  if (result i32)
   local.get $src
   i64.const 0
   i64.eq
  else
   i32.const 0
  end
  if
   i32.const 8
   local.set $size
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $size
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.15 (result i32)
     local.get $size
     local.set $n
     i32.const 1
     i32.const 32
     local.get $n
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.15
    end
    local.set $deltaBytes
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr
    i32.store offset=8
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 30399761348886638
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 8
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
  else
   i32.const 1
   drop
   local.get $src
   local.set $data
   i32.const 8
   i32.const 3
   i32.shl
   local.set $size|6
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $size|6
   i32.add
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   i32.add
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.16 (result i32)
     local.get $size|6
     i32.const 64
     i32.add
     local.set $n|7
     i32.const 1
     i32.const 32
     local.get $n|7
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.16
    end
    local.set $deltaBytes|8
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes|8
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr|9
    i32.store offset=12
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|9
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|9
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $data
   call $~lib/util/number/itoa_buffered<u64>
   i32.const 1
   i32.shl
   local.set $bytesWritten
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $bytesWritten
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $bytesWritten
   local.set $size|11
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $size|11
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.17 (result i32)
     local.get $size|11
     i32.const 64
     i32.add
     local.set $n|12
     i32.const 1
     i32.const 32
     local.get $n|12
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.17
    end
    local.set $deltaBytes|13
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $deltaBytes|13
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $newPtr|14
    i32.store offset=16
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|14
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $newPtr|14
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
  end
  global.get $~lib/memory/__stack_pointer
  i32.const 20
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Vec3> (param $src i32)
  (local $data i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 1
  drop
  global.get $~lib/memory/__stack_pointer
  local.get $src
  local.tee $data
  i32.store
  local.get $data
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $data
  call $assembly/test/Vec3#__SERIALIZE
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $assembly/test/Movement#__SERIALIZE (param $this i32) (param $ptr i32)
  (local $size i32)
  (local $n i32)
  (local $deltaBytes i32)
  (local $newPtr i32)
  (local $6 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  i32.const 130
  local.set $size
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  local.get $size
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.stackSize
  global.get $~lib/json-as/lib/as-bs/bs.bufferSize
  i32.gt_u
  if
   block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.19 (result i32)
    local.get $size
    local.set $n
    i32.const 1
    i32.const 32
    local.get $n
    i32.const 1
    i32.sub
    i32.clz
    i32.sub
    i32.shl
    br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.19
   end
   local.set $deltaBytes
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   local.get $deltaBytes
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.bufferSize
   global.get $~lib/memory/__stack_pointer
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   call $~lib/rt/itcms/__renew
   local.tee $newPtr
   i32.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   i32.add
   global.get $~lib/json-as/lib/as-bs/bs.buffer
   i32.sub
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $newPtr
   global.set $~lib/json-as/lib/as-bs/bs.buffer
  end
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 31244190568546427
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 28992395054481526
  i64.store offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 3801122
  i32.store offset=16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 20
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  i32.load8_u
  call $~lib/json-as/assembly/index/JSON.__serialize<bool>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 31525691315060780
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 9570578711511141
  i64.store offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 58
  i32.store16 offset=16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 18
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  f32.load offset=4
  call $~lib/json-as/assembly/index/JSON.__serialize<f32>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 29555302053576748
  i64.store
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 32651522506817650
  i64.store offset=8
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i64.const 9570621661839465
  i64.store offset=16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 58
  i32.store16 offset=24
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 26
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  local.get $ptr
  i32.load offset=8
  local.set $6
  global.get $~lib/memory/__stack_pointer
  local.get $6
  i32.store offset=4
  local.get $6
  call $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Direction>
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 125
  i32.store16
  global.get $~lib/json-as/lib/as-bs/bs.offset
  i32.const 2
  i32.add
  global.set $~lib/json-as/lib/as-bs/bs.offset
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Movement> (param $src i32)
  (local $data i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 0
  drop
  i32.const 1
  drop
  global.get $~lib/memory/__stack_pointer
  local.get $src
  local.tee $data
  i32.store
  local.get $data
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store offset=4
  local.get $2
  local.get $data
  call $assembly/test/Movement#__SERIALIZE
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/string/String.UTF16.encode (param $str i32) (result i32)
  (local $buf i32)
  (local $2 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i64.const 0
  i64.store
  global.get $~lib/memory/__stack_pointer
  local.get $str
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  call $~lib/string/String.UTF16.byteLength
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $buf
  i32.store offset=4
  local.get $str
  local.get $str
  local.set $2
  global.get $~lib/memory/__stack_pointer
  local.get $2
  i32.store
  local.get $2
  call $~lib/string/String#get:length
  local.get $buf
  call $~lib/string/String.UTF16.encodeUnsafe
  drop
  local.get $buf
  local.set $2
  global.get $~lib/memory/__stack_pointer
  i32.const 8
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $2
  return
 )
 (func $start:assembly/test
  (local $0 i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  (local $29 i32)
  (local $30 i32)
  (local $31 i32)
  (local $32 i32)
  (local $33 i32)
  (local $34 i32)
  (local $35 i32)
  (local $36 i32)
  (local $37 i32)
  (local $38 i32)
  (local $39 i32)
  (local $40 i32)
  (local $41 i32)
  (local $42 i32)
  (local $43 i32)
  (local $44 i32)
  (local $45 i32)
  (local $46 i32)
  (local $47 i32)
  (local $48 i32)
  (local $49 i32)
  (local $50 i32)
  (local $51 i32)
  (local $52 i32)
  (local $53 i32)
  (local $54 i32)
  (local $55 i32)
  (local $56 i32)
  (local $57 i32)
  (local $58 i32)
  (local $59 i32)
  (local $60 i32)
  (local $61 i32)
  (local $62 i32)
  (local $63 i32)
  (local $64 i32)
  (local $65 i32)
  (local $66 i32)
  (local $67 i32)
  (local $68 i32)
  (local $69 i32)
  (local $70 i32)
  (local $71 i32)
  (local $72 i32)
  (local $73 i32)
  (local $74 i32)
  (local $75 i32)
  (local $76 i32)
  (local $77 i32)
  (local $78 i32)
  (local $79 i32)
  (local $80 i32)
  (local $81 i32)
  (local $82 i32)
  (local $83 i32)
  (local $84 i32)
  (local $85 i32)
  (local $86 i32)
  (local $87 i32)
  (local $88 i32)
  (local $89 i32)
  (local $90 i32)
  (local $91 i32)
  (local $92 i32)
  (local $93 i32)
  (local $94 i32)
  (local $95 i32)
  (local $96 i32)
  (local $97 i32)
  (local $98 i32)
  (local $99 i32)
  (local $100 i32)
  (local $101 i32)
  (local $102 i32)
  (local $103 i32)
  (local $104 i32)
  (local $105 i32)
  (local $106 i32)
  (local $107 i32)
  (local $108 i32)
  (local $109 i32)
  (local $110 i32)
  (local $111 i32)
  (local $112 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 196
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.const 196
  memory.fill
  call $start:~lib/json-as/lib/as-bs
  call $start:~lib/json-as/index
  i32.const 0
  i32.const 1
  i32.const 2
  i32.const 3
  call $assembly/test/Vec3#constructor
  global.set $assembly/test/a1
  i32.const 1824
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  block $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Vec3>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/a1
   local.tee $0
   i32.store offset=12
   i32.const 0
   local.set $1
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $0
   local.tee $2
   i32.store offset=16
   local.get $0
   local.set $3
   i32.const 50
   local.set $4
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $4
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.0 (result i32)
     local.get $4
     local.set $5
     i32.const 1
     i32.const 32
     local.get $5
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.0
    end
    local.set $6
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $6
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $7
    i32.store offset=20
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $7
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $7
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570664606466171
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 10
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $3
   i32.load8_u
   call $~lib/json-as/assembly/index/JSON.__serialize<u8>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570668901433388
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 10
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $3
   i32.load8_u offset=1
   call $~lib/json-as/assembly/index/JSON.__serialize<u8>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570673196400684
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 10
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $3
   i32.load8_u offset=2
   call $~lib/json-as/assembly/index/JSON.__serialize<u8>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 125
   i32.store16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   block $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.0 (result i32)
    global.get $~lib/json-as/lib/as-bs/bs.offset
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    local.set $8
    local.get $8
    i32.const 2
    call $~lib/rt/itcms/__new
    local.set $9
    local.get $9
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    local.get $8
    memory.copy
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.set $~lib/json-as/lib/as-bs/bs.offset
    i32.const 0
    global.set $~lib/json-as/lib/as-bs/bs.stackSize
    local.get $9
    br $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.0
   end
   br $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Vec3>|inlined.0
  end
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  block $assembly/index/FASS.serialize<assembly/test/Vec3>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/a1
   local.tee $10
   i32.store offset=24
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   block $assembly/test/Vec3#__FASS_SIZE|inlined.0 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $10
    local.tee $11
    i32.store offset=28
    i32.const 1
    i32.const 1
    i32.add
    i32.const 1
    i32.add
    br $assembly/test/Vec3#__FASS_SIZE|inlined.0
   end
   call $~lib/arraybuffer/ArrayBuffer#constructor
   local.tee $12
   i32.store offset=32
   global.get $~lib/memory/__stack_pointer
   local.get $10
   local.tee $13
   i32.store offset=36
   local.get $10
   local.set $14
   local.get $12
   local.set $15
   local.get $15
   local.get $14
   i32.load8_u
   i32.store8
   local.get $15
   local.get $14
   i32.load8_u offset=1
   i32.store8 offset=1
   local.get $15
   local.get $14
   i32.load8_u offset=2
   i32.store8 offset=2
   local.get $12
   br $assembly/index/FASS.serialize<assembly/test/Vec3>|inlined.0
  end
  global.set $assembly/test/a2
  i32.const 5456
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  global.get $assembly/test/a2
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=40
  local.get $112
  call $assembly/test/visualise
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  block $assembly/index/FASS.deserialize<assembly/test/Vec3>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/a2
   local.tee $16
   i32.store offset=44
   block $assembly/util/bytes/bytes<~lib/arraybuffer/ArrayBuffer>|inlined.0 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $16
    local.tee $17
    i32.store offset=48
    i32.const 0
    drop
    i32.const 1
    drop
    local.get $17
    i32.const 20
    i32.sub
    call $~lib/rt/common/OBJECT#get:rtSize
    br $assembly/util/bytes/bytes<~lib/arraybuffer/ArrayBuffer>|inlined.0
   end
   local.set $18
   local.get $16
   local.set $19
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   local.set $20
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   i32.const 3
   i32.const 6
   call $~lib/rt/itcms/__new
   local.tee $21
   i32.store offset=52
   block $assembly/test/Vec3#__FASS_INITIALIZE|inlined.0 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $21
    local.tee $22
    i32.store offset=56
    local.get $22
    br $assembly/test/Vec3#__FASS_INITIALIZE|inlined.0
   end
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $21
   local.tee $23
   i32.store offset=60
   local.get $19
   local.set $24
   local.get $21
   local.set $25
   local.get $25
   local.get $24
   i32.load8_u
   i32.store8
   local.get $25
   local.get $24
   i32.load8_u offset=1
   i32.store8 offset=1
   local.get $25
   local.get $24
   i32.load8_u offset=2
   i32.store8 offset=2
   local.get $21
   br $assembly/index/FASS.deserialize<assembly/test/Vec3>|inlined.0
  end
  global.set $assembly/test/a3
  i32.const 6960
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  block $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Vec3>|inlined.1 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/a3
   local.tee $26
   i32.store offset=64
   i32.const 0
   local.set $27
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $26
   local.tee $28
   i32.store offset=68
   local.get $26
   local.set $29
   i32.const 50
   local.set $30
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $30
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.4 (result i32)
     local.get $30
     local.set $31
     i32.const 1
     i32.const 32
     local.get $31
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.4
    end
    local.set $32
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $32
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $33
    i32.store offset=72
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $33
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $33
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570664606466171
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 10
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $29
   i32.load8_u
   call $~lib/json-as/assembly/index/JSON.__serialize<u8>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570668901433388
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 10
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $29
   i32.load8_u offset=1
   call $~lib/json-as/assembly/index/JSON.__serialize<u8>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570673196400684
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 10
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $29
   i32.load8_u offset=2
   call $~lib/json-as/assembly/index/JSON.__serialize<u8>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 125
   i32.store16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   block $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.1 (result i32)
    global.get $~lib/json-as/lib/as-bs/bs.offset
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    local.set $34
    local.get $34
    i32.const 2
    call $~lib/rt/itcms/__new
    local.set $35
    local.get $35
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    local.get $34
    memory.copy
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.set $~lib/json-as/lib/as-bs/bs.offset
    i32.const 0
    global.set $~lib/json-as/lib/as-bs/bs.stackSize
    local.get $35
    br $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.1
   end
   br $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Vec3>|inlined.1
  end
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  i32.const 0
  i32.const 1
  f32.const 1
  i32.const 0
  f32.const 1
  f32.const 2
  f32.const 3
  call $assembly/test/Direction#constructor
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $assembly/test/Movement#constructor
  global.set $assembly/test/b1
  i32.const 6992
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  block $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Movement>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/b1
   local.tee $36
   i32.store offset=76
   i32.const 0
   local.set $37
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $36
   local.tee $38
   i32.store offset=80
   local.get $36
   local.set $39
   i32.const 130
   local.set $40
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $40
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.5 (result i32)
     local.get $40
     local.set $41
     i32.const 1
     i32.const 32
     local.get $41
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.5
    end
    local.set $42
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $42
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $43
    i32.store offset=84
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $43
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $43
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31244190568546427
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28992395054481526
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 3801122
   i32.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 20
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $39
   i32.load8_u
   call $~lib/json-as/assembly/index/JSON.__serialize<bool>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31525691315060780
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570578711511141
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 18
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $39
   f32.load offset=4
   call $~lib/json-as/assembly/index/JSON.__serialize<f32>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 29555302053576748
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 32651522506817650
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570621661839465
   i64.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=24
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 26
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $39
   i32.load offset=8
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Direction>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 125
   i32.store16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   block $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.2 (result i32)
    global.get $~lib/json-as/lib/as-bs/bs.offset
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    local.set $44
    local.get $44
    i32.const 2
    call $~lib/rt/itcms/__new
    local.set $45
    local.get $45
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    local.get $44
    memory.copy
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.set $~lib/json-as/lib/as-bs/bs.offset
    i32.const 0
    global.set $~lib/json-as/lib/as-bs/bs.stackSize
    local.get $45
    br $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.2
   end
   br $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Movement>|inlined.0
  end
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  block $assembly/index/FASS.serialize<assembly/test/Movement>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/b1
   local.tee $46
   i32.store offset=88
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   block $assembly/test/Movement#__FASS_SIZE|inlined.0 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $46
    local.tee $47
    i32.store offset=92
    i32.const 1
    i32.const 4
    i32.add
    i32.const 4
    i32.add
    i32.const 4
    i32.add
    i32.const 4
    i32.add
    br $assembly/test/Movement#__FASS_SIZE|inlined.0
   end
   call $~lib/arraybuffer/ArrayBuffer#constructor
   local.tee $48
   i32.store offset=96
   global.get $~lib/memory/__stack_pointer
   local.get $46
   local.tee $49
   i32.store offset=100
   local.get $46
   local.set $50
   local.get $48
   local.set $51
   local.get $51
   local.get $50
   i32.load8_u
   i32.store8
   local.get $51
   local.get $50
   f32.load offset=4
   f32.store offset=1
   local.get $50
   i32.load offset=8
   local.set $52
   local.get $51
   local.get $52
   f32.load offset=8
   f32.store offset=5
   local.get $51
   local.get $52
   f32.load
   f32.store offset=9
   local.get $51
   local.get $52
   f32.load offset=4
   f32.store offset=13
   local.get $48
   br $assembly/index/FASS.serialize<assembly/test/Movement>|inlined.0
  end
  global.set $assembly/test/b2
  i32.const 7952
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  global.get $assembly/test/b2
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=40
  local.get $112
  call $assembly/test/visualise
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  block $assembly/index/FASS.deserialize<assembly/test/Movement>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/b2
   local.tee $53
   i32.store offset=104
   block $assembly/util/bytes/bytes<~lib/arraybuffer/ArrayBuffer>|inlined.1 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $53
    local.tee $54
    i32.store offset=108
    i32.const 0
    drop
    i32.const 1
    drop
    local.get $54
    i32.const 20
    i32.sub
    call $~lib/rt/common/OBJECT#get:rtSize
    br $assembly/util/bytes/bytes<~lib/arraybuffer/ArrayBuffer>|inlined.1
   end
   local.set $55
   local.get $53
   local.set $56
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   local.set $57
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   i32.const 12
   i32.const 8
   call $~lib/rt/itcms/__new
   local.tee $58
   i32.store offset=112
   block $assembly/test/Movement#__FASS_INITIALIZE|inlined.0 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $58
    local.tee $59
    i32.store offset=116
    local.get $59
    i32.const 12
    i32.const 9
    call $~lib/rt/itcms/__new
    i32.store offset=8
    local.get $59
    br $assembly/test/Movement#__FASS_INITIALIZE|inlined.0
   end
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $58
   local.tee $60
   i32.store offset=120
   local.get $56
   local.set $61
   local.get $58
   local.set $62
   local.get $62
   local.get $61
   i32.load8_u
   i32.store8
   local.get $62
   local.get $61
   f32.load offset=1
   f32.store offset=4
   local.get $62
   i32.load offset=8
   local.set $63
   local.get $63
   local.get $61
   f32.load offset=5
   f32.store offset=8
   local.get $63
   local.get $61
   f32.load offset=9
   f32.store
   local.get $63
   local.get $61
   f32.load offset=13
   f32.store offset=4
   local.get $58
   br $assembly/index/FASS.deserialize<assembly/test/Movement>|inlined.0
  end
  global.set $assembly/test/b3
  i32.const 7984
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  block $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Movement>|inlined.1 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/b3
   local.tee $64
   i32.store offset=124
   i32.const 0
   local.set $65
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $64
   local.tee $66
   i32.store offset=128
   local.get $64
   local.set $67
   i32.const 130
   local.set $68
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $68
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.10 (result i32)
     local.get $68
     local.set $69
     i32.const 1
     i32.const 32
     local.get $69
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.10
    end
    local.set $70
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $70
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $71
    i32.store offset=132
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $71
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $71
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31244190568546427
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28992395054481526
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 3801122
   i32.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 20
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $67
   i32.load8_u
   call $~lib/json-as/assembly/index/JSON.__serialize<bool>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31525691315060780
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570578711511141
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 18
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $67
   f32.load offset=4
   call $~lib/json-as/assembly/index/JSON.__serialize<f32>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 29555302053576748
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 32651522506817650
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 9570621661839465
   i64.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=24
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 26
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $67
   i32.load offset=8
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Direction>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 125
   i32.store16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   block $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.3 (result i32)
    global.get $~lib/json-as/lib/as-bs/bs.offset
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    local.set $72
    local.get $72
    i32.const 2
    call $~lib/rt/itcms/__new
    local.set $73
    local.get $73
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    local.get $72
    memory.copy
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.set $~lib/json-as/lib/as-bs/bs.offset
    i32.const 0
    global.set $~lib/json-as/lib/as-bs/bs.stackSize
    local.get $73
    br $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.3
   end
   br $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Movement>|inlined.1
  end
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  i32.const 0
  i32.const 1
  i32.const 8016
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  i64.const 4531293
  i32.const 0
  i32.const 1
  i32.const 2
  i32.const 3
  call $assembly/test/Vec3#constructor
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  i32.const 0
  i32.const 1
  f32.const 4.210000038146973
  i32.const 0
  f32.const 5.429999828338623
  f32.const -13.199999809265137
  f32.const 19.229999542236328
  call $assembly/test/Direction#constructor
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=40
  local.get $112
  call $assembly/test/Movement#constructor
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $assembly/test/Player#constructor
  global.set $assembly/test/p1
  i32.const 8064
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  block $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Player>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/p1
   local.tee $74
   i32.store offset=136
   i32.const 0
   local.set $75
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $74
   local.tee $76
   i32.store offset=140
   local.get $74
   local.set $77
   i32.const 318
   local.set $78
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $78
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.11 (result i32)
     local.get $78
     local.set $79
     i32.const 1
     i32.const 32
     local.get $79
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.11
    end
    local.set $80
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $80
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $81
    i32.store offset=144
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $81
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $81
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 27866439308411003
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28429479460798580
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 3801122
   i32.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 20
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $77
   i32.load8_u
   call $~lib/json-as/assembly/index/JSON.__serialize<bool>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 27303545189564460
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 16325694684725357
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 16
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $77
   i32.load offset=4
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<~lib/string/String>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28147948644859948
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 3801122
   i32.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 12
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $77
   i64.load offset=8
   call $~lib/json-as/assembly/index/JSON.__serialize<u64>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31244203453448236
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2228339
   i32.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=12
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 14
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $77
   i32.load offset=16
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Vec3>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31244190568546348
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28429440805830774
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 16325694685708398
   i64.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 24
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $77
   i32.load offset=20
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Movement>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 125
   i32.store16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   block $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.4 (result i32)
    global.get $~lib/json-as/lib/as-bs/bs.offset
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    local.set $82
    local.get $82
    i32.const 2
    call $~lib/rt/itcms/__new
    local.set $83
    local.get $83
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    local.get $82
    memory.copy
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.set $~lib/json-as/lib/as-bs/bs.offset
    i32.const 0
    global.set $~lib/json-as/lib/as-bs/bs.stackSize
    local.get $83
    br $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.4
   end
   br $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Player>|inlined.0
  end
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  block $assembly/index/FASS.serialize<assembly/test/Player>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/p1
   local.tee $84
   i32.store offset=148
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   i32.const 0
   block $assembly/test/Player#__FASS_SIZE|inlined.0 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $84
    local.tee $85
    i32.store offset=152
    i32.const 1
    i32.const 8
    i32.add
    i32.const 1
    i32.add
    i32.const 4
    i32.add
    i32.const 4
    i32.add
    i32.const 4
    i32.add
    i32.const 4
    i32.add
    i32.const 1
    i32.add
    i32.const 1
    i32.add
    i32.const 1
    i32.add
    i32.const 26
    i32.add
    br $assembly/test/Player#__FASS_SIZE|inlined.0
   end
   call $~lib/arraybuffer/ArrayBuffer#constructor
   local.tee $86
   i32.store offset=156
   global.get $~lib/memory/__stack_pointer
   local.get $84
   local.tee $87
   i32.store offset=160
   local.get $84
   local.set $88
   local.get $86
   local.set $89
   local.get $89
   local.get $88
   i32.load8_u
   i32.store8
   local.get $89
   local.get $88
   i64.load offset=8
   i64.store offset=1
   local.get $88
   i32.load offset=20
   local.set $90
   local.get $89
   local.get $90
   i32.load8_u
   i32.store8 offset=9
   local.get $89
   local.get $90
   f32.load offset=4
   f32.store offset=10
   local.get $90
   i32.load offset=8
   local.set $90
   local.get $89
   local.get $90
   f32.load offset=8
   f32.store offset=14
   local.get $89
   local.get $90
   f32.load
   f32.store offset=18
   local.get $89
   local.get $90
   f32.load offset=4
   f32.store offset=22
   local.get $88
   i32.load offset=16
   local.set $90
   local.get $89
   local.get $90
   i32.load8_u
   i32.store8 offset=26
   local.get $89
   local.get $90
   i32.load8_u offset=1
   i32.store8 offset=27
   local.get $89
   local.get $90
   i32.load8_u offset=2
   i32.store8 offset=28
   local.get $89
   local.get $88
   i64.load offset=4
   i64.store offset=29
   local.get $89
   local.get $88
   i64.load offset=12
   i64.store offset=37
   local.get $89
   local.get $88
   i64.load offset=20
   i64.store offset=45
   local.get $89
   local.get $88
   i32.load16_u offset=28
   i32.store16 offset=53
   local.get $86
   br $assembly/index/FASS.serialize<assembly/test/Player>|inlined.0
  end
  global.set $assembly/test/p2
  i32.const 8128
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  global.get $assembly/test/p2
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=40
  local.get $112
  call $assembly/test/visualise
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  block $assembly/index/FASS.deserialize<assembly/test/Player>|inlined.0 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/p2
   local.tee $91
   i32.store offset=164
   block $assembly/util/bytes/bytes<~lib/arraybuffer/ArrayBuffer>|inlined.2 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $91
    local.tee $92
    i32.store offset=168
    i32.const 0
    drop
    i32.const 1
    drop
    local.get $92
    i32.const 20
    i32.sub
    call $~lib/rt/common/OBJECT#get:rtSize
    br $assembly/util/bytes/bytes<~lib/arraybuffer/ArrayBuffer>|inlined.2
   end
   local.set $93
   local.get $91
   local.set $94
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   local.set $95
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   i32.const 24
   i32.const 10
   call $~lib/rt/itcms/__new
   local.tee $96
   i32.store offset=172
   block $assembly/test/Player#__FASS_INITIALIZE|inlined.0 (result i32)
    global.get $~lib/memory/__stack_pointer
    local.get $96
    local.tee $97
    i32.store offset=176
    local.get $97
    i32.const 12
    i32.const 8
    call $~lib/rt/itcms/__new
    i32.store offset=20
    local.get $97
    i32.const 12
    i32.const 9
    call $~lib/rt/itcms/__new
    i32.store offset=8
    local.get $97
    i32.const 3
    i32.const 6
    call $~lib/rt/itcms/__new
    i32.store offset=16
    local.get $97
    i32.const 0
    i32.const 2
    call $~lib/rt/itcms/__new
    i32.store offset=4
    local.get $97
    br $assembly/test/Player#__FASS_INITIALIZE|inlined.0
   end
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $96
   local.tee $98
   i32.store offset=180
   local.get $94
   local.set $99
   local.get $96
   local.set $100
   local.get $100
   local.get $99
   i32.load8_u
   i32.store8
   local.get $100
   local.get $99
   i64.load offset=1
   i64.store offset=8
   local.get $100
   i32.load offset=20
   local.set $101
   local.get $101
   local.get $99
   i32.load8_u offset=9
   i32.store8
   local.get $101
   local.get $99
   f32.load offset=10
   f32.store offset=4
   local.get $101
   i32.load offset=8
   local.set $101
   local.get $101
   local.get $99
   f32.load offset=14
   f32.store offset=8
   local.get $101
   local.get $99
   f32.load offset=18
   f32.store
   local.get $101
   local.get $99
   f32.load offset=22
   f32.store offset=4
   local.get $100
   i32.load offset=16
   local.set $101
   local.get $101
   local.get $99
   i32.load8_u offset=26
   i32.store8
   local.get $101
   local.get $99
   i32.load8_u offset=27
   i32.store8 offset=1
   local.get $101
   local.get $99
   i32.load8_u offset=28
   i32.store8 offset=2
   local.get $100
   local.get $99
   i64.load offset=29
   i64.store offset=4
   local.get $100
   local.get $99
   i64.load offset=37
   i64.store offset=12
   local.get $100
   local.get $99
   i64.load offset=45
   i64.store offset=20
   local.get $100
   local.get $99
   i32.load16_u offset=53
   i32.store16 offset=28
   local.get $96
   br $assembly/index/FASS.deserialize<assembly/test/Player>|inlined.0
  end
  global.set $assembly/test/p3
  i32.const 8160
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  block $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Player>|inlined.1 (result i32)
   global.get $~lib/memory/__stack_pointer
   global.get $assembly/test/p3
   local.tee $102
   i32.store offset=184
   i32.const 0
   local.set $103
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 0
   drop
   i32.const 1
   drop
   global.get $~lib/memory/__stack_pointer
   local.get $102
   local.tee $104
   i32.store offset=188
   local.get $102
   local.set $105
   i32.const 318
   local.set $106
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   local.get $106
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.stackSize
   global.get $~lib/json-as/lib/as-bs/bs.bufferSize
   i32.gt_u
   if
    block $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.20 (result i32)
     local.get $106
     local.set $107
     i32.const 1
     i32.const 32
     local.get $107
     i32.const 1
     i32.sub
     i32.clz
     i32.sub
     i32.shl
     br $~lib/json-as/lib/as-bs/nextPowerOf2|inlined.20
    end
    local.set $108
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    local.get $108
    i32.add
    global.set $~lib/json-as/lib/as-bs/bs.bufferSize
    global.get $~lib/memory/__stack_pointer
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.get $~lib/json-as/lib/as-bs/bs.bufferSize
    call $~lib/rt/itcms/__renew
    local.tee $109
    i32.store offset=192
    global.get $~lib/json-as/lib/as-bs/bs.offset
    local.get $109
    i32.add
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    global.set $~lib/json-as/lib/as-bs/bs.offset
    local.get $109
    global.set $~lib/json-as/lib/as-bs/bs.buffer
   end
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 27866439308411003
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28429479460798580
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 3801122
   i32.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 20
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $105
   i32.load8_u
   call $~lib/json-as/assembly/index/JSON.__serialize<bool>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 27303545189564460
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 16325694684725357
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 16
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $105
   i32.load offset=4
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<~lib/string/String>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28147948644859948
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 3801122
   i32.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 12
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $105
   i64.load offset=8
   call $~lib/json-as/assembly/index/JSON.__serialize<u64>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31244203453448236
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2228339
   i32.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 58
   i32.store16 offset=12
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 14
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $105
   i32.load offset=16
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Vec3>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 31244190568546348
   i64.store
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 28429440805830774
   i64.store offset=8
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i64.const 16325694685708398
   i64.store offset=16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 24
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   local.get $105
   i32.load offset=20
   local.set $112
   global.get $~lib/memory/__stack_pointer
   local.get $112
   i32.store offset=40
   local.get $112
   call $~lib/json-as/assembly/index/JSON.__serialize<assembly/test/Movement>
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 125
   i32.store16
   global.get $~lib/json-as/lib/as-bs/bs.offset
   i32.const 2
   i32.add
   global.set $~lib/json-as/lib/as-bs/bs.offset
   block $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.5 (result i32)
    global.get $~lib/json-as/lib/as-bs/bs.offset
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    i32.sub
    local.set $110
    local.get $110
    i32.const 2
    call $~lib/rt/itcms/__new
    local.set $111
    local.get $111
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    local.get $110
    memory.copy
    global.get $~lib/json-as/lib/as-bs/bs.buffer
    global.set $~lib/json-as/lib/as-bs/bs.offset
    i32.const 0
    global.set $~lib/json-as/lib/as-bs/bs.stackSize
    local.get $111
    br $~lib/json-as/lib/as-bs/bs.out<~lib/string/String>|inlined.5
   end
   br $~lib/json-as/assembly/index/JSON.stringify<assembly/test/Player>|inlined.1
  end
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.__concat
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  i32.const 8016
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=8
  local.get $112
  call $~lib/string/String.UTF16.encode
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store offset=4
  local.get $112
  call $assembly/test/visualise
  local.set $112
  global.get $~lib/memory/__stack_pointer
  local.get $112
  i32.store
  local.get $112
  call $~lib/wasi_console/wasi_console.log
  global.get $~lib/memory/__stack_pointer
  i32.const 196
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $"~lib/map/Map<u32,u32>#__visit" (param $this i32) (param $cookie i32)
  (local $entries i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $this
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  call $"~lib/map/Map<u32,u32>#get:buckets"
  local.get $cookie
  call $~lib/rt/itcms/__visit
  local.get $this
  local.set $3
  global.get $~lib/memory/__stack_pointer
  local.get $3
  i32.store
  local.get $3
  call $"~lib/map/Map<u32,u32>#get:entries"
  local.set $entries
  i32.const 0
  drop
  local.get $entries
  local.get $cookie
  call $~lib/rt/itcms/__visit
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
 )
 (func $~lib/arraybuffer/ArrayBuffer#constructor (param $this i32) (param $length i32) (result i32)
  (local $buffer i32)
  (local $3 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $length
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 144
   i32.const 192
   i32.const 52
   i32.const 43
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  global.get $~lib/memory/__stack_pointer
  local.get $length
  i32.const 1
  call $~lib/rt/itcms/__new
  local.tee $buffer
  i32.store
  i32.const 2
  global.get $~lib/shared/runtime/Runtime.Incremental
  i32.ne
  drop
  local.get $buffer
  local.set $3
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $3
  return
 )
 (func $~lib/util/number/utoa32 (param $value i32) (param $radix i32) (result i32)
  (local $out i32)
  (local $decimals i32)
  (local $buffer i32)
  (local $num i32)
  (local $offset i32)
  (local $decimals|7 i32)
  (local $buffer|8 i32)
  (local $num|9 i32)
  (local $offset|10 i32)
  (local $decimals|11 i32)
  (local $12 i32)
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.sub
  global.set $~lib/memory/__stack_pointer
  call $~stack_check
  global.get $~lib/memory/__stack_pointer
  i32.const 0
  i32.store
  local.get $radix
  i32.const 2
  i32.lt_s
  if (result i32)
   i32.const 1
  else
   local.get $radix
   i32.const 36
   i32.gt_s
  end
  if
   i32.const 5584
   i32.const 5712
   i32.const 350
   i32.const 5
   call $~lib/wasi_internal/wasi_abort
   unreachable
  end
  local.get $value
  i32.eqz
  if
   i32.const 5776
   local.set $12
   global.get $~lib/memory/__stack_pointer
   i32.const 4
   i32.add
   global.set $~lib/memory/__stack_pointer
   local.get $12
   return
  end
  local.get $radix
  i32.const 10
  i32.eq
  if
   local.get $value
   call $~lib/util/number/decimalCount32
   local.set $decimals
   global.get $~lib/memory/__stack_pointer
   local.get $decimals
   i32.const 1
   i32.shl
   i32.const 2
   call $~lib/rt/itcms/__new
   local.tee $out
   i32.store
   local.get $out
   local.set $buffer
   local.get $value
   local.set $num
   local.get $decimals
   local.set $offset
   i32.const 0
   i32.const 1
   i32.ge_s
   drop
   local.get $buffer
   local.get $num
   local.get $offset
   call $~lib/util/number/utoa32_dec_lut
  else
   local.get $radix
   i32.const 16
   i32.eq
   if
    i32.const 31
    local.get $value
    i32.clz
    i32.sub
    i32.const 2
    i32.shr_s
    i32.const 1
    i32.add
    local.set $decimals|7
    global.get $~lib/memory/__stack_pointer
    local.get $decimals|7
    i32.const 1
    i32.shl
    i32.const 2
    call $~lib/rt/itcms/__new
    local.tee $out
    i32.store
    local.get $out
    local.set $buffer|8
    local.get $value
    local.set $num|9
    local.get $decimals|7
    local.set $offset|10
    i32.const 0
    i32.const 1
    i32.ge_s
    drop
    local.get $buffer|8
    local.get $num|9
    i64.extend_i32_u
    local.get $offset|10
    call $~lib/util/number/utoa_hex_lut
   else
    local.get $value
    i64.extend_i32_u
    local.get $radix
    call $~lib/util/number/ulog_base
    local.set $decimals|11
    global.get $~lib/memory/__stack_pointer
    local.get $decimals|11
    i32.const 1
    i32.shl
    i32.const 2
    call $~lib/rt/itcms/__new
    local.tee $out
    i32.store
    local.get $out
    local.get $value
    i64.extend_i32_u
    local.get $decimals|11
    local.get $radix
    call $~lib/util/number/utoa64_any_core
   end
  end
  local.get $out
  local.set $12
  global.get $~lib/memory/__stack_pointer
  i32.const 4
  i32.add
  global.set $~lib/memory/__stack_pointer
  local.get $12
  return
 )
)
