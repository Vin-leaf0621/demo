import { post } from '@/utils/request';

/* TODO: 测试代码 */
export const getAccount = (params = {}) => post('/api/getAccount', params);
