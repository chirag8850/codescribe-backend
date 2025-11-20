import { initCloudinary } from "../utils/cloudinary.config";


class UploadService {
    async uploadImage(fileBuffer: Buffer, fileName: string): Promise<string> {
        const cloudinary = initCloudinary();
        try {
            const url = await new Promise<string>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { 
                        resource_type: 'image', 
                        public_id: fileName, 
                        folder: 'codescribe',
                        format: 'webp',
                        transformation: [
                            {
                                width: 256,
                                height: 256,
                                crop: 'fill',
                                gravity: 'face',
                                format: 'webp'
                            }
                        ]
                    },
                    (error: any, result: any) => {
                        if (error) {
                            return reject(new Error('Cloudinary upload failed'));
                        }
                        if (!result) {
                            return reject(new Error('Cloudinary returned no result'));
                        }
                        resolve(result.secure_url || result.url || result.public_id);
                    }
                );
                stream.end(fileBuffer);
            });
            return url;
        } catch (error) {
            throw error;
        }
    }
}

export default new UploadService();