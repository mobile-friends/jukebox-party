import { useState } from 'react';
import * as z from 'zod';

type UseValidatePartyNameInput = {
  partyName: string;
  isPartyNameValid: boolean;
  partyNameErrors: string[];
  validatePartyNameInput: (input: string) => void;
};

export const useValidatePartyNameInput = (): UseValidatePartyNameInput => {
  const [partyName, setPartyName] = useState<string>('');
  const [isPartyNameValid, setIsPartyNameValid] = useState<boolean>(false);
  const [partyNameErrors, setPartyNameErrors] = useState<string[]>([]);

  const schema = z
    .string()
    .min(3, { message: 'Mindestens 3 Zeichen' })
    .max(64, { message: 'Maximal 64 Zeichen' })
    .regex(/^[\w\s-]*$/, {
      message: 'Alphanumerisch + Lehrzeichen/Bindestrich/etc',
    });
  //TODO regex für emojis erweitern

  const validatePartyNameInput = (input: string) => {
    console.log(input);
    const validated: z.SafeParseReturnType<string, string> =
      schema.safeParse(input);

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
    validatePartyNameInput,
  };
};
