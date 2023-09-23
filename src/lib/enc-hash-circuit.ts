import path from "path";
import { groth16 } from "snarkjs";
import { string } from "valibot";
import { bidType } from "~/schemas/bid";

const CIRCUIT_WASM_PATH = path.join(
  process.cwd(),
  "/assets/encHash/encodeHash.wasm"
);
const CIRCUIT_ZKEY_PATH = path.join(
  process.cwd(),
  "/assets/encHash/circuit_final.zkey"
);
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
