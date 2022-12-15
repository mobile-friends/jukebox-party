import { useState } from 'react';
import * as z from 'zod';
import nameInputSchema from '../../utils/schemas/nameInputSchema';

type UseValidatePartyUserNameInput = {
  partyUserName: string;
  isPartyUserNameValid: boolean;
  partyUserNameErrors: string[];
  validateAndSetPartyUserNameInput: (input: string) => void;
};

export const useValidatePartyUserNameInput =
  (): UseValidatePartyUserNameInput => {
    const [partyUserName, setPartyUserName] = useState<string>('');
    const [isPartyUserNameValid, setIsPartyUserNameValid] =
      useState<boolean>(false);
    const [partyUserNameErrors, setPartyUserNameErrors] = useState<string[]>(
      []
    );

    const validateAndSetPartyUserNameInput = (input: string) => {
      const validated: z.SafeParseReturnType<string, string> =
        nameInputSchema.safeParse(input);

      setPartyUserName(input);
      if (validated.success) {
        setIsPartyUserNameValid(true);
        setPartyUserNameErrors([]);
      } else {
        setIsPartyUserNameValid(false);
        setPartyUserNameErrors(
          validated.error.issues.map((issue) => issue.message)
        );
      }
    };

    return {
      partyUserName,
      isPartyUserNameValid,
      partyUserNameErrors,
      validateAndSetPartyUserNameInput,
    };
  };
