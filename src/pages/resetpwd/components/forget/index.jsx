import { useState, useCallback, useMemo } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useCountDown } from 'ahooks';
import { redirectToClient } from '@/services/login';
import { regExPassword, mobileRegExp } from '@/utils/validate';
import * as Api from '../../api';
import ss from './index.less';

const DEFAULT_COUNT_TIME = 60 * 1000;

const Forget = () => {
  const [form] = Form.useForm();
  const [leftTime, setLeftTime] = useState(0);

  // 发送验证码，开始倒计时
  const sendValidateCode = useCallback(async () => {
    const { mobile } = await form.validateFields([
      'mobile',
      'password',
      'confirmPwd',
    ]);
    const { needTip, tip = '' } = await Api.smsCode({
      mobile,
    });
    setLeftTime(DEFAULT_COUNT_TIME);
    if (needTip) {
      message.warning(tip, 1.5);
    } else {
      message.success(
        {
          content: '发送成功',
        },
        1.5,
      );
    }
  }, []);

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

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      try {
        const { confirmPwd, mobile, ...restParams } = values;
        await Api.setUpNewPwd({
          userName: mobile,
          ...restParams,
        });
        message.success('密码修改成功！', 1.5, () => {
          redirectToClient();
        });
      } catch (error) {}
    });
  };

  return (
    <div className={ss.forget}>
      <div className={ss.header}>设置新密码</div>
      <div className={ss.form}>
        <Form form={form} validateTrigger="onBlur">
          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: mobileRegExp, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="手机号" maxLength={11} />
          </Form.Item>

          <Form.Item
            style={{ marginBottom: '32px' }}
            name="password"
            help="8~18位字母、数字、特殊字符组合"
            rules={[
              { required: true, message: '请输入新密码' },
              {
                pattern: regExPassword,
                message: '请输入8~18位字母、数字、特殊字符组合',
              },
            ]}
          >
            <Input.Password placeholder="输入新密码" />
          </Form.Item>

          <Form.Item
            name="confirmPwd"
            rules={[
              { required: true, message: '请输入确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次密码输入不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="确认新密码" />
          </Form.Item>

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

          <div className={ss.btns}>
            <Button className={ss.backBtn} onClick={() => history.back()}>
              返回
            </Button>
            <Button type="primay" className={ss.okBtn} onClick={handleSubmit}>
              确定
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Forget;
