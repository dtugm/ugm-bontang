declare interface IResponseAPI {
  status: string;
  msg: string;
  data: any;
}
declare interface IErrorAPI {
  message: string;
  error: string;
  statusCode: number;
}
declare interface ITableProps {
  page: number;
  itemsPerPage: number;
  sortBy?: any[];
  groupBy?: any[];
  search?: string | null;
}
declare interface IMinimalFilter {
  page: number | null;
  pageSize?: number | null;
  search?: string | null;
  ordersBy?: Array | null;
  ordersType?: Array | null;
}
declare interface IMetaData {
  searchable_columns: string[];
  orderable_columns: string[];
}
declare interface IResponsePaginate extends IResponseAPI {
  recordsTotal: number;
  recordsFiltered: number;
  totalDocuments: number;
  meta_data: IMetaData;
}
