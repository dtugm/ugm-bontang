import type { VDataTable } from "vuetify/components";
import appService from "~/app/service/app.service";
import stringHelper from "~/app/helper/string.helper";
import { useToast } from "vue-toastification";
// type ReadonlyHeaders = VDataTable['$props']['headers']
type TVDataTable = VDataTable["$props"];

export const useTableData = <TItem, IMinimalFilter>(
  headers: any[],
  apiGet: any,
  filterData: Partial<IMinimalFilter> = {
    limit: 10,
  } as IMinimalFilter
  // defaultOrderBy = 'id',
  // defaultOrderType = 'desc',
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

  function _setSearchables(meta_data: IMetaData) {
    if (meta_data) {
      tableData.value.searchable_columns = meta_data.searchable_columns.map(
        (key) => {
          const header = tableData.value.headers?.find(
            (header) => header.value == key
          );
          return header?.title || stringHelper.titleCase(key);
        }
      );
    }
  }

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

  function _setTableOrderables(meta_data: IMetaData) {
    if (
      tableData.value.serverItems.length == 0 &&
      meta_data?.orderable_columns
    ) {
      const orderable_columns = meta_data?.orderable_columns;
      tableData.value.headers = tableData.value.headers?.map((obj: any) => ({
        ...obj,
        sortable: orderable_columns.includes(obj.key),
      }));
    }
  }

  async function getData(props: ITableProps) {
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
      // defaultOrderBy, //future development
      // defaultOrderType,
    );
    try {
      const resp: IResponsePaginate = await apiGet(params);
      _setTableOrderables(resp.meta_data);
      _setTableItems(resp.data);
      _setSearchables(resp.meta_data);

      tableData.value.totalItems = resp.recordsFiltered;
      tableData.value.loading = false;
    } catch (error: any) {
      const $toast = useToast();
      $toast.error("Couldn't load the data, Please try again later");

      tableData.value.loading = false;
    }
  }
  async function getDataMobile(props: ITableProps) {
    if (props) {
      tableProps.value = { ...tableProps.value, ...props };
      tableData.value.loading = true;
    } else {
      tableProps.value.itemsPerPage = 10;
      tableProps.value.page = 1;
    }

    const params = appService.getParams(
      filterData,
      tableData.value?.search,
      tableProps.value
      // defaultOrderBy, //future development
      // defaultOrderType,
    );
    try {
      const resp: IResponsePaginate = await apiGet(params);
      _setTableOrderables(resp.meta_data);
      _setTableItems(resp.data);
      _setSearchables(resp.meta_data);

      tableData.value.totalItems = resp.recordsFiltered;
      tableData.value.loading = false;
    } catch (error: any) {
      const $toast = useToast();
      $toast.error("Couldn't load the data, Please try again later");

      tableData.value.loading = false;
    }
  }

  //   const debounceSearchData = useDebounceFn((val: string) => {
  //     getData({ ...tableProps.value, itemsPerPage: 10, page: 1, search: val });
  //   }, 1000);
  return {
    filterData,
    tableProps,
    tableData,
    getData,
    // debounceSearchData,
    getDataMobile,
  };
};
