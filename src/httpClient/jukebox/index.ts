import axios from 'axios';
import { ApiResponse } from '@common/apiResponse';
import { Dto } from '@common/types/dto';
import { ApiError } from 'next/dist/server/api-utils';

interface JukeboxClient {
  get<TResponse extends ApiResponse<Dto | ApiError>>(
    url: string,
    token?: string
  ): Promise<TResponse>;

  post<TData extends Dto, TResponse extends ApiResponse<Dto | ApiError>>(
    url: string,
    data?: TData
  ): Promise<TResponse>;

  put<TData extends Dto, TResponse extends ApiResponse<Dto | ApiError>>(
    url: string,
    data?: TData
  ): Promise<TResponse>;
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
  get<TResponse extends ApiResponse<Dto | ApiError>>(
    url: string,
    token?: string
  ): Promise<TResponse> {
    const config =
      token === undefined
        ? undefined
        : {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };
    return axiosClient.get<TResponse>(url, config).then((it) => it.data);
  },
  post<TData extends Dto, TResponse extends ApiResponse<Dto | ApiError>>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return axiosClient.post<TResponse>(url, data).then((it) => it.data);
  },
  put<TData extends Dto, TResponse extends ApiResponse<Dto | ApiError>>(
    url: string,
    data?: TData
  ): Promise<TResponse> {
    return axiosClient.put<TResponse>(url, data).then((it) => it.data);
  },
};

export { jukeboxClient };
