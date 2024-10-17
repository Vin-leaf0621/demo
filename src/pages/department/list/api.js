import { get, post } from '@/utils/request';

// 获取科室列表
export const fetchList = (params = {}) =>
  post('/api/foundation/manage/dept/page', params);

// 获取医院列表
export const fetchHospitals = (params = {}) =>
  get('/api/foundation/manage/hospital/page', params);

// 删除科室
export const deleteDept = (params = {}) =>
  post('/api/foundation/manage/dept/del', params);

// 编辑科室
export const editDept = (params = {}) =>
  post('/api/foundation/manage/dept/modify', params);

// 获取科室树
export const fetchDepts = (params = {}) =>
  post('/api/foundation/manage/dept/get-tree', params);

// 获取科室信息
export const queryDetail = (params = {}) =>
  post('/api/foundation/manage/dept/get-dept-info', params);

// 科室信息同步
export const syncDeptInfo = (params = {}) =>
  post('/api/foundation/manage/dept/sync', params);

// 排序
export const sortDept = (params = {}) =>
  post('/api/foundation/dept/modify/sort', params);
