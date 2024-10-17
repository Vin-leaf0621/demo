import { history } from 'umi';

export const redirectToLogin = () => {
  const { hash } = window.location;
  const path = hash.slice(1);
  if (path !== '/login') {
    history.replace('/login');
  }
};
