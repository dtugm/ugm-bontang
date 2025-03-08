import { apiPostData } from "../helper";

const mainPath = "/users";

export default {
  login: async (payload: Partial<ILoginPayload>) => {
    return apiPostData(`${mainPath}/login`, payload);
  },
  register: async (payload: any) => {
    return apiPostData(`${mainPath}/register`, payload);
  },
};
