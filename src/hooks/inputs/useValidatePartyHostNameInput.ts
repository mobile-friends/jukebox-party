import { useState } from 'react';
import * as z from 'zod';
import nameInputSchema from '../../../utils/schemas/nameInputSchema';

type UseValidatePartyHostNameInput = {
  partyHostName: string;
  isPartyHostNameValid: boolean;
  partyHostNameErrors: string[];
  validateAndSetPartyHostNameInput: (input: string) => void;
};

export const useValidatePartyHostNameInput =
  (): UseValidatePartyHostNameInput => {
    const [partyHostName, setPartyHostName] = useState<string>('');
    const [isPartyHostNameValid, setIsPartyHostNameValid] =
      useState<boolean>(false);
    const [partyHostNameErrors, setPartyHostNameErrors] = useState<string[]>(
      []
    );

    const validateAndSetPartyHostNameInput = (input: string) => {
      const validated: z.SafeParseReturnType<string, string> =
        nameInputSchema.safeParse(input);

      setPartyHostName(input);
      if (validated.success) {
        setIsPartyHostNameValid(true);
        setPartyHostNameErrors([]);
      } else {
        setIsPartyHostNameValid(false);
        setPartyHostNameErrors(
          validated.error.issues.map((issue) => issue.message)
        );
      }
    };

    return {
      partyHostName,
      isPartyHostNameValid,
      partyHostNameErrors,
      validateAndSetPartyHostNameInput,
    };
  };
