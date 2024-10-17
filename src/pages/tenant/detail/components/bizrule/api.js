import { post } from '@/utils/request';

// 获取租户下面的医院
export const fectHisList = (params = {}) =>
  post('/api/foundation/operator/tenant/his-list', params);

// 获取租户医院的业务
export const fetchBusinessList = (params = {}) =>
  post('/api/foundation/operator/tenant/business/get', params);

// 添加业务
export const addBusiness = (params = {}) =>
  post('/api/foundation/operator/tenant/business/create', params);

// 复制他院业务配置
export const copyBusiness = (params = {}) =>
  post('/api/foundation/operator/tenant/business/copy', params);

// 删除业务
export const deleteBusiness = (params = {}) =>
  post('/api/foundation/operator/tenant/business/del', params);

// 批量上线
export const onlineBusiness = (params = {}) =>
  post('/api/foundation/operator/tenant/business/batch/online', params);

// 批量下线
export const offlineBusiness = (params = {}) =>
  post('/api/foundation/operator/tenant/business/batch/offline', params);

// 获取可配置业务
export const fetchBusiness = (params = {}) =>
  post('/api/foundation/operator/business/paging', params);

// 获取他院已上线业务
export const getOtherBusiness = (params = {}) =>
  post('/api/foundation/operator/his/business/get', params);
