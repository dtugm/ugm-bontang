declare interface IGet3dTilesParams {
  category: String;
  status: Boolean;
  lod: number;
}

declare interface IUpload3dTilesPayload {
  category: String;
  status: Boolean;
  center_x: number;
  center_y: number;
  file: any;
}
