/**
 * Formats a date in the DD.MM.YYYY format
 * @param {String} fullDate in "YYYY-MM-DD hh:mm" format
 */
export default function getShortDate(fullDate) {
  const match = fullDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

  if (!match) {
    return NaN;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const paddedDay = (day < 10 ? "0" : "") + day;
  const paddedMonth = (month < 10 ? "0" : "") + month;

  return `${paddedDay}.${paddedMonth}.${year}`;
};
