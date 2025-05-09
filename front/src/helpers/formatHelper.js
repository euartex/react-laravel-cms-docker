import { differenceInMinutes } from "date-fns";

export const formattedDateDifference = (endDate, startDate) => {
  const minuteDiff = differenceInMinutes(endDate, startDate);

  const days = Math.floor(minuteDiff / 3600);
  const hours = Math.floor(minuteDiff / 60);
  const minutes = minuteDiff % 60;

  if (days > 0) {
    return "more than day";
  }

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m`;
};

export const makeDateDueSafariIssue = rawDateStr => {
  if (!rawDateStr) return rawDateStr;
  if (typeof rawDateStr === "object") return rawDateStr;
  const dateFromString = rawDateStr.split(" ");
  const dateArray = dateFromString[0].split("-");
  const time = dateFromString[1].split(":");

  const date = new Date();
  date.setFullYear(dateArray[0]);
  date.setMonth(parseInt(dateArray[1]) - 1);
  date.setDate(dateArray[2]);
  date.setHours(parseInt(time[0]));
  date.setMinutes(parseInt(time[1]));
  return new Date(date);
};

export const formatDateMMDDYYYYwithTime = rawDateString => {
  if (!rawDateString) return "";
  const [date, time] = rawDateString.split(/[ T]/);
  const [year, month, day] = date.split("-");
  return `${month}-${day}-${year} ${time.slice(0, 8)}`;
  // const rawDate = rawDateString.split(" ");
  // rawDate[0] = new Date(rawDateString + "Z");
  // const year = rawDate[0].getFullYear();
  // const month = rawDate[0].getMonth() + 1;
  // const day = rawDate[0].getDate();
  // return `${month < 10 ? "0" + month : month}-${
  //   day < 10 ? "0" + day : day
  // }-${year} ${rawDate[1].substring(0, 5)}`;
};
