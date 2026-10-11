#[allow(dead_code, unused_imports)]
#[path = "../../rows_generated.rs"]
mod generated;
use prost::Message;
use serde::Deserialize;
use std::{fs, hint::black_box, time::Instant};
#[derive(Clone, PartialEq, Message, Deserialize)]
struct Row {
    #[prost(uint32, tag = "1")]
    id: u32,
    #[prost(uint32, tag = "2")]
    x: u32,
    #[prost(uint32, tag = "3")]
    y: u32,
    #[prost(uint32, tag = "4")]
    z: u32,
    #[prost(string, tag = "5")]
    name: String,
}
#[derive(Clone, PartialEq, Message, Deserialize)]
struct Rows {
    #[prost(message, repeated, tag = "1")]
    rows: Vec<Row>,
}
fn sum(v: Rows) -> u64 {
    v.rows
        .iter()
        .map(|r| {
            r.id as u64
                + r.x as u64
                + r.y as u64
                + r.z as u64
                + r.name.len() as u64
                + r.name.as_bytes().first().copied().unwrap_or(0) as u64
        })
        .sum()
}
fn flat(b: &[u8], checked: bool) -> u64 {
    let r = if checked {
        generated::bench::root_as_rows(b).unwrap()
    } else {
        unsafe { generated::bench::root_as_rows_unchecked(b) }
    };
    r.rows()
        .unwrap()
        .iter()
        .map(|r| {
            let n = r.name().unwrap();
            r.id() as u64
                + r.x() as u64
                + r.y() as u64
                + r.z() as u64
                + n.len() as u64
                + n.as_bytes().first().copied().unwrap_or(0) as u64
        })
        .sum()
}
fn main() {
    let iterations = std::env::args()
        .nth(1)
        .map(|s| s.parse::<usize>().unwrap())
        .unwrap_or(20000);
    let mut methods: Vec<(&str, Box<dyn Fn(&[u8]) -> u64>, Vec<Vec<u8>>)> = Vec::new();
    for (name, format, fun) in [
        (
            "Rust FlatBuffers unchecked",
            "flat",
            Box::new(|b: &[u8]| flat(b, false)) as Box<dyn Fn(&[u8]) -> u64>,
        ),
        (
            "Rust FlatBuffers verified",
            "flat",
            Box::new(|b: &[u8]| flat(b, true)),
        ),
        (
            "Rust prost",
            "proto",
            Box::new(|b: &[u8]| sum(Rows::decode(b).unwrap())),
        ),
        (
            "Rust rmp-serde",
            "msg",
            Box::new(|b: &[u8]| sum(rmp_serde::from_slice(b).unwrap())),
        ),
        (
            "Rust serde_json",
            "json",
            Box::new(|b: &[u8]| sum(serde_json::from_slice(b).unwrap())),
        ),
    ] {
        let data = (0..16)
            .map(|i| fs::read(format!(".bench-build/fixtures/{format}-{i}.bin")).unwrap())
            .collect();
        methods.push((name, fun, data));
    }
    let expected: Vec<u64> =
        serde_json::from_slice(&fs::read(".bench-build/fixtures/checksums.json").unwrap()).unwrap();
    for (_, fun, data) in &methods {
        for i in 0..16 {
            assert_eq!(fun(&data[i]), expected[i]);
        }
    }
    let mut report = serde_json::Map::new();
    for (name, fun, data) in &methods {
        let mut checksum = 0;
        for i in 0..2000 {
            checksum += black_box(fun(black_box(&data[i % 16])));
        }
        let mut samples = Vec::new();
        for _ in 0..9 {
            let start = Instant::now();
            for i in 0..iterations {
                checksum += black_box(fun(black_box(&data[i % 16])));
            }
            samples.push(start.elapsed().as_nanos() as f64 / iterations as f64);
        }
        let mut sorted = samples.clone();
        sorted.sort_by(|a, b| a.total_cmp(b));
        report.insert(
            name.to_string(),
            serde_json::json!({"median":sorted[4],"samples":samples,"checksum":checksum}),
        );
        black_box(checksum);
    }
    println!("{}", serde_json::Value::Object(report));
}
