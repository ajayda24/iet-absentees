import { useRef, useEffect } from "react";

export function useSwipe(onSwipeLeft, onSwipeRight, canSwipe = () => true) {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);

  const MIN_SWIPE_DISTANCE = 50;
  const MAX_VERTICAL_DISTANCE = 100;

  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.changedTouches[0].clientX;
      touchStartY.current = e.changedTouches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      touchEndX.current = e.changedTouches[0].clientX;
      touchEndY.current = e.changedTouches[0].clientY;
      handleSwipe();
    };

    const handleSwipe = () => {
      // Check if swipe is allowed by validation
      if (!canSwipe()) return;

      const deltaX = touchStartX.current - touchEndX.current;
      const deltaY = Math.abs(touchStartY.current - touchEndY.current);

      // Only trigger if vertical movement is minimal (not scrolling)
      if (deltaY > MAX_VERTICAL_DISTANCE) return;

      // Swipe left
      if (deltaX > MIN_SWIPE_DISTANCE) {
        onSwipeLeft?.();
      }
      // Swipe right
      else if (deltaX < -MIN_SWIPE_DISTANCE) {
        onSwipeRight?.();
      }
    };

    const element = document.documentElement;
    element.addEventListener("touchstart", handleTouchStart);
    element.addEventListener("touchend", handleTouchEnd);

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [onSwipeLeft, onSwipeRight, canSwipe]);
}
