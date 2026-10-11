#include "rows_generated.h"
#include "rows.pb.h"
#include <simdjson.h>
#include <fstream>
#include <chrono>
#include <iostream>
#include <vector>
#include <algorithm>
#include <cstdint>
using Bytes=std::vector<uint8_t>;
Bytes load(const std::string&path){std::ifstream f(path,std::ios::binary);if(!f)throw std::runtime_error(path);return Bytes(std::istreambuf_iterator<char>(f),{});}
uint64_t flat(const Bytes&b){auto root=Bench::GetRows(b.data());uint64_t sum=0;for(auto row:*root->rows()){auto name=row->name();sum+=(uint64_t)row->id()+row->x()+row->y()+row->z()+name->size()+(name->size()?(uint8_t)name->c_str()[0]:0);}return sum;}
uint64_t protoSum(const Rows&r){uint64_t sum=0;for(auto&row:r.rows()){const auto&name=row.name();sum+=(uint64_t)row.id()+row.x()+row.y()+row.z()+name.size()+(name.size()?(uint8_t)name[0]:0);}return sum;}
uint64_t proto(const Bytes&b){Rows r;if(!r.ParseFromArray(b.data(),b.size()))throw std::runtime_error("parse");return protoSum(r);}
uint64_t protoReuse(const Bytes&b){static Rows r;if(!r.ParseFromArray(b.data(),b.size()))throw std::runtime_error("parse");return protoSum(r);}
int main(int argc,char**argv){size_t iterations=argc>1?std::stoul(argv[1]):20000;std::vector<Bytes> fb,pb;std::vector<simdjson::padded_string> json;for(int i=0;i<16;i++){auto prefix=std::string(".bench-build/fixtures/");fb.push_back(load(prefix+"flat-"+std::to_string(i)+".bin"));pb.push_back(load(prefix+"proto-"+std::to_string(i)+".bin"));auto b=load(prefix+"json-"+std::to_string(i)+".bin");json.emplace_back(reinterpret_cast<char*>(b.data()),b.size());}
 simdjson::ondemand::parser parser;
 auto js=[&](size_t i){uint64_t sum=0;auto doc=parser.iterate(json[i]);for(auto row:doc["rows"].get_array()){uint64_t id=row["id"].get_uint64(),x=row["x"].get_uint64(),y=row["y"].get_uint64(),z=row["z"].get_uint64();std::string_view name=row["name"].get_string();sum+=id+x+y+z+name.size()+(name.empty()?0:(uint8_t)name[0]);}return sum;};
 for(int i=0;i<16;i++)if(flat(fb[i])!=proto(pb[i])||flat(fb[i])!=js(i))throw std::runtime_error("checksum mismatch");
 std::cout<<"{";bool comma=false;volatile uint64_t sink=0;
 auto bench=[&](const char*name,auto fn){std::vector<double>times;uint64_t total=0;for(size_t j=0;j<2000;j++)total+=fn(j%16);for(int s=0;s<9;s++){auto start=std::chrono::steady_clock::now();for(size_t i=0;i<iterations;i++){asm volatile("" ::: "memory");total+=fn(i%16);}auto end=std::chrono::steady_clock::now();times.push_back(std::chrono::duration<double,std::nano>(end-start).count()/iterations);}sink=total;if(comma)std::cout<<",";comma=true;std::cout<<"\""<<name<<"\":{\"samples\":[";for(size_t i=0;i<times.size();i++){if(i)std::cout<<",";std::cout<<times[i];}std::sort(times.begin(),times.end());std::cout<<"],\"median\":"<<times[4]<<",\"checksum\":"<<total<<"}";};
 bench("C++ FlatBuffers unchecked",[&](size_t i){return flat(fb[i]);});bench("C++ Protobuf fresh",[&](size_t i){return proto(pb[i]);});bench("C++ Protobuf reused",[&](size_t i){return protoReuse(pb[i]);});bench("C++ simdjson ondemand",js);std::cout<<"}\n";
}
