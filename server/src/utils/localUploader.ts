import { writeFile } from 'fs';
import { join } from 'path';

export class LocalUploader {
  constructor() {}

  public async upload(file: Express.Multer.File): Promise<string> {
    try {
      const folderPath = join(__dirname, '/images');
      const fileName = Date.now() + '-' + file.originalname;
      const filePath = join(folderPath, fileName);
      writeFile(filePath, file.buffer, err => {
        if (err) console.log(err);
      });
      return filePath;
    } catch (error: any) {
      console.log(error);
      return error.message;
    }
  }
}
