import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

type ChangeListener = (newValue: string) => SyncOrAsync<void>;

interface Props {
  /**
   * The inputs type
   */
  type: HTMLInputTypeAttribute;
  /**
   * A placeholder for when no text is entered
   */
  placeholder?: string;
  /**
   * The current value of the input.
   * Skip to preserve the inputs previous value
   */
  value?: string;
  /**
   * Whether this input has invalid content
   */
  hasError?: boolean;
  /**
   * An event for when the inputs value changes
   */
  onChange: ChangeListener;
}

/**
 * A simple input field
 * @constructor
 */
export default (function Input({
  type,
  placeholder,
  value,
  hasError,
  onChange,
}: Props) {
  const errorStyle = hasError ? 'input-error' : '';

  function onChanged(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    onChange(value);
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      className={`input block ${errorStyle}`}
      value={value}
      onChange={onChanged}
    />
  );
});
