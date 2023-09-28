"use client";
import { useRef, useState } from "react";
import BidInput from "~/components/bidInput";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";
import { aucType, bidInputType } from "~/schemas/bid";

export default function Home() {
  const numberInputs = 5;
  const [aucValues, setAucValues] = useState<aucType>({
    aucId: "1",
    loanAmount: "2000000",
    minFill: "0",
    reservePrice: "9000",
  });
  const [processedAuc, setProcessedAuc] = useState("");
  const [processing, setProcessing] = useState(false);

  const bidValues = useRef<bidInputType[]>(
    Array(numberInputs).fill({
      userId: "",
      salt: "",
      bidPrice: "",
      bidAmount: "",
      hash: "",
    })
  );

  const onChangeAucVal = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProcessedAuc("");
    setAucValues({
      ...aucValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuction = async () => {
    setProcessedAuc("");
    setProcessing(true);
    try {
      // check if there are any empty string values
      const isEmptyAucValues = Object.values(aucValues).some((x) => x === "");
      isEmptyAucValues ? alert("Auction values contains empty value.") : null;
      const isEmptyBidValues = bidValues.current
        .map((obj) => Object.values(obj).some((x) => x === ""))
        .some((x) => x);
      isEmptyBidValues ? alert("Bid values contains empty value.") : null;

      // start auction
      const response = await fetch("/api/bda", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auction: aucValues,
          bids: bidValues.current.map((x) => {
            return {
              ...x,
              aucId: aucValues.aucId,
            };
          }),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setProcessing(false);
        setProcessedAuc(JSON.stringify(data, null, 2));
      } else {
        const errorText = await response.text();
        setProcessing(false);
        setProcessedAuc(errorText);
        console.error(errorText);
      }
    } catch {
      setProcessing(false);
      setProcessedAuc("Error retrieving results. Check console?");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-[80%] mx-auto overflow-hidden">
      <Separator className="h-10" />
      <h1 className="text-xl text-center">Auction Config</h1>
      <div className="grid grid-cols-4 gap-6">
        <div className="flex flex-col">
          <h2>Loan Amount</h2>
          <Input
            name="loanAmount"
            onChange={onChangeAucVal}
            value={aucValues.loanAmount}
          />
          <p>
            This is the loan amount expressed in units of the desired currency.
            No decimals.
          </p>
        </div>
        <div className="flex flex-col">
          <h2>Reserve Price</h2>
          <Input
            name="reservePrice"
            onChange={onChangeAucVal}
            value={aucValues.reservePrice}
          />
          <p>
            This is the reserve price expressed as a percentage between 0 and
            10000.
          </p>
        </div>
        <div className="flex flex-col">
          <h2>Minfill</h2>
          <Input
            name="minFill"
            onChange={onChangeAucVal}
            value={aucValues.minFill}
          />
          <p>
            This is the minfill ratio expressed as a percentage between 0 and
            100.
          </p>
        </div>
        <div className="flex flex-col">
          <h2>Auction Id</h2>
          <Input
            name="aucId"
            value={aucValues.aucId}
            onChange={onChangeAucVal}
          />
          <p>The id of the auction.</p>
        </div>
      </div>
      <Separator className="h-10" />
      <h1 className="text-xl text-center">Bids Config</h1>
      <BidInput
        numberInputs={numberInputs}
        sendValues={bidValues}
        aucId={aucValues.aucId}
      />
      <Separator className="h-5" />
      <Button
        variant="outline"
        className="bg-black text-white"
        onClick={handleAuction}
        disabled={processing}
      >
        Run Auction
      </Button>
      {processing ? (
        <>
          <Separator className="h-5" />
          <div className="text-xl text-bold">Processing...</div>
        </>
      ) : null}
      {processedAuc !== "" && (
        <>
          <Separator className="h-5" />
          <h1 className="text-xl text-bold">Auction Results...</h1>
          <pre>{processedAuc}</pre>
        </>
      )}
    </div>
  );
}
