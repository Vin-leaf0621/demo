import { post } from '@/utils/request';

export const getProvinceCity = (params = {}) =>
  post('/api/foundation/operator/district/get', params);
