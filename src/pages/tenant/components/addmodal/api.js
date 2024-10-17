import { get, post } from '@/utils/request';

// 添加医院
export const addHis = (params = {}) =>
  post('/api/foundation/operator/his/add', params);

// 获取字典信息
export const getDict = (params = {}) =>
  post('/api/foundation/operator/dict/get', params);
