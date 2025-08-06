declare interface IDeleteGroupsParams {
  id: string;
}
declare interface IUploadGroupsParams {
  name: string | null;
  description: string | null;
}

declare interface IGroupsItemField {
  id: string;
  name: string;
  description: string;
  role: "MEMBER" | "LEADER";
}
