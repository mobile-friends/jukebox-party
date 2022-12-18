import { useState, useEffect } from 'react';
import * as z from 'zod';
import partyCodeSchema from '../../schemas/partyCodeSchema';

type UseValidatePartyCodeInputProps = {
  partyCode: string;
  isPartyCodeValid: boolean;
  partyCodeErrors: string[];
  validateAndSetPartyCodeInput: (input: string) => void;
};

export const useValidatePartyCodeInput = (
  code?: string
): UseValidatePartyCodeInputProps => {
  const [partyCode, setPartyCode] = useState<string>(code ? code : '');
  const [isPartyCodeValid, setIsPartyCodeValid] = useState<boolean>(false);
  const [partyCodeErrors, setPartyCodeErrors] = useState<string[]>([]);

  const validateAndSetPartyCodeInput = (input: string) => {
    const validated: z.SafeParseReturnType<string, string> =
      partyCodeSchema.safeParse(input);

    setPartyCode(input);
    if (validated.success) {
      setIsPartyCodeValid(true);
      setPartyCodeErrors([]);
    } else {
      setIsPartyCodeValid(false);
      setPartyCodeErrors(validated.error.issues.map((issue) => issue.message));
    }
  };

  return {
    partyCode,
    isPartyCodeValid,
    partyCodeErrors,
    validateAndSetPartyCodeInput,
  };
};
