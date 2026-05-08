import { useState, useEffect } from 'react';

/**
 * A custom hook that debounces a value.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value or delay changes, or if the component unmounts
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * A custom hook that sets the document title.
 * @param title The title to set.
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    // Optional: Restore title on unmount. 
    // Usually for SPAs we just let the next page overwrite it, 
    // or fallback to a default if we want.
    // For now, let's just set it.
  }, [title]);
}
