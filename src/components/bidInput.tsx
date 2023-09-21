import { MutableRefObject, useEffect, useState } from "react";
import { object, string } from "valibot";
import { Input } from "~/components/ui/input";
import { bidInputType, bidType } from "~/schemas/bid";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

async function getHash(values: bidType) {
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

function BidInput({
  aucId,
  numberInputs,
  sendValues,
}: {
  aucId: string;
  numberInputs: number;
  sendValues: MutableRefObject<bidInputType[]>;
}) {
  const [inputValues, setInputValues] = useState<bidInputType[]>(
    Array(numberInputs).fill({
      userId: "",
      salt: "",
      bidPrice: "",
      bidAmount: "",
      hash: "",
    })
  );

  useEffect(() => {
    // Generate random initial values when the component mounts
    const generateRandomValues = async () => {
      const promises = Array(inputValues.length)
        .fill(null)
        .map(async (_, index) => {
          const uid = index.toString();
          const salt = getRandomInt(9007199254740991).toString();
          const bidPrice = getRandomInt(10000).toString();
          const bidAmount = getRandomInt(1000000).toString();
          const hash = await getHash({
            aucId,
            bidAmount,
            bidPrice,
            salt,
            uid,
          });

          return {
            uid,
            salt,
            bidPrice,
            bidAmount,
            hash,
          };
        });

      const resolvedValues = await Promise.all(promises);
      setInputValues(resolvedValues);
      sendValues.current = resolvedValues;
    };

    generateRandomValues();
  }, [aucId, inputValues.length, sendValues]);

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    fieldName: string
  ) => {
    const newInputValues = [...inputValues];
    newInputValues[rowIndex] = {
      ...newInputValues[rowIndex],
      [fieldName]: event.target.value,
    };
    newInputValues[rowIndex].hash = "Computing...";
    setInputValues(newInputValues);

    try {
      const hash = await getHash({
        aucId: aucId,
        bidAmount: newInputValues[rowIndex].bidAmount,
        bidPrice: newInputValues[rowIndex].bidPrice,
        salt: newInputValues[rowIndex].salt,
        uid: newInputValues[rowIndex].uid,
      });
      const vals = [...newInputValues];
      vals[rowIndex].hash = hash;
      setInputValues(vals);
      sendValues.current = vals;
    } catch (error) {
      console.error("Error computing hash:", error);
      newInputValues[rowIndex].hash = "Error";
      setInputValues(newInputValues);
    }
  };

  const generateDivs = () => {
    let rows = [];
    for (let i = 0; i < inputValues.length; i++) {
      rows.push(
        <div className="flex shrink-1 gap-6 justify-center" key={i}>
          <div className="flex flex-col py-1 basis-1/5">
            <p>User ID</p>
            <Input
              value={inputValues[i].uid}
              onChange={(e) => handleInputChange(e, i, "uid")}
              required
            />
          </div>
          <div className="flex flex-col py-1 basis-1/5">
            <p>Salt</p>
            <Input
              value={inputValues[i].salt}
              onChange={(e) => handleInputChange(e, i, "salt")}
              required
            />
          </div>
          <div className="flex flex-col py-1 basis-1/5">
            <p>Bid Price</p>
            <Input
              value={inputValues[i].bidPrice}
              onChange={(e) => handleInputChange(e, i, "bidPrice")}
              required
            />
          </div>
          <div className="flex flex-col py-1 basis-1/5">
            <p>Bid Amount</p>
            <Input
              value={inputValues[i].bidAmount}
              onChange={(e) => handleInputChange(e, i, "bidAmount")}
              required
            />
          </div>
          <div className="flex flex-col py-1 basis-2/5">
            <p>Hash</p>
            <div>{inputValues[i].hash}</div>
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="flex flex-col content-center items-start">
      {generateDivs()}
    </div>
  );
}

export default BidInput;
