import { Output, array, object } from "valibot";
import { aucSchema, bidSchema } from "./bid";

export const bdaEndpointInputSchema = object({
  auction: aucSchema,
  bids: array(bidSchema),
});

export type bdaEndpointInputType = Output<typeof bdaEndpointInputSchema>;
