
const fs = require("fs");
const swasm = fs.readFileSync("./target/wasm32-unknown-unknown/release/cw_starter.wasm","utf-8");
console.log(swasm);
    