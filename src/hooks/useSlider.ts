import { useRef, useState, useCallback } from "react";

/*
  useSlider Hook
  
  این هوک منطق اسکرول افقی رو مدیریت می‌کنه.
  مثل ردیف‌های نتفلیکس: با دکمه‌های چپ/راست اسکرول می‌کنه.
  
  چطور کار می‌کنه؟
  1. یه ref به المان اسکرول‌شونده وصل می‌شه
  2. scrollLeft و scrollRight مقدار اسکرول رو جابجا می‌کنن
  3. canScrollLeft / canScrollRight بررسی می‌کنن آیا هنوز جا داره
*/

export function useSlider(scrollAmount = 400) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
  }, []);

  const scrollLeft = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  }, [scrollAmount, checkScroll]);

  const scrollRight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTimeout(checkScroll, 350);
  }, [scrollAmount, checkScroll]);

  return {
    containerRef,
    scrollLeft,
    scrollRight,
    canScrollLeft,
    canScrollRight,
    checkScroll,
  };
}
