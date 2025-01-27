export const formatDate = (input) => {
  const date = new Date(input).toLocaleDateString("id-ID");
  return date;
};
export const formatDateFirebase = (timestamp) => {
  const milliseconds = timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6;
  const date = new Date(milliseconds);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
  return formattedDate;
};
