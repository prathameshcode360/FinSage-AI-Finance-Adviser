// src/utils/formatDate.js
import { format, parseISO, formatDistanceToNow } from "date-fns";

export const formatDate = (date, formatStr = "MMM dd, yyyy") => {
  if (!date) return "-";
  try {
    return format(parseISO(date), formatStr);
  } catch {
    return "-";
  }
};

export const formatDateShort = (date) => {
  return formatDate(date, "MMM dd");
};

export const formatDateTime = (date) => {
  return formatDate(date, "MMM dd, yyyy h:mm a");
};

export const timeAgo = (date) => {
  if (!date) return "";
  try {
    return formatDistanceToNow(parseISO(date), { addSuffix: true });
  } catch {
    return "";
  }
};

export const getMonthYear = (date) => {
  if (!date) return "";
  try {
    return format(parseISO(date), "MMMM yyyy");
  } catch {
    return "";
  }
};
