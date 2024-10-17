import lessToJs from 'less-vars-to-js';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'umi';

import routes from './routes';

const themePath = path.join(__dirname, '../src/resources/styles/theme.less');
const theme = lessToJs(fs.readFileSync(themePath, 'utf8'));

/**
 * 默认配置
 */
export default defineConfig({
  theme: {
    ...theme,
  },
  hash: true,
  history: { type: 'hash' },
  codeSplitting: {
    jsStrategy: 'granularChunks',
  },
  favicons: [],
  routes,
  mfsu: {
    mfName: 'mf',
    strategy: 'normal',
  },

  // 插件
  dva: {},
  access: {},
  initialState: {},
  model: {},
  antd: {
    import: false,
    configProvider: {
      theme: {
        token: {
          colorPrimary: theme['@primary-color'],
        },
      },
    },
  },
  layout: {},
});
