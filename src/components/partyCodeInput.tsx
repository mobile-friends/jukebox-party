import { PartyCode } from '@common/types/partyCode';
import React from 'react';
import * as z from 'zod';
import ValidatedInput from '@component/validatedInput';

type ValueChangedListener = (value: PartyCode | null) => SyncOrAsync<void>;

interface Props {
  initialValue: string | null;
  onValueChanged: ValueChangedListener;
}

const partyCodeSchema = z
  .string()
  .length(6, 'Party-code muss 6 Zeichen lang sein')
  .regex(/^[0-9]*$/, 'Nur Zahlen erlaubt')
  .transform(PartyCode.makeOrThrow);

export default function PartyCodeInput({
  initialValue,
  onValueChanged,
}: Props) {
  return (
    <ValidatedInput
      type={'number'}
      placeholder={'Party-code'}
      initialValue={initialValue}
      onValueChanged={onValueChanged}
      schema={partyCodeSchema}
    />
  );
}
