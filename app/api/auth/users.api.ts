import { apiGetData, apiPostData } from "~/app/axios/axiosBearer";

const mainPath = "/users";

export default {
  register_user: async (payload: IRegisterUserPayload) => {
    return apiPostData<IRegisterUserResponse>(`${mainPath}/register`, payload);
  },
  user_login: async (payload: IUserLoginPayload) => {
    return apiPostData<IUserLoginResponse>(`${mainPath}/login`, payload);
  },
  refresh_token: async (payload: IRefreshTokenPayload) => {
    return apiPostData<IRefreshTokenResponse>(
      `${mainPath}/refresh-token`,
      payload
    );
  },
  edit_user: async () => {
    return apiGetData(`${mainPath}`);
  },
  get_all_users: async () => {
    return apiGetData<IGetAllUserResponse>(`${mainPath}`);
  },
  get_current_user: async () => {
    return apiGetData(`${mainPath}`);
  },
};
