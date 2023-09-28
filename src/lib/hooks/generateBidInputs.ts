import { useEffect, useState } from "react";
import { getHash } from "~/lib/utils";
import { bidInputType } from "~/schemas/bid";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export function useGenerateRandomValues(numberInputs: number, aucId: string) {
  const [values, setValues] = useState<bidInputType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateVals = async () => {
      const promises = Array(numberInputs)
        .fill(null)
        .map(async (_, index) => {
          const uid = (index + 1).toString();
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
      setValues(resolvedValues);
      setLoading(false);
    };
    generateVals();
  }, [aucId, numberInputs]);

  return { values, loading };
}
