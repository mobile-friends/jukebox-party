import React, { HTMLInputTypeAttribute, useState } from 'react';
import Input from '@component/elements/input';
import ErrorList from '@component/elements/errorList';
import { ZodType, ZodTypeDef } from 'zod';

// eslint-disable-next-line @typescript-eslint/ban-types
type ValueChangedListener<T> = (value: T | null) => SyncOrAsync<void>;

type ParseError = string;

type ParseSchema<T> = ZodType<T, ZodTypeDef, string>;

interface Props<T> {
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  initialValue: string | null;
  onValueChanged: ValueChangedListener<T>;
  schema: ParseSchema<T>;
}

interface NoInputState {
  kind: 'NoInput';
  text: '';
}

interface SuccessState<T> {
  kind: 'Success';
  text: string;
  value: T;
}

interface ErrorState {
  kind: 'Error';
  text: string;
  errors: ParseError[];
}

type State<T> = NoInputState | SuccessState<T> | ErrorState;

const noInputState: NoInputState = { kind: 'NoInput', text: '' };

function makeStateFrom<T>(input: string, schema: ParseSchema<T>): State<T> {
  const parsed = schema.safeParse(input);
  return parsed.success
    ? {
        kind: 'Success',
        text: input,
        value: parsed.data,
      }
    : {
        kind: 'Error',
        text: input,
        errors: parsed.error.issues.map((it) => it.message),
      };
}

function makeInitialState<T>(
  initialValue: string | null,
  schema: ParseSchema<T>
): State<T> {
  return initialValue ? makeStateFrom(initialValue, schema) : noInputState;
}

function isSuccessState<T>(state: State<T>): state is SuccessState<T> {
  return state.kind === 'Success';
}

function isErrorState(state: State<unknown>): state is ErrorState {
  return state.kind === 'Error';
}

export default function ValidatedInput<T>({
  type,
  placeholder,
  initialValue,
  onValueChanged,
  schema,
}: Props<T>) {
  const [state, setState] = useState(makeInitialState(initialValue, schema));

  function onInput(input: string) {
    const newState =
      input.length > 0 ? makeStateFrom(input, schema) : noInputState;

    // If parsing was successful, send an update
    if (isSuccessState(newState)) onValueChanged(newState.value);
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
        type={type}
        placeholder={placeholder}
        value={state.text}
        onChange={onInput}
        hasError={hasErrors}
      />
      {hasErrors ? <ErrorList errors={errors} /> : <></>}
    </div>
  );
}
