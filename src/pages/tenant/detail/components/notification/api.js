import { post } from '@/utils/request';

// 移动终端列表查询
export const fetchTerminalList = (params = {}) =>
  post('/api/foundation/operator/tenant/terminal/query-mob-list', params);

// 查询通知场景列表
export const fetchList = (params = {}) =>
  post('/api/foundation/operator/business/notice/query-list', params);

// 查询模板内容
export const fetchTemplateDetail = (params = {}) =>
  post('/api/foundation/operator/business/notice/query-by-id', params);

// 查询消息模板列表
export const fetchMsgTemplateList = (params = {}) =>
  post(
    '/api/foundation/operator/business/notice/query-templates-by-terminal-id',
    params,
  );

// 查询消息类型列表
export const fetchMsgTypeList = (params = {}) =>
  post('/api/foundation/operator/business/notice/get-msg-types', params);

// 保存通知内容
export const saveConfig = (params = {}) =>
  post('/api/foundation/operator/business/notice/template-save', params);

// 删除配置
export const deleteConfig = (params = {}) =>
  post('/api/foundation/operator/business/notice/template-del', params);

// 查询租户短信配置平台
export const fetchSmsPlant = (params = {}) =>
  post('/api/foundation/operator/business/notice/get-tenant-sms-plat', params);

// 配置短信平台
export const setSmsPlant = (params = {}) =>
  post('/api/foundation/operator/business/notice/set-sms-plat', params);

// 删除短信平台
export const deleteSmsPlat = (params = {}) =>
  post('/api/foundation/operator/business/notice/del-sms-plat', params);
