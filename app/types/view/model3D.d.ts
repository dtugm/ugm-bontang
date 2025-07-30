declare interface IGet3DModelParams {
  category:
    | "building"
    | "road"
    | "vegetation"
    | "water_body"
    | "railway"
    | "landmark";
  status: boolean;
  lod: number;
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
