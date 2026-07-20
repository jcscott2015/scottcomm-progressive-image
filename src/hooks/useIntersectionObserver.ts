/**
 * @description Highly optimized, modern TypeScript Hook for Viewport Intersection.
 * @author John C. Scott (Refactored 2026)
 * @license MIT
 */
import { type RefObject, useEffect, useState } from 'react';

interface UseIntersectionObserverArgs extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = <T extends Element = Element>(
  elementRef: RefObject<T | null>,
  { threshold = 0, root = null, rootMargin = '100px', freezeOnceVisible = false }: UseIntersectionObserverArgs = {}
): boolean => {
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  useEffect(() => {
    const node = elementRef?.current;
    if (!node) return;

    if (freezeOnceVisible && isIntersecting) return;

    const observerCallback = ([entry]: IntersectionObserverEntry[]): void => {
      const { isIntersecting: currentIsIntersecting } = entry;

      setIsIntersecting(currentIsIntersecting);

      if (currentIsIntersecting && freezeOnceVisible) {
        observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, root, rootMargin, freezeOnceVisible, isIntersecting, threshold]);

  return isIntersecting;
};

export default useIntersectionObserver;
