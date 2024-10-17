import { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { history } from '@umijs/max';
import { RESETPWD_TYPE } from '@/constants/common';
import * as Api from '../../api';
import ss from './index.less';
import { redirectToLogin, redirectToClient } from '@/services/login';
import { regExPassword } from '@/utils/validate';

const TITLE_MAP = {
  [RESETPWD_TYPE.firstLogin]: '首次登录成功，请设置新密码',
  [RESETPWD_TYPE.expire]: '登录成功，超3个月需重置密码',
  [RESETPWD_TYPE.reset]: '请设置新密码',
  [RESETPWD_TYPE.modify]: '修改密码',
};

const Reset = ({ type, flowId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      // 修改密码
      if (type === RESETPWD_TYPE.modify) {
        handleModify(values);
        return;
      }

      setLoading(true);
      try {
        const { confirmPwd, ...restParams } = values;
        await Api.setUpPwd({
          ...restParams,
          flowId,
        });
        message.success('密码设置成功！', 1.5, () => {
          if (type === RESETPWD_TYPE.reset) {
            redirectToLogin();
          } else {
            redirectToClient();
          }
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    });
  };

  const handleModify = async (values) => {
    setLoading(true);
    try {
      const { confirmPwd, ...restParams } = values;
      await Api.modifyPwd({
        ...restParams,
      });
      message.success('密码修改成功！', 1.5, () => {
        history.back();
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={ss.firstLogin}>
      <div className={ss.header}>{TITLE_MAP[type]}</div>
      <div className={ss.form}>
        <Form form={form} validateTrigger="onBlur">
          <Form.Item
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="输入原密码" />
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
            dependencies={['password']}
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

          <div className={ss.btns}>
            <Button
              className={ss.backBtn}
              onClick={() => history.back()}
              loading={loading}
            >
              返回
            </Button>
            <Button
              type="primay"
              className={ss.okBtn}
              onClick={handleSubmit}
              loading={loading}
            >
              确定
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Reset;
