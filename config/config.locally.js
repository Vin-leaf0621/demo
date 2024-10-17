/**
 * 本地环境配置
 */
import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    environment: 'dev',
  },
  proxy: {
    /* TODO: 修改代码 */
    // '/api': {
    //   target: '',
    //   changeOrigin: true,
    // },
  },
});
