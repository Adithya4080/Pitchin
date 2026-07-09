import { useEffect, useRef } from 'react';

export function useInView<T extends HTMLElement>(
  onInView: () => void,
  { enabled = true, rootMargin = '400px' }: { enabled?: boolean; rootMargin?: string } = {}
) {
  const ref = useRef<T>(null);
  const callbackRef = useRef(onInView);
  callbackRef.current = onInView;

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callbackRef.current();
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return ref;
}
