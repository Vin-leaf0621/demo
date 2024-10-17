import { ossConvertUrl, ossSignUrl } from '@/services/upload';
import { upload } from '@/utils/request';

export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadApi = (file) => {
  return upload('', file, {
    uploadType: 'oss',
    getSignApi: ossSignUrl,
    convertUrlApi: ossConvertUrl,
    expireSeconds: 365 * 24 * 60 * 60 * 100,
  });
};
