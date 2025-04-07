declare interface IGetVectors {
  name: string;
  type: "geojson" | "shp";
}
declare interface IUploadVectors {
  name: string;
  category: string;
  type: "geojson" | "shp";
  file: any;
}
