import { NextApiRequest, NextApiResponse } from "next";
import { encHash } from "~/lib/encHash";
import { bidSchema } from "~/schemas/bid";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).send("Method not supported.");
    return;
  }
  console.log("req.query", req.query);

  const input = bidSchema._parse(req.query);
  if (!input.output) {
    console.log("issues", input.issues);
    res.status(400).send("Invalid input type.");
    return;
  }
  // const input: bidType = {
  //   uid: "1234567890", // 10
  //   aucId: "1234567890", // 10
  //   salt: "1234", // 32
  //   bidPrice: "1234567890", // 10
  //   bidAmount: "123456789012", // 12
  // };

  const hash = await encHash(input.output);
  res.status(200).json({ hash });
}
