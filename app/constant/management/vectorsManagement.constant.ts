export default {
  FileType: [
    { title: "GeoJson", value: "geojson" },
    { title: "SHP", value: "shp" },
  ],
  CategoryType: [
    { title: "Persil Tanah", value: "land_parcel" },
    { title: "Building Outline", value: "building" },
  ],
  defaultUploadForm: {
    name: null,
    category: null,
    status: false,
    type: null,
    file: undefined,
  },
};
