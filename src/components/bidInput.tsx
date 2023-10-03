import { MutableRefObject, startTransition, useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { useGenerateRandomValues } from "~/lib/hooks/generateBidInputs";
import { getHash } from "~/lib/utils";
import { bidInputType } from "~/schemas/bid";

function BidInput({
  aucId,
  numberInputs,
  sendValues,
}: {
  aucId: string;
  numberInputs: number;
  sendValues: MutableRefObject<bidInputType[]>;
}) {
  const { loading, values } = useGenerateRandomValues(numberInputs, aucId);
  const [inputValues, setInputValues] = useState<bidInputType[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Data has been loaded, you can set inputValues and sendValues here
      setInputValues(values);
      sendValues.current = values;
      setDataLoaded(true);
    }
  }, [loading, values, sendValues]);

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
    sendValues.current = newInputValues;
    startTransition(() => {
      getHash({
        aucId: aucId,
        bidAmount: newInputValues[rowIndex].bidAmount,
        bidPrice: newInputValues[rowIndex].bidPrice,
        salt: newInputValues[rowIndex].salt,
        uid: newInputValues[rowIndex].uid,
      })
        .then((hash) => {
          setInputValues((prev) => {
            if (newInputValues[rowIndex].bidPrice === prev[rowIndex].bidPrice) {
              prev[rowIndex].hash = hash;
              return [...prev];
            } else return prev;
          });
        })
        .catch((error) => {
          console.error("Error computing hash:", error);
          newInputValues[rowIndex].hash = "Error";
          setInputValues(newInputValues);
        });
    });
  };

  // How do i make it so that the elements in the grid do not resize?
  const generateDivs = () => {
    let rows = [];
    for (let i = 0; i < inputValues.length; i++) {
      rows.push(
        <div className="grid grid-cols-6 gap-6 w-full" key={i}>
          <div className="flex flex-col w-full">
            <p>User ID</p>
            <Input
              value={inputValues[i].uid}
              onChange={(e) => handleInputChange(e, i, "uid")}
              required
            />
          </div>
          <div className="flex flex-col py-1 w-full">
            <p>Salt</p>
            <Input
              value={inputValues[i].salt}
              onChange={(e) => handleInputChange(e, i, "salt")}
              required
            />
          </div>
          <div className="flex flex-col py-1 w-full">
            <p>Bid Price</p>
            <Input
              value={inputValues[i].bidPrice}
              onChange={(e) => handleInputChange(e, i, "bidPrice")}
              required
            />
          </div>
          <div className="flex flex-col py-1 w-full">
            <p>Bid Amount</p>
            <Input
              value={inputValues[i].bidAmount}
              onChange={(e) => handleInputChange(e, i, "bidAmount")}
              required
            />
          </div>
          <div className="flex flex-col py-1 w-full">
            <p>Hash</p>
            <div className="align-middle leading-[40px] text-sm">
              {inputValues[i].hash}
            </div>
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="flex flex-col content-center items-start">
      {loading && <div>Populating random bids...</div>}
      {dataLoaded && generateDivs()}
    </div>
  );
}

export default BidInput;
