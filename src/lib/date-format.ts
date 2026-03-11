export function formatDateIndonesia(
  value: string | Date,
  options?: { withTime?: boolean; withWibLabel?: boolean },
) {
  const { withTime = true, withWibLabel = withTime } = options || {};
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit" as const,
          minute: "2-digit" as const,
          hour12: false,
        }
      : {}),
  });

  const parts = formatter.formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value || "--";
  const month = parts.find((part) => part.type === "month")?.value || "--";
  const year = parts.find((part) => part.type === "year")?.value || "----";

  if (!withTime) {
    return `${day}-${month}-${year}`;
  }

  const hour = parts.find((part) => part.type === "hour")?.value || "--";
  const minute = parts.find((part) => part.type === "minute")?.value || "--";

  return `${day}-${month}-${year} ${hour}:${minute}${withWibLabel ? " WIB" : ""}`;
}
