export const handleEmptyOrNull = (value) => {
  return value === null || value === undefined || value === "" ? "-" : value;
};
export const handleEmptyOrNullNumber = (value) => {
  return value === null || value === undefined || value === "" || isNaN(value)
    ? 0
    : value;
};

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

export const handleDataTable = (input) => {
  return input ? input : "-";
};
export async function addGeoJsonProperties(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const geoJson = await response.json();

    if (!geoJson.features || !Array.isArray(geoJson.features)) {
      throw new Error("Invalid GeoJSON format: Missing 'features' array");
    }

    const tableData = geoJson.features.map((feature) => feature.properties);

    return tableData;
  } catch (error) {
    console.error("Error fetching GeoJSON:", error);
    return [];
  }
}
