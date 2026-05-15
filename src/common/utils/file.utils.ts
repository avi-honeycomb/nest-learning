import { extname } from 'node:path';

import { diskStorage } from 'multer';

import { DEFAULT_FILE_SIZE } from '@/common/constants/file.constants';

export type UploadOptions = {
  folder: string;
  prefix?: string;
  maxSize?: number;
};

export const generateFileName = (
  file: Express.Multer.File,
  prefix?: string,
): string => {
  const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1_000_000)}`;
  const ext = extname(file.originalname);

  return prefix ? `${prefix}-${uniqueSuffix}${ext}` : `${uniqueSuffix}${ext}`;
};

export const getFileSizeInMB = (bytes: number): number => {
  return Number((bytes / (1024 * 1024)).toFixed(2));
};

export const createMulterOptions = (options: UploadOptions) => {
  const { folder, prefix, maxSize = DEFAULT_FILE_SIZE } = options;

  return {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = folder ? `./uploads/${folder}` : `./uploads`;
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        cb(null, generateFileName(file, prefix));
      },
    }),

    limits: {
      fileSize: maxSize,
    },
  };
};

export const buildFileUrl = (path?: string | null) => {
  if (!path) return null;

  const baseUrl = process.env.APP_BASE_URL || 'http://localhost:6200';
  return `${baseUrl}${path}`;
};
