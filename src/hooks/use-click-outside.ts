import { useEffect, useRef, MutableRefObject } from 'react';

/**
 * Custom hook for detecting clicks outside an element
 * @param handler - Function to call when click occurs outside
 * @returns ref to attach to the element
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void
): MutableRefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handler]);

  return ref;
}
