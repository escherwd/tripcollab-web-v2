import _ from "lodash";
import { useEffect, useMemo, useRef } from "react";

const debounceWaitGroups = new Map<string, NodeJS.Timeout>();

export const debounce = (
  callback: () => void,
  key: string,
  timeout = 300
) => {
  if (debounceWaitGroups.has(key)) {
    clearTimeout(debounceWaitGroups.get(key));
  }
  debounceWaitGroups.set(key, setTimeout(() => {
    callback();
  }, timeout));
};

// React-friendly debounce
// https://www.developerway.com/posts/debouncing-in-react?ht-comment-id=13350358 
export const useDebounce = <T extends unknown[], S>(callback: (...args: T) => S, delay: number) => {
  const ref = useRef<typeof callback>(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...arg: T) => {
      ref.current?.(...arg);
    };

    return _.debounce(func, delay);
  }, [delay]);

  return debouncedCallback;
};

// Clone for throttle as well
export const useThrottle = <T extends unknown[], S>(callback: (...args: T) => S, delay: number) => {
  const ref = useRef<typeof callback>(callback);

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const throttledCallback = useMemo(() => {
    const func = (...arg: T) => {
      ref.current?.(...arg);
    };

    return _.throttle(func, delay);
  }, [delay]);

  return throttledCallback;
};