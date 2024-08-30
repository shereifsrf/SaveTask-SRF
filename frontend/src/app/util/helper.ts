import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export enum DateFormat {
  ddMMyyyy = "dd/MM/yyyy",
  yyyyMMdd = "yyyy-MM-dd",
}

const formatDate = (date: string, format = DateFormat.ddMMyyyy) => {
  const dateObj = new Date(date);
  // format date in dd/mm/yyyy
  if (format === DateFormat.ddMMyyyy) {
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear().toString();
    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }
  return date.split("T")[0];
};

const cn = (...classes: ClassValue[]) => {
  return twMerge(clsx(...classes));
};

export const helper = {
  formatDate,
  cn,
};
