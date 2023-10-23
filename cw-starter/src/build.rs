use serde_derive::Deserialize;
use std::collections::HashMap;
use std::fs::File;
use std::io::Read;
use std::env;
use std::process::Command;

mod arg_parse;

#[derive(Deserialize, Debug)]
struct Config {
    package: Package
}

#[derive(Deserialize, Debug)]
struct Package {
    metadata: Metadata
}

#[derive(Deserialize, Debug)]
struct Metadata {
    scripts: HashMap<String, String>
}

fn main() {
    let mut f = File::open("Cargo.toml").expect("Cargo.toml file not found.");

    let mut toml = String::new();
    f.read_to_string(&mut toml)
        .expect("Failed to read Cargo.toml.");

    let table : Config = toml::from_str(&toml)
        .expect("Expected Cargo.toml to contain package.metadata.scripts table.");

    let args = arg_parse::parse(env::args().collect());
}