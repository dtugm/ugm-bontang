declare interface IGetVectorsParams {
  category: string;
}

declare interface IVectorsItems {
  category: string;
  createdAt: string;
  description: string;
  digitizationMonitoringItem: string;
  filename: string;
  id: string;
  isActive: boolean;
  name: string;
  organization: any;
  type: string;
  updatedAt: string;
  url: string;
}

declare interface IUploadVectorsPayload {
  name: string | null;
  // lod: 0,
  category: string | null;
  status: boolean;
  type: string | null;
  file: any;
}
