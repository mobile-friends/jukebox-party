import * as z from 'zod';
import partyCodeSchema from '../../schemas/partyCodeSchema';
import { PartyCode } from '@common/types/partyCode';
import { useState } from 'react';

type PartyCodeValidationError = string;

interface UnvalidatedPartyCodeInput {
  isValidated: false;
  input: string;
}

interface ValidPartyCodeInput {
  isValidated: true;
  isValid: true;
  input: string;
  partyCode: PartyCode;
}

interface InvalidPartyCodeInput {
  isValidated: true;
  isValid: false;
  input: string;
  errors: PartyCodeValidationError[];
}

type ValidatedPartyCode = ValidPartyCodeInput | InvalidPartyCodeInput;

type UseValidatedPartyCode = [
  ValidatedPartyCode | UnvalidatedPartyCodeInput,
  (input: string) => void
];

export const useValidatePartyCodeInput = (
  initial: string
): UseValidatedPartyCode => {
  function validate(s: string): ValidatedPartyCode {
    const validated = partyCodeSchema.safeParse(s);
    if (validated.success) {
      const partyCode = PartyCode.tryMake(validated.data)!;
      return { isValidated: true, isValid: true, input: s, partyCode };
    } else {
      const errors = validated.error.issues.map((issue) => issue.message);
      return { isValidated: true, isValid: false, input: s, errors };
    }
  }

  const [validated, setValidated] = useState<
    ValidatedPartyCode | UnvalidatedPartyCodeInput
  >({ isValidated: false, input: initial });

  const setInput = (input: string) => {
    const validated = validate(input);
    setValidated(validated);
  };

  return [validated, setInput];
};
