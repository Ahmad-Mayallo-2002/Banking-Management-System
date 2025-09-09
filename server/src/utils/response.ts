import { Response } from 'express';
import { BaseResponse } from '../interfaces/base-response.interface';
import { Pagination } from '../interfaces/pagination.interface';

function sendResponse<T>(
  statusCode: number,
  message: string,
  data: T,
  res: Response,
  pagination: Pagination = {
    prev: false,
    next: false,
    totalPages: 0,
    currentPage: 0,
  },
) {
  const response: BaseResponse<T> = {
    statusCode,
    message,
    data,
    pagination,
  };

  return res.status(statusCode).json(response);
}

export default sendResponse;
