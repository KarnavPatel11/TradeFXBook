import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    signDisplay: "auto",
  }).format(value)
}

export function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`
}

export function formatDate(date: Date | string | number, formatStr: string = "MMM d, yyyy") {
  return format(new Date(date), formatStr)
}

export function formatDateTime(date: Date | string | number) {
  return format(new Date(date), "MMM d, yyyy HH:mm")
}
