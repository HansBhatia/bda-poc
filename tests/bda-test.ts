import { blindDutchAuction } from "~/lib/blind-dutch-auction";

const bdaResults = blindDutchAuction({
  auction: {
    aucId: "1",
    loanAmount: "300000000",
    minFill: "80",
    reservePrice: "9900",
  },
  bids: [
    {
      bidAmount: "32062442",
      bidPrice: "9997",
      aucId: "1",
      salt: "32062442",
      uid: "32062442",
    },
    {
      bidAmount: "62442166",
      bidPrice: "9982",
      aucId: "1",
      salt: "62442166",
      uid: "62442166",
    },
    {
      bidAmount: "153045530",
      bidPrice: "9950",
      aucId: "1",
      salt: "153045530",
      uid: "153045530",
    },
    {
      bidAmount: "55000000",
      bidPrice: "9932",
      aucId: "1",
      salt: "55000000",
      uid: "55000000",
    },
    {
      bidAmount: "78449012",
      bidPrice: "9932",
      aucId: "1",
      salt: "78449012",
      uid: "78449012",
    },
    {
      bidAmount: "20106841",
      bidPrice: "9932",
      aucId: "1",
      salt: "20106841",
      uid: "20106841",
    },
  ],
  maxSize: 20,
  decs: 10,
});

console.log("bdaResults", bdaResults);
