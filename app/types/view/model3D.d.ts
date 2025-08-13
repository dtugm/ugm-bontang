declare interface IGet3DModelParams {
  category:
    | "building"
    | "road"
    | "vegetation"
    | "water_body"
    | "railway"
    | "landmark";
  status?: boolean;
  lod?: number;
  clamp?: "DTM_BONTANG" | "MEAN_SEA_LEVEL";
  texture?: boolean;
  source?: "CESIUM" | "AWS";
}

declare interface ICreate3DModelPayload {
  center_x: string;
  center_y: string;
  category:
    | "building"
    | "road"
    | "vegetation"
    | "water_body"
    | "railway"
    | "landmark";
  name: string;
  lod: number;
  file: any;
}
