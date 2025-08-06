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

  const deleteVectore = async (id: string) => {
    await apiWrapper(() => vectors2D.delete_vector({ id: id }), {
      successMessage: "Berhasil menghapus data!",
    });
  };

  return {
    readVectors,
    vectorsItems,

    deleteVectore,
    isFetchingData,
  };
});
