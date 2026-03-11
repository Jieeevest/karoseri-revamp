"use client";

import Link, { LinkProps } from "next/link";
import { forwardRef } from "react";
import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { useLoadingController } from "@/components/ui/loading-provider";

type LoadingLinkProps = LinkProps & AnchorHTMLAttributes<HTMLAnchorElement>;

function shouldStartNavigation(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented) return false;
  if (event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  return true;
}

function normalizeHref(href: LoadingLinkProps["href"]) {
  if (typeof href === "string") return href;
  if (!href) return "";
  return href.pathname || "";
}

export const LoadingLink = forwardRef<HTMLAnchorElement, LoadingLinkProps>(
  ({ onClick, href, target, ...props }, ref) => {
    const pathname = usePathname();
    const { start } = useLoadingController();

    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (!shouldStartNavigation(event)) return;
      if (target === "_blank") return;

      const hrefValue = normalizeHref(href);
      const hrefPath = hrefValue.split("?")[0] || hrefValue;

      if (hrefPath && hrefPath !== pathname) {
        start();
      }
    };

    return (
      <Link
        ref={ref}
        href={href}
        target={target}
        onClick={handleClick}
        {...props}
      />
    );
  },
);

LoadingLink.displayName = "LoadingLink";
