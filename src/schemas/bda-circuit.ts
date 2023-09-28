import { Output, array, object, string } from "valibot";

export const bdaInputSchema = object({
  aucId: string(),
  thresholdIndex: string(),
  minLoanAmount: string(),
  maxLoanAmount: string(),
  proRataAllocationRatio: string(),
  reservePrice: string(),
  uid: array(string()),
  salt: array(string()),
  bidAmounts: array(string()),
  bidPrices: array(string()),
  sortedUid: array(string()),
  sortedSalt: array(string()),
  sortedBidAmounts: array(string()),
  sortedBidPrices: array(string()),
  activations: array(string()),
  settleAmounts: array(string()),
});

export type bdaInputType = Output<typeof bdaInputSchema>;
