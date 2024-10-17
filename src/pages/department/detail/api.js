import { post } from '@/utils/request';

// 添加科室
export const addDept = (params = {}) =>
  post('/api/foundation/manage/dept/add', params);

// 编辑科室
export const editDept = (params = {}) =>
  post('/api/foundation/manage/dept/modify', params);

// 获取科室信息
export const queryDetail = (params = {}) =>
  post('/api/foundation/manage/dept/get-dept-info', params);
