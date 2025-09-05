import { Pagination } from './pagination';

export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  pagination?: Pagination;
}
