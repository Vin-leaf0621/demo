import { Button, Form, Input } from 'antd';
import { useMemo, useState, useCallback } from 'react';
import ss from './index.less';
import { useCountDown } from 'ahooks';
import * as Api from './api';
import md5 from 'md5';
import { MANAGE_CLIENT_DOMAIN_MAP } from '@/constants/common';
import { mobileRegExp } from '@/utils/validate';

const DEFAULT_COUNT_TIME = 60 * 1000;
const SECUREKEY = 'u7fvY5D56!KW6pfhj!*u@RE0QtihJr2q';

const ManageForm = ({ form, tenantInfo, disabled }) => {
  const [leftTime, setLeftTime] = useState(0);

  // 发送验证码，开始倒计时
  const sendValidateCode = useCallback(async () => {
    try {
      const { mobile } = await form.validateFields(['mobile']);
      const params = {
        tenantCode: tenantInfo?.tenant?.code,
        channelCode: tenantInfo?.channel?.code,
        mobile,
        timeStamp: String(Date.now()),
      };
      await Api.sendSmsCode({
        ...params,
        sign: md5(
          params.tenantCode +
            params.channelCode +
            params.mobile +
            params.timeStamp +
            SECUREKEY,
        ),
      });
      setLeftTime(DEFAULT_COUNT_TIME);
    } catch (error) {}
  }, [tenantInfo]);

  // 倒计时
  const [countdown] = useCountDown({
    leftTime,
    onEnd: () => {
      setLeftTime(0);
    },
  });

  // 处理倒数时间
  const countDownTime = useMemo(() => {
    return Math.ceil(countdown / 1000);
  }, [countdown]);

  return (
    <Form form={form}>
      <div className={`formGroup ${ss.verify}`}>
        <p className="formGroupTitle colon">登录地址</p>
        <p>{`${MANAGE_CLIENT_DOMAIN_MAP[environment]}/admin/${tenantInfo?.tenant?.code}`}</p>
      </div>

      <div className={`formGroup ${ss.account}`}>
        <p className="formGroupTitle colon">
          <span className="required">*</span>登录账号
        </p>
        <Form.Item
          name="mobile"
          rules={[
            { required: true, message: '请输入登录账号' },
            { pattern: mobileRegExp, message: '请输入正确的手机号' },
          ]}
        >
          <Input
            placeholder="请输入手机号"
            style={{ width: 216 }}
            disabled={disabled}
          />
        </Form.Item>

        <Button
          className={ss.codeBtn}
          onClick={sendValidateCode}
          disabled={!!countDownTime || disabled}
        >
          {!!countDownTime ? countDownTime + ' s' : '获取验证码'}
        </Button>
      </div>

      <div className={`formGroup ${ss.verify}`}>
        <p className="formGroupTitle colon">
          <span className="required">*</span>验证码
        </p>
        <Form.Item
          name="smsCode"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Input
            placeholder="请输入"
            style={{ width: 216 }}
            disabled={disabled}
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default ManageForm;
