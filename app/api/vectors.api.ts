import {
  apiDeleteData,
  apiGetData,
  apiPostData,
  apiPutData,
  CustomFormData,
} from "../helper";
const mainPath = "/vectors";
export default {
  get_all_vectors: async (payload?: IGetVectors) => {
    return apiGetData(`${mainPath}?`, payload);
  },
  upload_vector: async (payload: IUploadVectors) => {
    return apiPostData(`${mainPath}`, payload, {
      "Content-Type": "multipart/form-data",
    });
  },
  //   put_lot_survey_monitorings: async (payload: any, id: string) => {
  //     return apiPutData(`${mainPath}/${id}`, payload, {
  //       "Content-Type": "multipart/form-data",
  //     });
  //   },
  delete_vector: async (id: string) => {
    return apiDeleteData(`${mainPath}/${id}`, {
      "Content-Type": "multipart/form-data",
    });
  },
};
