import { useEffect, useState } from "react";

/*
  useMediaQuery Hook
  
  بررسی می‌کنه که سایز صفحه در چه breakpoint ای هست.
  مثلاً: آیا موبایله؟ تبلته؟ دسکتاپه؟
  
  استفاده:
    const isMobile = useMediaQuery("(max-width: 768px)");
*/

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    function handler(e: MediaQueryListEvent) {
      setMatches(e.matches);
    }

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
