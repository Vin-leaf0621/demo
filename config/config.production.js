/**
 * 生产配置
 */
import { defineConfig } from 'umi';
import { GIT_GROUP_NAME, GIT_PROJECT_NAME } from './constants';

export default defineConfig({
  define: {
    environment: 'prod',
  },
  publicPath:
    process.env.NODE_ENV === 'development'
      ? './'
      : `https://static.haici.com/${GIT_GROUP_NAME}/${GIT_PROJECT_NAME}/`,
});
