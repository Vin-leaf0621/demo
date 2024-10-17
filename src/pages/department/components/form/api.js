import { post } from '@/utils/request';

// 获取推荐科室
export const getRecommendDept = (params = {}) =>
  post('/api/foundation/manage/standard/dept/get', params);

// 获取科室树
export const fetchDepts = (params = {}) =>
  post('/api/foundation/manage/dept/get-tree', params);
