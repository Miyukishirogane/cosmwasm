//@ts-nocheck
import { SigningCosmWasmClient, Secp256k1HdWallet, setupWebKeplr, coin, UploadResult, InstantiateResult, toBinary } from "cosmwasm";
import { CosmWasmClient } from "cosmwasm";
import * as dotenv from "dotenv";
import { Decimal } from "@cosmjs/math";
import axios from 'axios';
import * as fs from "fs";
import { BigNumber } from 'bignumber.js';

// import MerkleTree from "fixed-merkle-tree";
// import { buildMimc7 } from "circomlibjs";

dotenv.config();
// This is your rpc endpoint
const getTxAPI = "https://testnet-lcd.orai.io/cosmos/"

const rpcEndpoint = "https://testnet-rpc.orai.io:443/";
const chainID = "Oraichain-testnet"
const mnemonic = process.env.MNEMONIC!;

let mimc;
let F;
let tree;

function hexToDecimal(hex: string): string {
    // Remove the '0x' prefix if present
    if (hex.startsWith('0x')) {
        hex = hex.slice(2);
    }

    // Convert the hexadecimal string to a decimal string
    const decimalString = BigInt(`0x${hex}`).toString();

    return decimalString;
}

function writeToEnvFile(key: String, value: String) {
    const envFilePath = '.env';
    const envString = `${key}=${value}`;

    try {
        if (fs.existsSync(envFilePath)) {
            let data = fs.readFileSync(envFilePath, 'utf8');
            const lines = data.trim().split('\n');
            let keyExists = false;
            const updatedLines = lines.map(line => {
                const [existingKey] = line.split('=');
                if (existingKey === key) {
                    keyExists = true;
                    return envString;
                }
                return line;
            });
            if (!keyExists) {
                updatedLines.push(envString);
            }
            const updatedData = updatedLines.join('\n');
            fs.writeFileSync(envFilePath, updatedData + '\n');
        } else {
            fs.writeFileSync(envFilePath, envString + '\n');
        }
        console.log('Successfully wrote to .env file.');
    } catch (err) {
        console.error('Error writing to .env file:', err);
    }
}

function saveUpdateDepositTreeTxToJsonFile(path: string, data: any) {
   
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(path, jsonData, 'utf-8');
    console.log('Data has been saved to file:', path);
}

function ReadFile(path: string): Uint8Array {
    var file = fs.readFileSync(path);
    var buffer = new Uint8Array(file);
    return buffer
}

function ReadJsonFile(path: string): Record<string, any> {

    const jsonData = fs.readFileSync(path, 'utf-8');
    const parsedData: Record<string, any> = JSON.parse(jsonData);
    return parsedData;
}

async function getWallet(): Promise<Secp256k1HdWallet> {
    const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, { prefix: "orai" });
    return wallet;
}
async function getClient(): Promise<SigningCosmWasmClient> {
    // Create a wallet
    const wallet = await getWallet();

    // Using
    const client = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        wallet,
        {
            gasPrice: {
                denom: "orai",
                amount: Decimal.fromUserInput("0.001", 6)
            }
        }
    );

    return client;
}
  async function CreatePoll() {
   
    const wallet = await getWallet();
    const client = await getClient();

    const senderAddress = (await wallet.getAccounts())[0].address;
    const contractAddress = process.env.CONTRACT_NAME1|| "";
    const msg = {
        create_poll: {
            poll_id: process.env.CONTRACT,
            question:"Dam ba cai rust de vl",
            options:[ "Cosmos Hub","Juno","Osmosis"],
    },
}
    console.log("msg", msg);
    const fee = "auto"
    const memo: any = null
    const res = await client.execute(senderAddress, contractAddress, msg, fee, memo)
    console.log(res)
    return res;
}
async function Vote() {
   
    const wallet = await getWallet();
    const client = await getClient();

    const senderAddress = (await wallet.getAccounts())[0].address;
    const contractAddress = process.env.CONTRACT_NAME1 || "";
    const msg = {
        vote: {
            poll_id: process.env.CONTRACT,
            vote: "Juno",
    },
}
    console.log("msg", msg);
    const fee = "auto"
    const memo: any = null
    const res = await client.execute(senderAddress, contractAddress, msg, fee, memo)
    console.log(res)
    return res;
}
async function QueryPoll() {
    // const query = await client.getTx("2D925C0F81EF1E26662B0A2A9277180CE853F9F07C60CA2F3E64E7F565A19F78")
    const client = await getClient();

    const contract_address = process.env.CONTRACT_NAME1 || "";
    const query_message = {
        poll: {
            poll_id: process.env.CONTRACT,
        }
    }
    const res = await client.queryContractSmart(contract_address, query_message)
    return res
}

async function QueryVote() {
    // const query = await client.getTx("2D925C0F81EF1E26662B0A2A9277180CE853F9F07C60CA2F3E64E7F565A19F78")
    const client = await getClient();

    const contract_address = process.env.CONTRACT_NAME1 || "";
    const query_message = {
        vote: {
            address: process.env.CONTRACT,
            poll_id: process.env.CONTRACT,
        }
    }
    const res = await client.queryContractSmart(contract_address, query_message)
    return res
}
async function QueryAll() {
    // const query = await client.getTx("2D925C0F81EF1E26662B0A2A9277180CE853F9F07C60CA2F3E64E7F565A19F78")
    const client = await getClient();

    const contract_address = process.env.CONTRACT_NAME1 || "";
    const query_message = {
        all_polls: {
          
        }
    }
    const res = await client.queryContractSmart(contract_address, query_message)
    return res
}

async function main() {
    // const resUpload = await Upload("./artifacts/cw_starter.wasm");
    // const resInitiate = await instantiate(resUpload.codeId);
    // writeToEnvFile("CONTRACT", resInitiate.contractAddress)

    // const resCreatePoll = await CreatePoll();
    // console.log(resCreatePoll);

    // const resVote = await Vote();
    // console.log(resVote);

    // const resQueryPoll = await QueryPoll();
    // console.log(resQueryPoll);
    const resQueryVote = await QueryVote();
    console.log(resQueryVote);
    // const resQueryAll = await QueryAll();
    // console.log(resQueryAll);
    // const resSendToken1 = await sendToken("10");
    // console.log("sendtoken 1", resSendToken1)

    // const resSendToken2 = await sendToken("10");
    // console.log("sendtoken 2", resSendToken2)

    // const resDepositTree = await QueryDepositTree();
    // console.log("depositTree", resDepositTree);
    // saveJsonData("./scripts/proofDepositTree/deposit_tree.json", resDepositTree);
    // const resDepositQueue = await QueryDepositQueue();
    // console.log(resDepositQueue);
    // for(let i = 0; i < resDepositQueue.length; i++) {
    //     saveJsonData("./scripts/proofDepositTree/deposit"+ i + ".json", resDepositQueue[i])
    // }

    // const resUpdate = await updateDepositTree();
    // console.log(resUpdate);
    // writeToEnvFile("TX_HASH", resUpdate.transactionHash)

    // const resQueryDepositRootTx = await QueryTxByHash(resUpdate.transactionHash);
    // console.log(resQueryDepositRootTx);
    // saveUpdateDepositTreeTxToJsonFile("./scripts/proofDepositTree/tx_data.json", resQueryDepositRootTx.tx);
    // const resQueryBlock = await QueryBlockHeaderByHeight(resQueryDepositRootTx.height);
    // saveUpdateDepositTreeTxToJsonFile("./scripts/proofDepositTree/block.json", resQueryBlock);
    // console.log(resQueryBlock)
}
main();