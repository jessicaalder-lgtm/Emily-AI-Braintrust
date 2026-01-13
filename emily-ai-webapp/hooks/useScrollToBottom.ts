'use client';

import { useEffect, useRef } from 'react';

export function useScrollToBottom<T extends HTMLElement>(
  dependency: unknown
) {
  const ref = useRef<T>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'auto', block: 'end' });
    }
  }, [dependency]);
  
  return ref;
}
