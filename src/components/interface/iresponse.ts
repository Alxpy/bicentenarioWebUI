export interface mesageResponse {
    success: boolean;
    mesage: string;
    token: string;
  }

  export interface IApiResponse {
    success: boolean;
    message: string;
    status: number;
    data: any;
}