import { groth16 } from "snarkjs";
import { string } from "valibot";
import { bidType } from "~/schemas/bid";

const CIRCUIT_WASM_PATH = "src/assets/encodeHash.wasm";
const CIRCUIT_ZKEY_PATH = "src/assets/circuit_final.zkey";
export async function encHash(input: bidType) {
  const { publicSignals } = await groth16.fullProve(
    { ...input },
    CIRCUIT_WASM_PATH,
    CIRCUIT_ZKEY_PATH
  );

  const hashOutput = string()._parse(publicSignals[0]);
  if (!hashOutput.output) {
    throw new Error("error getting hash");
  }
  return hashOutput.output;
}
