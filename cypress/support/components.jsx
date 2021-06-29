import React, { useEffect, useState } from 'react';

export function Churner({ children }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!i) setTimeout(() => setI(i + 1), 500);
  }, [i]);

  return <div>{children(i)}</div>;
}
