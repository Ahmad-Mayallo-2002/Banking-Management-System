import { UploadApiResponse, v2 } from "cloudinary";
import { config } from "dotenv";

config();

v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<UploadApiResponse> {
  return await new Promise((resolve, reject) => {
    const stream = v2.uploader.upload_stream(
      { folder: "bank" },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result);
      },
    );

    stream.end(file.buffer);
  });
}

export default uploadToCloudinary;
