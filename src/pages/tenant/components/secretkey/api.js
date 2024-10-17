import { post } from '@/utils/request';

export const generateSecret = (params = {}) =>
  post('/api/foundation/operator/tenant/generate-secret', params);
