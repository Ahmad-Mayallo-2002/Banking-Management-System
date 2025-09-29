import { UploadApiResponse } from 'cloudinary';
import { CloudinaryUploader } from './cloudinaryUpload';
import { UploadStrategy } from '../interfaces/uploader.interface';
import { LocalUploader } from './localUploader';

export class UploaderContext {
  private uploadStrategy: UploadStrategy;
  constructor() {
    this.uploadStrategy = this.uploadStrategy;
  }

  public async setStrategy<T extends 'cloudinary' | 'local'>(
    uploadStrategyType: T,
    file: Express.Multer.File,
  ): Promise<T extends 'cloudinary' ? UploadApiResponse : string> {
    if (uploadStrategyType === 'cloudinary') this.uploadStrategy = new CloudinaryUploader();
    if (uploadStrategyType === 'local') this.uploadStrategy = new LocalUploader();
    return (await this.performStrategy(file)) as T extends 'cloudinary'
      ? UploadApiResponse
      : string;
  }

  private async performStrategy(file: Express.Multer.File): Promise<UploadApiResponse | string> {
    return await this.uploadStrategy.upload(file);
  }
}
