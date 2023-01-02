import React from 'react';
import * as z from 'zod';
import ValidatedInput from '@component/validatedInput';

type ValueChangedListener = (value: string | null) => SyncOrAsync<void>;

interface Props {
  initialValue: string | null;
  onValueChanged: ValueChangedListener;
}

//TODO regex für emojis erweitern
const nameInputSchema = z
  .string()
  .min(3, 'Mindestens 3 Zeichen')
  .max(64, 'Maximal 64 Zeichen')
  .regex(/^[\w\s-]*$/, 'Alphanumerisch + Lehrzeichen/Bindestrich/etc');

export default function UserNameInput({ initialValue, onValueChanged }: Props) {
  return (
    <ValidatedInput
      type={'text'}
      placeholder={'User-name'}
      initialValue={initialValue}
      onValueChanged={onValueChanged}
      schema={nameInputSchema}
    />
  );
}
