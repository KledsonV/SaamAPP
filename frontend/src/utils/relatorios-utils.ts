
export const toE164BR = (raw?: string | null): string | null => {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;
  let full = digits.startsWith("55") ? digits : `55${digits}`;
  if (full.length === 12) full = `${full.slice(0, 4)}9${full.slice(4)}`;
  if (full.length < 12 || full.length > 14) return null;
  return `+${full}`;
};

export const formatDateBR = (date: string): string => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

export const formatDateExtended = (date: string): string => {
  if (!date) return "";
  const dateObj = new Date(date + "T00:00:00");
  return dateObj.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getTodayDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

export const getThirtyDaysAgoDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
};

export const convertBRDateToISO = (brDate: string): string => {
  if (!brDate) return "";
  const [day, month, year] = brDate.split("/");
  if (!day || !month || !year) return "";
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

export const convertISODateToBR = (isoDate: string): string => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return "";
  return `${day}/${month}/${year}`;
};