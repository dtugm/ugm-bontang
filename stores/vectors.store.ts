import { collection, doc, setDoc } from "firebase/firestore";
import { useToast } from "vue-toastification";
import vectorsApi from "~/app/api/vectors.api";
const toast = useToast();
export const useVectorsStore = defineStore("vectors", () => {
  const geoJsonItems = ref([]);
  const getAllGeoJson = async () => {
    // const formData = new FormData();
    // formData.append("data", JSON.stringify(item));
    await vectorsApi.get_all_vectors().then((resp) => {
      geoJsonItems.value = resp;
    });
  };

  return {
    getAllGeoJson,
    geoJsonItems,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useVectorsStore, import.meta.hot));
}
