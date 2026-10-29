import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Scroll-snap carousel state shared by the category and showcase sliders.
 * Spread `trackProps` on the scrolling element; its direct children are the slides.
 */
export const useCarousel = ({ gap = 16 } = {}) => {
  const trackRef = useRef(null);
  const [state, setState] = useState({ canPrev: false, canNext: false, index: 0 });

  const stepWidth = useCallback(() => {
    const first = trackRef.current?.firstElementChild;
    return first ? first.offsetWidth + gap : 0;
  }, [gap]);

  const update = useCallback(() => {
    const track = trackRef.current;
    const step = stepWidth();
    if (!track || !step) return;

    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const next = {
      canPrev: track.scrollLeft > 4,
      canNext: !atEnd,
      index: atEnd
        ? track.children.length - 1
        : Math.round(track.scrollLeft / step),
    };
    setState((prev) =>
      prev.canPrev === next.canPrev &&
      prev.canNext === next.canNext &&
      prev.index === next.index
        ? prev
        : next
    );
  }, [stepWidth]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);
    return () => observer.disconnect();
  }, [update]);

  const scrollBy = (direction) =>
    trackRef.current?.scrollBy({ left: direction * stepWidth(), behavior: "smooth" });

  const goTo = (index) =>
    trackRef.current?.scrollTo({ left: index * stepWidth(), behavior: "smooth" });

  const onKeyDown = (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    scrollBy(event.key === "ArrowRight" ? 1 : -1);
  };

  return {
    ...state,
    scrollBy,
    goTo,
    trackProps: { ref: trackRef, onScroll: update, onKeyDown, tabIndex: 0 },
  };
};
