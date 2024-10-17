import { post } from '@/utils/request';

// 查询医院
export const fetchHis = (params = {}) =>
  post('/api/foundation/operator/his/simple-page', params);

// 判断医院是否已经绑定租户
export const verify = (params = {}) =>
  post('/api/foundation/operator/tenant/verify-his', params);
