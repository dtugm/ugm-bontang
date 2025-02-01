export const jamIndoNow = () => {
  const jamIndo = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  };
  const date = new Date().toLocaleTimeString("id-ID", jamIndo);
  return date.split("/").reverse().join("-");
};
export const tanggalIndoNow = () => {
  const tanggalIndo = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Jakarta",
  };
  const date = new Date().toLocaleDateString("id-ID", tanggalIndo);
  return date.split("/").reverse().join("-");
};
export const tanggalIndoNowLengkap = () => {
  const tanggalIndo = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Jakarta",
    hour12: false,
  };
  const date = new Date().toLocaleDateString("id-ID", tanggalIndo);
  return date.split("/").reverse().join("-");
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
