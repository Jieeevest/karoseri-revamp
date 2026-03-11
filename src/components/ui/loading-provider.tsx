"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

type LoadingContextValue = {
  start: () => void;
  stop: () => void;
  isManualLoading: boolean;
};

const LoadingContext = createContext<LoadingContextValue | null>(null);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isManualLoading, setIsManualLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setIsManualLoading(false);
  }, [clearTimer]);

  const start = useCallback(() => {
    clearTimer();
    setIsManualLoading(true);
    timeoutRef.current = setTimeout(() => {
      setIsManualLoading(false);
    }, 6000);
  }, [clearTimer]);

  useEffect(() => {
    stop();
  }, [pathname, searchParams.toString(), stop]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  const value = useMemo(
    () => ({ start, stop, isManualLoading }),
    [start, stop, isManualLoading],
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoadingController() {
  const context = useContext(LoadingContext);
  if (!context) {
    return {
      start: () => {},
      stop: () => {},
      isManualLoading: false,
    };
  }
  return context;
}
