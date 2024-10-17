import { post } from '@/utils/request';

// 添加租户
export const createTenant = (params = {}) =>
  post('/api/foundation/operator/tenant/create', params);

// 注册账号
export const register = (params = {}) =>
  post('/api/foundation/operator/manage-account/register', params);

// 创建渠道
export const createChannel = (params = {}) =>
  post('/api/foundation/operator/terminal/create', params);

// 编辑租户
export const editTenant = (params = {}) =>
  post('/api/foundation/operator/tenant/update-tenant-and-his', params);

// 获取租户下面的医院
export const fectHisList = (params = {}) =>
  post('/api/foundation/operator/tenant/his-list', params);

// 获取渠道code
export const getChannelCode = (params = {}) =>
  post('/api/foundation/operator/terminal/get-by-tenant-id', params);

// 获取租户管理员账号
export const getTenantAccount = (params = {}) =>
  post('/api/foundation/operator/manage-account/tenant-admin', params);
