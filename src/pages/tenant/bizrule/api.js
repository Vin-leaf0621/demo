import { post } from '@/utils/request';

// 获取业务规则详情
export const getBizRule = (params = {}) =>
  post('/api/foundation/operator/business/metadata/get', params);

// 业务规则配置情况
export const getProfile = (params = {}) =>
  post('/api/foundation/operator/tenant/his/business/profile/get', params);

// 保存
export const save = (params = {}) =>
  post('/api/foundation/operator/tenant/his/business/profile/save', params);

// 保存并上线
export const saveOnline = (params = {}) =>
  post(
    '/api/foundation/operator/tenant/his/business/profile/save-online',
    params,
  );
