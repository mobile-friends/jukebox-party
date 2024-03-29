import React from 'react';

/**
 * Custom type for click listeners
 */
type ClickListener = (
  e: React.MouseEvent<HTMLButtonElement, MouseEvent>
) => SyncOrAsync<void>;

type Selector =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'icon-only'
  | 'small'
  | 'big'
  | 'block'
  | 'rating'
  | 'bg-highlight'
  | 'disabled'
  | '';

type Style =
  | Selector
  | `${Selector} ${Selector}`
  | `${Selector} ${Selector} ${Selector}`;

/**
 * Props for a button
 */
interface Props {
  /**
   * Button style type
   */
  readonly styleType: Style;
  /**
   * The buttons content.
   * Can be anything that React can render, like text, icon, ect
   */
  readonly content: React.ReactNode;
  /**
   * A click listener
   */
  readonly onClick: ClickListener;
}

/**
 * A basic button
 * @param props
 * @constructor
 */
export default function Button(props: Props) {
  const { styleType, onClick, content } = props;

  async function onClicked(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    await onClick(e);
  }

  return (
    <button className={`btn ${styleType}`} onClick={onClicked}>
      {content}
    </button>
  );
}
