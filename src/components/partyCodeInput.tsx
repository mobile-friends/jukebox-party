import { PartyCode } from '@common/types/partyCode';
import React, { useState } from 'react';
import Input from '@component/elements/input';
import ErrorList from '@component/elements/errorList';
import * as z from 'zod';

type ValueChangedListener = (value: PartyCode | null) => SyncOrAsync<void>;

type ParseError = string;

interface Props {
  initialValue: string | null;
  onValueChanged: ValueChangedListener;
}

interface NoInputState {
  kind: 'NoInput';
  value: '';
}

interface SuccessState {
  kind: 'Success';
  value: string;
  partyCode: PartyCode;
}

interface ErrorState {
  kind: 'Error';
  value: string;
  errors: ParseError[];
}

type State = NoInputState | SuccessState | ErrorState;

const noInputState: NoInputState = { kind: 'NoInput', value: '' };

const partyCodeSchema = z
  .string()
  .length(6, { message: 'Partycode muss 6 Zeichen lang sein' })
  .regex(/^[0-9]*$/, {
    message: 'Nur Zahlen erlaubt',
  });

function makeStateFrom(input: string): State {
  const parsed = partyCodeSchema.safeParse(input);
  return parsed.success
    ? {
      kind: 'Success',
      value: input,
      partyCode: PartyCode.tryMake(parsed.data)!,
    }
    : {
        kind: 'Error',
        value: input,
        errors: parsed.error.issues.map((it) => it.message),
      };
}

function makeInitialState(initialValue: string | null): State {
  return initialValue ? makeStateFrom(initialValue) : noInputState;
}

function isSuccessState(state: State): state is SuccessState {
  return state.kind === 'Success';
}

function isErrorState(state: State): state is ErrorState {
  return state.kind === 'Error';
}

export default function PartyCodeInput({
  initialValue,
  onValueChanged,
}: Props) {
  const [state, setState] = useState(makeInitialState(initialValue));

  function onInput(input: string) {
    const newState = input.length > 0 ? makeStateFrom(input) : noInputState;

    // If parsing was successful, send an update
    if (isSuccessState(newState)) onValueChanged(newState.partyCode);
    // Also send an update, if parsing failed, and we had a value previously
    // This filters out redundant repeated null events
    else if (isSuccessState(state)) onValueChanged(null);

    setState(newState);
  }

  const errors = isErrorState(state) ? state.errors : [];
  const hasErrors = errors.length > 0;

  return (
    <div>
      <Input
        type='number'
        placeholder='Party code'
        value={state.value}
        onChange={onInput}
        hasError={hasErrors}
      />
      {hasErrors ? <ErrorList errors={errors} /> : <></>}
    </div>
  );
}
