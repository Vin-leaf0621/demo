import { message } from 'antd';
import { get, post, upload, use } from '@haici/request';
import { error, loading, objectFilter } from '@haici/request-filter';

import { BizError, AuthError, HttpError } from '@/utils/request/error';
import { redirectToLogin } from '@/utils/request/utils';

let hideLoading = null;

objectFilter.init({
  filterValue: [null, undefined],
});

// 请求前设置
use.setRequestBefore((reqData) => {
  const newReqData = { ...reqData };

  // 业务异常提示配置，默认为 true
  if (newReqData.options.showError === undefined) {
    newReqData.options.showError = true;
  }

  return newReqData;
});

error.init({
  authError: (_, { requestData, originalResponseData: { data = {} } }) => {
    redirectToLogin();
    throw new AuthError(data.msg);
  },
  bizError: (_, { requestData, originalResponseData: { data = {} } }) => {
    const { msg = '服务器出小差了，请稍后再试', code } = data;
    if (requestData?.options?.showError) {
      message.error(msg, 2);
    }
    throw new BizError(code, msg);
  },
  httpError: (err) => {
    message.error('服务器出小差了，请稍后再试', 2);
    throw new HttpError(err.statusCode, err.errMsg);
  },
  // 格式化响应数据
  formatResponseResult: (resData) => {
    return resData?.data?.data;
  },
});

// 加载中
loading.init({
  defaultLoading: true,
  loadingCallBack: ({ queue }) => {
    if (queue.size && !hideLoading) {
      hideLoading = message.loading({
        content: '加载中',
        duration: 0,
        key: 'REQUEST_LOADING',
      });
      return;
    }

    if (!queue.size && hideLoading) {
      hideLoading();
      hideLoading = null;
    }
  },
});

export { get, post, upload };
