/**
 * @usevyre/react — Carousel + CarouselSlide
 *
 * AI CONTEXT:
 * ┌──────────────────────────────────────────────────────────────────┐
 * │ Component:  Carousel (+ CarouselSlide)                            │
 * │ Import: import { Carousel, CarouselSlide } from "@usevyre/react"  │
 * │                                                                   │
 * │ Accessible content slider (galleries / onboarding / testimonials).│
 * │ CONTROLLED by a 0-based slide index. Slide order = index.         │
 * │                                                                   │
 * │   <Carousel>                                                      │
 * │     value?        = number  (controlled active slide)             │
 * │     defaultValue  = number  (uncontrolled, default 0)             │
 * │     onChange?     = (index: number) => void                       │
 * │     loop?         = boolean  (wrap past the ends)                 │
 * │     autoPlay?     = boolean  interval = ms (default 5000)         │
 * │     showArrows?   = boolean (default true)                        │
 * │     showIndicators= boolean (default true)                        │
 * │     <CarouselSlide> any content </CarouselSlide>                  │
 * │                                                                   │
 * │ Snap scrolling, clickable dot indicators, ←/→ keyboard,           │
 * │ autoplay pauses on hover/focus.                                    │
 * └──────────────────────────────────────────────────────────────────┘
 *
 * @example
 * const [i, setI] = useState(0);
 * <Carousel value={i} onChange={setI} loop>
 *   <CarouselSlide><img src="/a.jpg" alt="A" /></CarouselSlide>
 *   <CarouselSlide><img src="/b.jpg" alt="B" /></CarouselSlide>
 * </Carousel>
 */

import React from "react";
import { cn } from "../../utils/cn";
import type { BaseProps } from "../../types";

export interface CarouselSlideProps extends BaseProps {
  children?: React.ReactNode;
}

export const CarouselSlide = React.forwardRef<
  HTMLDivElement,
  CarouselSlideProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    role="group"
    aria-roledescription="slide"
    className={cn("vyre-carousel__slide", className)}
    {...props}
  >
    {children}
  </div>
));
CarouselSlide.displayName = "VyreCarouselSlide";

const ArrowIcon = ({ dir }: { dir: "prev" | "next" }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d={dir === "prev" ? "M10 3L5 8l5 5" : "M6 3l5 5-5 5"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CarouselProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    BaseProps {
  value?: number;
  defaultValue?: number;
  onChange?: (index: number) => void;
  loop?: boolean;
  autoPlay?: boolean;
  /** Autoplay interval in ms */
  interval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  children?: React.ReactNode;
  "aria-label"?: string;
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      loop = false,
      autoPlay = false,
      interval = 5000,
      showArrows = true,
      showIndicators = true,
      className,
      children,
      "aria-label": ariaLabel = "Carousel",
      ...props
    },
    ref
  ) => {
    const slides = React.Children.toArray(children).filter(
      (c): c is React.ReactElement =>
        React.isValidElement(c) && c.type === CarouselSlide
    );
    const count = slides.length;

    const isControlled = controlledValue !== undefined;
    const [internal, setInternal] = React.useState(defaultValue);
    const active = Math.min(
      Math.max(isControlled ? controlledValue! : internal, 0),
      Math.max(count - 1, 0)
    );

    const trackRef = React.useRef<HTMLDivElement>(null);
    const [paused, setPaused] = React.useState(false);

    const go = React.useCallback(
      (next: number) => {
        let n = next;
        if (n < 0) n = loop ? count - 1 : 0;
        else if (n > count - 1) n = loop ? 0 : count - 1;
        if (!isControlled) setInternal(n);
        onChange?.(n);
      },
      [count, loop, isControlled, onChange]
    );

    // Scroll the active slide into view on change.
    React.useEffect(() => {
      const track = trackRef.current;
      if (!track) return;
      const el = track.children[active] as HTMLElement | undefined;
      if (el)
        track.scrollTo({ left: el.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }, [active]);

    // Autoplay (paused on hover/focus).
    React.useEffect(() => {
      if (!autoPlay || paused || count < 2) return;
      const id = window.setInterval(
        () => go(active + 1 > count - 1 ? (loop ? 0 : active) : active + 1),
        interval
      );
      return () => window.clearInterval(id);
    }, [autoPlay, paused, count, active, interval, loop, go]);

    const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(active - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(active + 1);
      }
    };

    return (
      <div
        ref={ref}
        className={cn("vyre-carousel", className)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onKeyDown={onKeyDown}
        {...props}
      >
        <div className="vyre-carousel__viewport">
          <div
            ref={trackRef}
            className="vyre-carousel__track"
            tabIndex={0}
            aria-live={autoPlay ? "off" : "polite"}
          >
            {slides.map((slide, i) => (
              <React.Fragment key={i}>
                {React.cloneElement(slide, {
                  "aria-hidden": i !== active || undefined,
                  "aria-label": `${i + 1} of ${count}`,
                })}
              </React.Fragment>
            ))}
          </div>

          {showArrows && count > 1 && (
            <>
              <button
                type="button"
                className="vyre-carousel__arrow vyre-carousel__arrow--prev"
                aria-label="Previous slide"
                disabled={!loop && active === 0}
                onClick={() => go(active - 1)}
              >
                <ArrowIcon dir="prev" />
              </button>
              <button
                type="button"
                className="vyre-carousel__arrow vyre-carousel__arrow--next"
                aria-label="Next slide"
                disabled={!loop && active === count - 1}
                onClick={() => go(active + 1)}
              >
                <ArrowIcon dir="next" />
              </button>
            </>
          )}
        </div>

        {showIndicators && count > 1 && (
          <div className="vyre-carousel__indicators" role="tablist">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === active}
                data-active={i === active ? "" : undefined}
                className="vyre-carousel__dot"
                onClick={() => go(i)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
Carousel.displayName = "VyreCarousel";
