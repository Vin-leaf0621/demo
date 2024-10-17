import { Button, Form, Input, message } from 'antd';
import { useState, useCallback, useMemo } from 'react';
import { history } from '@umijs/max';
import { useCountDown, useLockFn } from 'ahooks';
import { mobileRegExp } from '@/utils/validate';
import { RESETPWD_TYPE } from '@/constants/common';
import { redirectToClient } from '@/services/login';
// import { LOGIN_TAB, LOGIN_TYPE } from '../../_data';
import * as Api from '../../api';
import ss from './index.less';

const DEFAULT_COUNT_TIME = 60 * 1000;

const Login = ({ setLoginType }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [leftTime, setLeftTime] = useState(0);
  // const phoneValue = Form.useWatch('phone', form);

  // 发送验证码，开始倒计时
  const sendValidateCode = useLockFn(async () => {
    try {
      const { userName: mobile } = await form.validateFields(['userName']);
      const { needTip, tip = '' } = await Api.smsCode({
        mobile,
      });
      setLeftTime(DEFAULT_COUNT_TIME);
      if (needTip) {
        message.warning(
          {
            content: tip,
          },
          1.5,
        );
      } else {
        message.success(
          {
            content: '发送成功',
          },
          1.5,
        );
      }
    } catch (error) {}
  });

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

  // 提交表单，登录
  const handleSubmit = async (values) => {
    const { userName, password, smsCode } = values;
    setLoading(true);
    try {
      const { settingPasswordType, flowId } = await Api.login({
        userName,
        password,
        smsCode,
      });
      if (settingPasswordType) {
        history.push(`/resetpwd?type=${settingPasswordType}&flowId=${flowId}`);
      } else {
        redirectToClient();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToRest = () => {
    history.push(`/resetpwd?type=${RESETPWD_TYPE.forget}`);
  };

  return (
    <div className={ss.login}>
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        validateTrigger="onBlur"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="userName"
          rules={[
            { required: true, message: '请输入您的手机号码' },
            { pattern: mobileRegExp, message: '请输入正确的手机号码' },
          ]}
        >
          <Input placeholder="手机号" maxLength={11} />
        </Form.Item>

        <div className={ss.password}>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password placeholder="密码" />
          </Form.Item>
        </div>

        <div className={ss.codeInput}>
          <Form.Item
            name="smsCode"
            rules={[{ required: true, message: '请输入短信验证码' }]}
          >
            <Input
              placeholder="手机验证码"
              suffix={
                <Button
                  type="link"
                  disabled={!!countDownTime}
                  onClick={sendValidateCode}
                >
                  {!!countDownTime ? countDownTime + ' s' : '获取验证码'}
                </Button>
              }
            />
          </Form.Item>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          className={ss.loginBtn}
          loading={loading}
        >
          登录
        </Button>

        <div className={ss.forget} onClick={handleToRest}>
          忘记密码?
        </div>
      </Form>
    </div>
  );
};

export default Login;
