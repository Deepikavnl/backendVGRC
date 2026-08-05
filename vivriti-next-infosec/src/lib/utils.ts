import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export function formatDate(
    date?: string | Date | null,
    opts?: Intl.DateTimeFormatOptions
) {

  if (!date) {
    return "-";
  }


  const d =
      typeof date === "string"
          ? new Date(date)
          : date;


  if (isNaN(d.getTime())) {
    return "-";
  }


  return d.toLocaleDateString(
      "en-GB",
      opts ?? {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
  );
}





export function formatDateTime(
    date?: string | Date | null
) {

  if (!date) {
    return "-";
  }


  const d =
      typeof date === "string"
          ? new Date(date)
          : date;


  if (isNaN(d.getTime())) {
    return "-";
  }


  return d.toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
  );

}





export function relativeTime(
    date?: string | Date | null
) {


  if (!date) {
    return "-";
  }


  const d =
      typeof date === "string"
          ? new Date(date)
          : date;


  if (isNaN(d.getTime())) {
    return "-";
  }


  const diff =
      Date.now() - d.getTime();


  const mins =
      Math.round(diff / 60000);



  if (mins < 1)
    return "just now";


  if (mins < 60)
    return `${mins}m ago`;



  const hrs =
      Math.round(mins / 60);



  if (hrs < 24)
    return `${hrs}h ago`;



  const days =
      Math.round(hrs / 24);



  if (days < 30)
    return `${days}d ago`;



  return formatDate(d);

}





export function initials(
    name?: string | null
) {

  if (!name)
    return "NA";


  return name
      .split(" ")
      .filter(Boolean)
      .map(
          n => n[0]
      )
      .slice(0,2)
      .join("")
      .toUpperCase();

}





export function pct(
    n:number
){

  return `${Math.round(n)}%`;

}





export function currencyINR(
    n:number
){

  return new Intl.NumberFormat(
      "en-IN",
      {
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
      }
  ).format(n);

}





export const LOGO_URL =
    "https://www.vivritinext.com/_astro/Vivrithi-NEXT.CDcoH_l7.svg";





export function debounce<T extends (...args:any[])=>void>(
    fn:T,
    ms=250
){

  let t:
      ReturnType<typeof setTimeout>;


  return (
      ...args:Parameters<T>
  )=>{


    clearTimeout(t);


    t=setTimeout(
        ()=>fn(...args),
        ms
    );


  };

}