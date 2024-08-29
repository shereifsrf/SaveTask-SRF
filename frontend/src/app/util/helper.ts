import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const formatDate = (date: string) => {
  const dateObj = new Date(date);
  const dateStr = dateObj.toDateString();
  // format date in dd/mm/yyyy
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear().toString();
  const formattedDate = `${day}/${month}/${year}`;
  return formattedDate;
};

const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(...classes));
};

export const helper = {
  formatDate,
  cn,
};
