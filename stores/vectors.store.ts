import vectors2D from "~/app/api/view/vectors2D";
import vectorsConstant from "~/app/constant/vectors.constant";
import { apiWrapper } from "~/app/helper/api.helper";

export const useVectorsStore = defineStore("vectors", () => {
  const isFetchingData = ref(false);
  const vectorsItems: any = ref([]);
  const readVectors = reactive(
    useTableData<IVectorsItems, IGetVectorsParams>(
      [...vectorsConstant.table_vectors.headers!],
      vectors2D.get_vector
    )
  );

  const isUploading = ref(false);
  const addNewVector = async (payload: IUploadVectorsPayload) => {
    isUploading.value = true;
    await apiWrapper(() => vectors2D.create_vector(payload), {
      successMessage: "Berhasil menambah data vector!",
    });
    isUploading.value = false;
  };

  const isDeletingFile = ref(false);
  const deleteVectore = async (id: string) => {
    isDeletingFile.value = true;
    await apiWrapper(() => vectors2D.delete_vector({ id: id }), {
      successMessage: "Berhasil menghapus data!",
    });
    isDeletingFile.value = false;
  };

  const updateVectorsStatus = async (id: string, payload: any) => {
    isUploading.value = true;
    await apiWrapper(() => vectors2D.edit_vector({ id: id }, payload), {
      successMessage: "Berhasil mengubah status vector!",
    });
    isUploading.value = false;
  };

  return {
    readVectors,
    vectorsItems,

    deleteVectore,
    isFetchingData,

    addNewVector,

    isUploading,
    isDeletingFile,

    updateVectorsStatus,
  };
});
