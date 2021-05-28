import React from 'react';

// Hide/show something after dt has elapsed.
export default function Timed({ children, init = false, dt = 2000 }) {
  const [isVisible, setIsVisible] = React.useState(init);
  if (dt) setTimeout(() => setIsVisible(!isVisible), dt);
  return isVisible ? children : null;
}
