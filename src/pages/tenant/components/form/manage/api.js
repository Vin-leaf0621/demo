import { post } from '@/utils/request';

// 发送短信验证码
export const sendSmsCode = (params = {}) =>
  post('/api/foundation/operator/manage-account/sms-code', params);
