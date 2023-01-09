import { useState } from 'react';

export default function useToggle(initial = false): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initial);

  function toggle() {
    setValue(!value);
  }

  return [value, toggle];
}
