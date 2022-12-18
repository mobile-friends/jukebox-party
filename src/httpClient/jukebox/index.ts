import axios, { AxiosRequestConfig } from 'axios';
import { ApiResponse, ApiResult } from '@common/infrastructure/types';

interface JukeboxClient {
  get<TResult extends ApiResult>(
    url: string,
    token?: string
  ): Promise<ApiResponse<TResult>>;

  post<TData, TResult extends ApiResult>(
    url: string,
    data: TData,
    token?: string
  ): Promise<ApiResponse<TResult>>;

  put<TData, TResult extends ApiResult>(
    url: string,
    data: TData,
    token?: string
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

function makeConfig(token?: string): AxiosRequestConfig | undefined {
  return token === undefined
    ? undefined
    : {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
}

const jukeboxClient: JukeboxClient = {
  get<TResult extends ApiResult>(
    url: string,
    token?: string
  ): Promise<ApiResponse<TResult>> {
    const config = makeConfig(token);
    return axiosClient
      .get<ApiResponse<TResult>>(url, config)
      .then((it) => it.data);
  },
  post<TData, TResult extends ApiResult>(
    url: string,
    data: TData,
    token?: string
  ): Promise<ApiResponse<TResult>> {
    const config = makeConfig(token);
    return axiosClient
      .post<ApiResponse<TResult>>(url, data, config)
      .then((it) => it.data);
  },
  put<TData, TResult extends ApiResult>(
    url: string,
    data: TData,
    token?: string
  ): Promise<ApiResponse<TResult>> {
    const config = makeConfig(token);
    return axiosClient
      .put<ApiResponse<TResult>>(url, data, config)
      .then((it) => it.data);
  },
};

export { jukeboxClient };
