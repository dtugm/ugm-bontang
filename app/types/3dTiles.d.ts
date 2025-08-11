declare interface IGet3dTilesParams {
  category: String;
  status: Boolean;
  lod: number;
}

declare interface IUpload3dTilesPayload {
  name: String | null;
  lod: number | null;
  category: String | null;
  status: Boolean | null;
  center_x: number | null;
  center_y: number | null;
  file: any;
  source?: "AWS" | "CESIUM";
}
