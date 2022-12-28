import axios from 'axios';
import { ApiResponse, ApiResult } from '@common/infrastructure/types';

interface JukeboxClient {
  get<TResult extends ApiResult>(url: string): Promise<ApiResponse<TResult>>;

  post<TData, TResult extends ApiResult>(
    url: string,
    data: TData
  ): Promise<ApiResponse<TResult>>;

  put<TData, TResult extends ApiResult>(
    url: string,
    data: TData
  ): Promise<ApiResponse<TResult>>;
}

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/api/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  validateStatus: () => true,
});

const jukeboxClient: JukeboxClient = {
  get<TResult extends ApiResult>(url: string): Promise<ApiResponse<TResult>> {
    return axiosClient.get<ApiResponse<TResult>>(url).then((it) => it.data);
  },
  post<TData, TResult extends ApiResult>(
    url: string,
    data: TData
  ): Promise<ApiResponse<TResult>> {
    return axiosClient
      .post<ApiResponse<TResult>>(url, data)
      .then((it) => it.data);
  },
  put<TData, TResult extends ApiResult>(
    url: string,
    data: TData
  ): Promise<ApiResponse<TResult>> {
    return axiosClient
      .put<ApiResponse<TResult>>(url, data)
      .then((it) => it.data);
  },
};

export { jukeboxClient };
