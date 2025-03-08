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
