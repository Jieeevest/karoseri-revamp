"use client";

import { useEffect, useMemo, useState } from "react";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingController } from "@/components/ui/loading-provider";

const ROUTE_SPINNER_MS = 450;
const OVERLAY_DELAY_MS = 120;

export function LoadingOverlay() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const { isManualLoading } = useLoadingController();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [routeLoading, setRouteLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setRouteLoading(true);
    const timer = setTimeout(() => {
      setRouteLoading(false);
    }, ROUTE_SPINNER_MS);

    return () => clearTimeout(timer);
  }, [pathname, searchParams.toString()]);

  const busy = useMemo(() => {
    return (
      isManualLoading ||
      routeLoading ||
      isFetching > 0 ||
      isMutating > 0
    );
  }, [isManualLoading, routeLoading, isFetching, isMutating]);

  useEffect(() => {
    if (busy) {
      const delay = setTimeout(() => setVisible(true), OVERLAY_DELAY_MS);
      return () => clearTimeout(delay);
    }
    setVisible(false);
  }, [busy]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Memuat halaman"
    >
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-2xl border border-slate-200">
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute h-14 w-14 rounded-full border-4 border-blue-200" />
          <div className="absolute h-14 w-14 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
          <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900">Sedang memuat</p>
          <p className="text-xs text-slate-500">Mohon tunggu sebentar...</p>
        </div>
      </div>
    </div>
  );
}
