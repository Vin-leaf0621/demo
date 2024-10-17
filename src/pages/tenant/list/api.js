import { post } from '@/utils/request';

// 分页查询租户
export const fetchList = (params = {}) =>
  post('/api/foundation/operator/tenant/paging', params);

// 删除租户
export const deleteTenant = (params = {}) =>
  post('/api/foundation/operator/tenant/del', params);
