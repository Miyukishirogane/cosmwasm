async function getCount() {
    const client = await CosmWasmClient.connect("https://testnet-rpc.orai.io");

    const getCount = await client.query("wasm1fft5ur6puv37ut9pyk5nggy75lf76rnqmwk94s",{ "get_count": {}})
    console.log(getCount);
}
getCount();