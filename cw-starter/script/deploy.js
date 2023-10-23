import * as cosmwasm from "@cosmjs/cosmwasm-stargate";
import { SigningStargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { stringToPath } from "@cosmjs/crypto";
import * as dotenv from "dotenv";
import { Decimal } from "@cosmjs/math";
import { GasPrice } from "@cosmjs/stargate";
dotenv.config();
const prefix = process.env.PREFIX || "orai";
  const denom = process.env.DENOM || "orai";

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
    process.env.mnemonic,
    {
      hdPaths: [stringToPath(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
      prefix,
    }
  );