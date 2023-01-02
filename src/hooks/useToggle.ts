import { useState } from 'react';

export default function useToggle(): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(false);

  function toggle() {
    setValue(!value);
  }

  return [value, toggle];
}
