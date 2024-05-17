import {
  ComponentPropsWithoutRef,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface AutoplayOptions {
  enabled: boolean;
  interval: number;
  next: () => number;
}

interface Autoplay {
  shouldAutoplay: boolean;
  autoplayUserPreference: boolean;
  setAutoplayUserPreference: Dispatch<SetStateAction<boolean>>;
  rootProps: ComponentPropsWithoutRef<"div">;
}

export function useAutoplay({
  enabled,
  interval,
  next,
}: AutoplayOptions): Autoplay {
  // Controls whether autoplaying is active, dependent on being enabled by props
  // and whether the user is interacting with the Carousel.
  const [shouldAutoplay, setShouldAutoplay] = useState(enabled);
  // Controls whether the user has directly disabled autoplay
  const [autoplayUserPreference, setAutoplayUserPreference] = useState(enabled);

  useInterval(
    () => requestAnimationFrame(next),
    autoplayUserPreference && shouldAutoplay ? interval : null,
  );

  const pause = useCallback(() => {
    if (!enabled) return;
    setShouldAutoplay(false);
  }, [enabled]);
  const play = useCallback(() => {
    if (!enabled) return;
    setShouldAutoplay(true);
  }, [enabled]);

  useEffect(() => {
    function listener() {
      if (document.visibilityState === "hidden") {
        pause();
      } else {
        play();
      }
    }
    document.addEventListener("visibilitychange", listener);

    return () => {
      document.removeEventListener("visibilitychange", listener);
    };
  }, [pause, play]);

  return {
    shouldAutoplay,
    autoplayUserPreference,
    setAutoplayUserPreference,
    rootProps: {
      onMouseEnter: pause,
      onTouchStart: pause,
      onFocus: pause,
      onMouseLeave: play,
      onTouchEnd: play,
      onBlur: play,
    },
  };
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearInterval(id);
    };
  }, [delay]);
}
