import { get, post } from '@/utils/request';

export const getDept = (params = {}) =>
  get('/api/foundation/manage/standard/dept/get-all-tree', params);
