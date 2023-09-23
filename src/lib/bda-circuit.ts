import path from "path";
import { groth16 } from "snarkjs";
import { bdaInputType } from "~/schemas/bda-circuit";

const CIRCUIT_WASM_PATH = path.join(
  process.cwd(),
  "/assets/bda/blindDutchAuction.wasm"
);
const CIRCUIT_ZKEY_PATH = path.join(
  process.cwd(),
  "/assets/bda/circuit_final.zkey"
);
export async function runBlindDutchAuction(input: bdaInputType) {
  try {
    const { publicSignals, proof } = await groth16.fullProve(
      { ...input },
      CIRCUIT_WASM_PATH,
      CIRCUIT_ZKEY_PATH
    );

    return {
      publicSignals,
      proof,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.log(JSON.stringify(e, null, 2));
      throw new Error("Circuit failed! Logged on server.");
    }
    throw new Error("Circuit failed with unknown reason.");
  }
}
