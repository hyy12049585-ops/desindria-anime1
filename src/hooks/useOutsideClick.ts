import { useEffect, useRef, type RefObject } from "react";

/*
  useOutsideClick Hook
  
  وقتی کاربر بیرون از یک المان کلیک کنه، callback اجرا میشه.
  مثلاً: بستن منوی dropdown وقتی جای دیگه کلیک بشه.
*/

export function useOutsideClick<T extends HTMLElement>(
  callback: () => void
): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [callback]);

  return ref;
}
