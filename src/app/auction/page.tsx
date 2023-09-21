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
    loanAmount: "",
    minFill: "",
    reservePrice: "",
  });

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
    setAucValues({
      ...aucValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuction = () => {
    console.log("aucValues auc", aucValues);
    console.log("bidValues auc", bidValues.current);
  };

  return (
    <div className="flex flex-col items-center">
      <Separator className="h-10" />
      <h1 className="text-xl text-center">Auction Config</h1>
      <div className="flex shrink-1 gap-6 justify-center">
        <div className="flex flex-col">
          <p>Loan Amount</p>
          <Input
            name="loanAmount"
            onChange={onChangeAucVal}
            value={aucValues.loanAmount}
          />
        </div>
        <div className="flex flex-col">
          <p>Reserve Price</p>
          <Input
            name="reservePrice"
            onChange={onChangeAucVal}
            value={aucValues.reservePrice}
          />
        </div>
        <div className="flex flex-col">
          <p>Minfill</p>
          <Input
            name="minFill"
            onChange={onChangeAucVal}
            value={aucValues.minFill}
          />
        </div>
        <div className="flex flex-col">
          <p>Auction Id</p>
          <Input
            name="aucId"
            value={aucValues.aucId}
            onChange={onChangeAucVal}
          />
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
      >
        Run Auction
      </Button>
    </div>
  );
}
