import { useState, useRef, useCallback } from "react";

export function useDragReorder<T>(
  items: T[],
  onReorder: (newItems: T[]) => void
) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const dragNode = useRef<HTMLElement | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent<HTMLElement>, index: number) => {
      setDragIndex(index);
      dragNode.current = e.currentTarget;
      e.dataTransfer.effectAllowed = "move";
      // شفاف‌سازی آیتم درگ شده
      requestAnimationFrame(() => {
        if (dragNode.current) {
          dragNode.current.style.opacity = "0.4";
        }
      });
    },
    []
  );

  const handleDragEnter = useCallback(
    (index: number) => {
      if (dragIndex === null || dragIndex === index) return;
      setOverIndex(index);
    },
    [dragIndex]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      e.preventDefault();
      if (dragIndex === null || overIndex === null || dragIndex === overIndex) {
        resetState();
        return;
      }
      const updated = [...items];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(overIndex, 0, moved);
      onReorder(updated);
      resetState();
    },
    [dragIndex, overIndex, items, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    if (dragNode.current) {
      dragNode.current.style.opacity = "1";
    }
    resetState();
  }, []);

  function resetState() {
    setDragIndex(null);
    setOverIndex(null);
    dragNode.current = null;
  }

  return {
    dragIndex,
    overIndex,
    handleDragStart,
    handleDragEnter,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
