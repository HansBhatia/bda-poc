import { NextApiRequest, NextApiResponse } from "next";
import { runBlindDutchAuction } from "~/lib/bda-circuit";
import { blindDutchAuction } from "~/lib/blind-dutch-auction";
import { bdaEndpointInputSchema } from "~/schemas/api";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not supported.");
    return;
  }

  const input = bdaEndpointInputSchema._parse(req.body);
  if (!input.output) {
    console.log(JSON.stringify(input.issues, null, 2));
    res.status(400).send("Invalid input type.");
    return;
  }
  if (input.output.bids.length > 20) {
    res.status(400).send("Too many bids.");
    return;
  }
  try {
    const bdaResults = blindDutchAuction({
      ...input.output,
      decs: 10,
      maxSize: 10,
    });
    const bdaCicuitResults = await runBlindDutchAuction(bdaResults);
    res
      .status(200)
      .json({ aucResults: bdaResults, aucCircuitResults: bdaCicuitResults });
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send(`Error: ${e.message}`);
    } else {
      res.status(400).send("An unknown error has occured.");
    }
  }
}
