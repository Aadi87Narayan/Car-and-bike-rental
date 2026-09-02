import { useEffect, useRef, useState } from 'react';

export function useScrollAnimation(options = { threshold: 0.15, triggerOnce: true }) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce && elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      } else if (!options.triggerOnce) {
        setIsVisible(false);
      }
    }, {
      threshold: options.threshold || 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [options.threshold, options.triggerOnce]);

  return [elementRef, isVisible];
}
