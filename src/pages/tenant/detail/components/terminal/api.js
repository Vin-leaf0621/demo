import { post } from '@/utils/request';

// 添加移动终端
export const addTerminal = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/mob/add', params);

// 编辑移动端
export const editTerminal = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/mob/edit', params);

// 删除移动终端
export const deleteTerminal = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/mob/del', params);

// 移动终端列表查询
export const fetchList = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/query-mob-list', params);

// 移动终端详情
export const fetchMobileDetail = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/mob/get', params);

// PC终端查询
export const fetchPCDetail = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/pc/get', params);

// PC终端保存
export const savePCTerminal = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/pc/save', params);

// 发送短信验证码
export const sendSmsCode = (params = {}) =>
  post('/api/foundation/operator/manage-account/sms-code', params);

// 注册账号
export const register = (params = {}) =>
  post('/api/foundation/operator/manage-account/register', params);

// 获取租户管理员账号
export const getTenantAccount = (params = {}) =>
  post('/api/foundation/operator/manage-account/tenant-admin', params);
