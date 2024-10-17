import { post } from '@/utils/request';

export const login = (params = {}) =>
  post('/oauth2/manage/pc/token/login', params);

export const smsCode = (params = {}) =>
  post('/oauth2/manage/pc/login/sms-code', params, {
    sign: 'u7fvY5D56!KW6pfhj!*u@RE0QtihJr2q', // 需要签名
  });
