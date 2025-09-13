import { UploadApiResponse } from "cloudinary";

export interface UploadStrategy {
  upload(file: Express.Multer.File): Promise<UploadApiResponse | string>;
}
