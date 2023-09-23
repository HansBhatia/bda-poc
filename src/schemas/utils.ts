import { ValiError, flatten } from "valibot";

export function formatValidatorError(err: unknown) {
  return err instanceof ValiError ? flatten(err) : undefined;
}
