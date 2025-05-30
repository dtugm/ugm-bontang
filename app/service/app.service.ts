import stringHelper from "../helper/string.helper";

export default {
  getTitle(path = "") {
    const path_arr = path.split("/");
    let text = path_arr[path_arr.length - 1].replace(/-/gm, " ");
    text = stringHelper.removeQueryParams(text);

    if (text == "") {
      return "operation dashboard";
    }

    if (path_arr.length > 2) {
      const first = path_arr[path_arr.length - 2].replace(/-/gm, " ");
      let second = path_arr[path_arr.length - 1].replace(/-/gm, " ");
      second = stringHelper.removeQueryParams(second);
      text = `${first} - ${second}`;
    }

    return text;
  },
  getParams(
    filter: Partial<IMinimalFilter>,
    search: string | undefined,
    props: ITableProps,
    ordersBy: any = null,
    ordersType: any = null
  ) {
    filter.page = props.page;
    filter.pageSize = props.itemsPerPage;
    // filter.pageSize = props.itemsPerPage * props.page - props.itemsPerPage;
    if (search) {
      filter.keyword = search;
    } else {
      filter.keyword = props.search || null;
    }
    if (props.sortBy?.length) {
      filter.ordersBy = props.sortBy.map((e) => e.key);
      filter.ordersType = props.sortBy.map((e) => e.order);
    } else {
      filter.ordersBy = ordersBy;
      filter.ordersType = ordersType;
    }
    return filter;
  },
  setResult(tableData: any, data: globalThis.Ref) {
    tableData.serverItems = data.value?.result || [];
    tableData.totalItems = data.value?.total || 0;
  },
};
