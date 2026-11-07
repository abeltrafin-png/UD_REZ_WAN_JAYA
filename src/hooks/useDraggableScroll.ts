import { useRef, useState, useEffect, useCallback } from 'react';

export function useDraggableScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const hasMovedRef = useRef(false);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    // Mutation observer if items change dynamically
    const observer = new ResizeObserver(() => {
      checkScrollability();
    });
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
      observer.disconnect();
    };
  }, [checkScrollability]);

  const scroll = useCallback((direction: 'left' | 'right', amount = 220) => {
    const el = containerRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -amount : amount;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDownRef.current = false;
    // Small timeout to allow click handlers to know it was a drag
    setTimeout(() => {
      hasMovedRef.current = false;
      setIsDragging(false);
    }, 60);
  }, []);

  const onMouseLeave = useCallback(() => {
    isDownRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
      setIsDragging(false);
    }, 60);
  }, []);

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    isDragging,
    hasMovedRef,
    checkScrollability,
    dragHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
}
