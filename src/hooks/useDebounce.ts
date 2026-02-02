/**
 * ============================================================================
 * useDebounce HOOK - Delayed Value Updates
 * ============================================================================
 * 
 * PURPOSE:
 * - Delays updating a value until user stops changing it
 * - Common use case: search input (wait until user finishes typing)
 * - Reduces API calls and improves performance
 * 
 * HOW IT WORKS:
 * 1. User types in search box: "prod" → "produ" → "produc" → "product"
 * 2. Each keystroke updates component state immediately (UI responsive)
 * 3. useDebounce delays the API call by 500ms (default)
 * 4. If user keeps typing, timer resets
 * 5. Only when user stops for 500ms, debouncedValue updates
 * 6. API call triggers on debouncedValue change
 * 
 * BEFORE DEBOUNCE: 4 API calls (prod, produ, produc, product)
 * AFTER DEBOUNCE:  1 API call (product after 500ms silence)
 * 
 * USAGE EXAMPLE:
 * ```
 * const [searchText, setSearchText] = useState('')
 * const debouncedSearch = useDebounce(searchText, 500)
 * 
 * useEffect(() => {
 *   if (debouncedSearch) {
 *     productService.search(debouncedSearch)
 *   }
 * }, [debouncedSearch])
 * ```
 * 
 * GENERICS (Revision Note):
 * - <T,> is TypeScript generic syntax
 * - Allows reusing hook with any data type
 * - Example: useDebounce<string>(text, 500)
 * -         useDebounce<number>(price, 300)
 * - T is replaced with actual type at runtime
 * 
 * ============================================================================
 */

import { useState, useEffect } from 'react';

export const useDebounce = <T,>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
