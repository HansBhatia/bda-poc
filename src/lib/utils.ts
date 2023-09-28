import { object, string } from "valibot";
import { bidType } from "~/schemas/bid";

export async function getHash(values: bidType) {
  const response = await fetch("/api/hash?" + new URLSearchParams(values), {
    method: "GET",
  });
  const hash = object({ hash: string() })._parse(await response.json()).output
    ?.hash;
  if (!hash) {
    throw new Error("undefined hash");
  }
  return hash;
}
