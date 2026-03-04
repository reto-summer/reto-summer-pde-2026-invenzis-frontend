export function formatShort(iso: string): string {
  const date = iso.split("T")[0];
  const parts = date.split("-");
  if (parts.length < 3) return "";
  return `${parts[2]}/${parts[1]}`;
}

export function buildDatetime(
  date: string,
  time: string,
  seconds = "00",
): string {
  if (!date) return "";
  return `${date}T${time}:${seconds}`;
}

export function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function dateOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateStr(d.getFullYear(), d.getMonth(), d.getDate());
}

export const MONTHS_ES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];
export const DAYS_ES = ["L", "M", "X", "J", "V", "S", "D"];

export function formatNotificationDate(dateStr: string): string {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
