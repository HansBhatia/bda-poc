import { Output, object, string } from "valibot";

export const bidSchema = object({
  uid: string(), //number([integer()]),
  aucId: string(), //number([integer()]),
  salt: string(), //number([integer()]), //bigint(),
  bidPrice: string(), //number([integer(), minValue(0), maxValue(10000)]),
  bidAmount: string(), //number([integer()]), // change to big int
});

export const bidInputSchema = object({
  uid: string(), //number([integer()]),
  hash: string(), //number([integer()]),
  salt: string(), //number([integer()]), //bigint(),
  bidPrice: string(), //number([integer(), minValue(0), maxValue(10000)]),
  bidAmount: string(), //number([integer()]), // change to big int
});

export const aucSchema = object({
  loanAmount: string(),
  reservePrice: string(),
  minFill: string(),
  aucId: string(),
});

export type aucType = Output<typeof aucSchema>;

export type bidType = Output<typeof bidSchema>;

export type bidInputType = Output<typeof bidInputSchema>;
