import { post } from '@/utils/request';
import { history } from 'umi';

export const redirectToLogin = () => {
  const { hash } = window.location;
  const path = hash.slice(1);
  if (path !== '/login') {
    history.replace('/login');
  }
};

export const redirectToClient = () => {
  const { hash } = window.location;
  const path = hash.slice(1);
  if (path !== '/client') {
    history.replace('/client');
  }
};

// 退出
export const logout = (data = {}) => post('/oauth2/manage/pc/logout', data);
