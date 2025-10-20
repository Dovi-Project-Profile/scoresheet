import { useRef, useCallback } from "react";

/**
 * useDebouncer
 * @param {Function} func - The function you want to debounce.
 * @param {number} delay - Debounce delay in milliseconds.
 * @returns {Function} - A debounced version of your function.
 */
export function useDebouncer(func, delay = 500) {
  const timeoutRef = useRef(null);

  const debouncedFn = useCallback(
    (...args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  return debouncedFn;
}
