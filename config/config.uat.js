/**
 * 测试环境配置
 */
import { defineConfig } from 'umi';
import { GIT_GROUP_NAME, GIT_PROJECT_NAME } from './constants';

export default defineConfig({
  define: {
    environment: 'uat',
  },
  publicPath:
    process.env.NODE_ENV === 'development'
      ? './'
      : `https://ustatic.haici.com/${GIT_GROUP_NAME}/${GIT_PROJECT_NAME}/`,
});
