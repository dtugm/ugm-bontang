import type { VDataTable } from "vuetify/components";
import appService from "~/app/service/app.service";
import { useToast } from "vue-toastification";
// type ReadonlyHeaders = VDataTable['$props']['headers']
type TVDataTable = VDataTable["$props"];

export const useTableData = <TItem, IMinimalFilter>(
  headers: any[],
  apiGet: any,
  filterData: Partial<IMinimalFilter> = {} as IMinimalFilter
) => {
  type TTableData = Partial<TVDataTable> & {
    totalItems: number;
    serverItems: TItem[];
    searchable_columns: string[];
  };
  const tableProps = ref<ITableProps>({} as ITableProps);

  const tableData = ref<TTableData>({
    itemsPerPage: 10,
    totalItems: 0,
    search: undefined,
    headers: [...headers!],
    loading: false,
    serverItems: <TItem[]>[],
    searchable_columns: [],
  });

  function _setTableItems(data: TItem[]) {
    tableData.value.serverItems = data.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach((key) => {
        filteredItem[key] =
          item[key] !== null && item[key] !== "" ? item[key] : "-";
      });
      return filteredItem;
    });
  }

  async function getData(props: ITableProps) {
    console.log(props);
    if (props) {
      tableProps.value = { ...props };
      tableData.value.loading = true;
    } else {
      tableProps.value.itemsPerPage = 10;
      tableProps.value.page = 1;
    }

    const params = appService.getParams(
      filterData,
      tableData.value?.search,
      tableProps.value
    );
    try {
      const resp: IResponsePaginate = await apiGet(params);
      _setTableItems(resp.data);

      tableData.value.totalItems = resp.totalDocuments;
      tableData.value.loading = false;
    } catch (error: any) {
      const $toast = useToast();
      $toast.error("Couldn't load the data, Please try again later");

      tableData.value.loading = false;
    }
  }

  return {
    filterData,
    tableProps,
    tableData,
    getData,
  };
};
