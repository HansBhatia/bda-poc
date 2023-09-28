import { assert } from "console";
import { bdaInputType } from "~/schemas/bda-circuit";
import { aucType, bidType } from "~/schemas/bid";

function fillWithZeros(input: Array<string>, desiredLength: number) {
  const remaining = desiredLength - input.length;
  const addArray = Array(remaining).fill("0");
  return input.concat(addArray);
}

// run circom type division of a/b where decimals are chopped and not rounded
function divideChop(a: number, b: number, decs: number) {
  return Math.trunc((a / b) * 10 ** decs);
}

export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

// returns circom circuit inputs
export function blindDutchAuction({
  auction,
  bids,
  maxSize = 20,
  decs = 10,
}: {
  auction: aucType;
  bids: bidType[];
  maxSize: number;
  decs: number;
}): bdaInputType {
  assert(bids.length > 0, "not enough bids");

  const maxLoanAmount = parseInt(auction.loanAmount);
  const minLoanAmount = Math.floor(
    (parseInt(auction.loanAmount) * parseInt(auction.minFill)) / 100
  );
  // sort the bids array
  bids.sort((a, b) => parseInt(b.bidPrice) - parseInt(a.bidPrice));

  const validBids = bids.filter(
    (bidObject) => bidObject.bidPrice >= auction.reservePrice
  );
  if (validBids.length === 0) {
    throw new Error("Auction failed - No valid bids found");
  }
  const validBidAmountTotalSum = validBids.reduce(
    (sum, current) => sum + parseInt(current.bidAmount),
    0
  );

  if (validBidAmountTotalSum < minLoanAmount) {
    throw new Error(
      `Auction failed - Total valid bit amounts too low. Required:${minLoanAmount} | Actual: ${validBidAmountTotalSum}`
    );
  }

  // get threshold index
  let thresholdIndex: number = 0;

  if (validBidAmountTotalSum < maxLoanAmount)
    thresholdIndex = validBids.length - 1;
  else {
    let currentSum = 0;
    for (let i = 0; i < validBids.length; ++i) {
      currentSum += parseInt(validBids[i].bidAmount);
      if (currentSum >= maxLoanAmount) {
        thresholdIndex = i;
        break;
      }
    }
  }

  // get threshold price
  const thresholdPrice = parseInt(validBids[thresholdIndex].bidPrice);

  // get prorata allocation ratio
  const validBidAmountSumAboveThreshold = validBids.reduce(
    (sum, current) =>
      parseInt(current.bidPrice) > thresholdPrice
        ? sum + parseInt(current.bidAmount)
        : sum,
    0
  );
  const validBidAmountSumAtThreshold = validBids.reduce(
    (sum, current) =>
      parseInt(current.bidPrice) === thresholdPrice
        ? sum + parseInt(current.bidAmount)
        : sum,
    0
  );
  const proRataAllocationRatio = Math.min(
    divideChop(
      maxLoanAmount - validBidAmountSumAboveThreshold,
      validBidAmountSumAtThreshold,
      decs
    ),
    10 ** decs
  );

  // calculate settle amounts
  const settleAmounts = bids.map((bid) => {
    const bidPrice = parseInt(bid.bidPrice);
    if (bidPrice > thresholdPrice) {
      return bid.bidAmount;
    } else if (bidPrice === thresholdPrice) {
      return Math.trunc(
        divideChop(
          parseInt(bid.bidAmount) * proRataAllocationRatio,
          10 ** decs,
          0
        )
      ).toString();
    } else {
      return "0";
    }
  });

  const bidAmounts = bids.map((b) => b.bidAmount);
  const bidPrices = bids.map((b) => b.bidPrice);
  const salts = bids.map((b) => b.salt);
  const uids = bids.map((b) => b.uid);

  const shuffledBids = shuffle(bids);
  const shuffledBidAmounts = shuffledBids.map((b) => b.bidAmount);
  const shuffledBidPrices = shuffledBids.map((b) => b.bidPrice);
  const shuffledSalts = shuffledBids.map((b) => b.salt);
  const shuffledUids = shuffledBids.map((b) => b.uid);

  return {
    activations: fillWithZeros(Array(validBids.length).fill("1"), maxSize),
    bidAmounts: fillWithZeros(shuffledBidAmounts, maxSize),
    bidPrices: fillWithZeros(shuffledBidPrices, maxSize),
    salt: fillWithZeros(shuffledSalts, maxSize),
    uid: fillWithZeros(shuffledUids, maxSize),
    sortedUid: fillWithZeros(uids, maxSize),
    sortedSalt: fillWithZeros(salts, maxSize),
    sortedBidAmounts: fillWithZeros(bidAmounts, maxSize),
    sortedBidPrices: fillWithZeros(bidPrices, maxSize),
    aucId: auction.aucId,
    minLoanAmount: minLoanAmount.toString(),
    maxLoanAmount: maxLoanAmount.toString(),
    proRataAllocationRatio: proRataAllocationRatio.toString(),
    reservePrice: auction.reservePrice,
    settleAmounts: fillWithZeros(settleAmounts, maxSize),
    thresholdIndex: thresholdIndex.toString(),
  };
}
