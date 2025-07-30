// Type User
declare interface IUserItemsType {
  email: String;
  firstName: String;
  groups: IGroupsItemsType[];
  id: String;
  lastName: String;
  organizations: any[];
  username: String;
}
declare interface IGroupsItemsType {
  description: String;
  id: String;
  name: String;
  organizationId: String;
  role: "MEMBER" | "ADMIN";
}
// Type untuk Register
declare interface IRegisterUserPayload {
  firstName: String;
  lastName: String;
  username: String;
  email: String;
  password: String;
}
declare interface IRegisterUserResponse {
  message: String;
  user: IUserRegisterType;
}
declare interface IUserRegisterType {
  id: String;
  token: String;
}

// Type untuk Login
declare interface IUserLoginPayload {
  email: String;
  password: String;
}
declare interface IUserLoginResponse {
  message: String;
  refreshToken: String;
  token: String;
  user: IUserItemsType;
}

// Type untuk RefreshToken
declare interface IRefreshTokenPayload {
  refreshToken: String;
}
declare interface IRefreshTokenResponse {
  message: String;
  refreshToken: String;
  token: String;
  user: IUserRefreshTokenType;
}
declare interface IUserRefreshTokenType {
  organizations: any[];
}

// Type untuk getAllUser
declare interface IGetAllUserResponse {
  message: String;
  user: IUserRegisterType;
}
declare interface IUserGetAllUserType {
  message: String;
  user: IUserItemsType;
}
