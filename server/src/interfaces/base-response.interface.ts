import { Pagination } from './pagination.interface';

export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  pagination?: Pagination;
}
