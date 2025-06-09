declare interface ILoginPayload {
  email: string;
  password: string;
  username: string;
}
declare interface IUserInfoLogin {
  email: string;
  firstName: string;
  groups: any[];
  id: string;
  lastName: string;
  username: string;
}
declare interface IGroupInfo {
  description: string;
  name: string;
  groups: any[];
  id: string;
  role: string;
}
