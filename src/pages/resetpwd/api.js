import { post } from '@/utils/request';

// 设置密码
export const setUpPwd = (params = {}) =>
  post('/oauth2/manage/pc/login/set-up-password', params);

// 修改密码
export const modifyPwd = (params = {}) =>
  post('/api/foundation/manage/user/modify-password', params);

// 设置新密码
export const setUpNewPwd = (params = {}) =>
  post('/oauth2/manage/pc/login/set-up-new-password', params);

export const smsCode = (params = {}) =>
  post('/oauth2/manage/pc/login/sms-code', params, {
    sign: 'u7fvY5D56!KW6pfhj!*u@RE0QtihJr2q', // 需要签名
  });
