import { useState } from 'react';
import * as z from 'zod';
import nameInputSchema from '../../../utils/schemas/nameInputSchema';

type UseValidatePartyNameInput = {
  partyName: string;
  isPartyNameValid: boolean;
  partyNameErrors: string[];
  validateAndSetPartyNameInput: (input: string) => void;
};

export const useValidatePartyNameInput = (): UseValidatePartyNameInput => {
  const [partyName, setPartyName] = useState<string>('');
  const [isPartyNameValid, setIsPartyNameValid] = useState<boolean>(false);
  const [partyNameErrors, setPartyNameErrors] = useState<string[]>([]);

  const validateAndSetPartyNameInput = (input: string) => {
    const validated: z.SafeParseReturnType<string, string> =
      nameInputSchema.safeParse(input);

    setPartyName(input);
    if (validated.success) {
      setIsPartyNameValid(true);
      setPartyNameErrors([]);
    } else {
      setIsPartyNameValid(false);
      setPartyNameErrors(validated.error.issues.map((issue) => issue.message));
    }
  };

  return {
    partyName,
    isPartyNameValid,
    partyNameErrors,
    validateAndSetPartyNameInput,
  };
};
