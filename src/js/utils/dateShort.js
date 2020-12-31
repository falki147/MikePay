export default function getShortDate(fullDate){
  const date = new Date(fullDate);
  return date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
};