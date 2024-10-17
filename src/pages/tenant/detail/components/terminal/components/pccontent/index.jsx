import { Form, Input, Button, App } from 'antd';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useCountDown } from 'ahooks';
import { keyBy } from 'lodash';
import md5 from 'md5';
import Permissiontable from '@/components/table/permissiontable';
import Icon from '@/components/icon';
import { PC_TERMINAL_KEY } from '@/pages/tenant/detail/_data';
import { mobileRegExp } from '@/utils/validate';
import { copyText } from '@/utils/utils';
import Footer from '../../../footer';
import ss from './index.less';

import * as Api from '../../api';

const DEFAULT_COUNT_TIME = 60 * 1000;
const SECUREKEY = 'u7fvY5D56!KW6pfhj!*u@RE0QtihJr2q';

const PCContent = ({
  activeKey,
  tenantCode,
  tenantId,
  setEmpty,
  mobile,
  setTab,
}) => {
  const [form] = Form.useForm();
  const { modal, message } = App.useApp();
  const [leftTime, setLeftTime] = useState(0);
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);

  const formatResources = (res) => {
    const resourcesMap = keyBy(res, 'id');
    const resourcesList = Object.values(resourcesMap);
    resourcesList.forEach((item) => {
      if (item?.parentId && resourcesMap[item.parentId]) {
        const { children } = resourcesMap[item.parentId];
        if (Array.isArray(children)) {
          children.push(item);
        } else {
          resourcesMap[item.parentId].children = [item];
        }
      }
    });

    return resourcesList.filter((item) => !item.parentId);
  };

  // 查询PC终端
  const fetchList = async () => {
    try {
      const res = await Api.fetchPCDetail({
        tenantId,
        userTerminal: activeKey,
      });

      setDetail({
        ...res,
        resourcesList: formatResources(res?.resources || []),
      });
    } catch (error) {
      setEmpty(true);
    } finally {
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // 发送验证码，开始倒计时
  const sendValidateCode = useCallback(async () => {
    try {
      const { mobile } = await form.validateFields(['mobile']);
      const params = {
        tenantCode: tenantCode,
        terminalCode: 'empty_terminal_code',
        mobile,
        timeStamp: String(Date.now()),
      };
      await Api.sendSmsCode({
        ...params,
        sign: md5(
          params.tenantCode +
            params.terminalCode +
            params.mobile +
            params.timeStamp +
            SECUREKEY,
        ),
      });
      setLeftTime(DEFAULT_COUNT_TIME);
    } catch (error) {}
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

  const handleCopy = async (password) => {
    await copyText(password);
    message.success('复制成功');
  };

  const handleSavePerimission = async (accountId, isContinue) => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        const { resourceIds } = values;
        const params = {
          channel: 'PC',
          userTerminal: activeKey,
          resourceIds,
          id: detail?.id,
          tenantId,
          accountId,
        };

        await Api.savePCTerminal(params);

        message.success('保存成功！', 1.5, async () => {
          // if (!mobile) {
          //   await submitMobile();
          // }
          // fetchList();
          if (isContinue) {
            setTab((pre) => pre + 1);
          } else {
            history.back();
          }
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    });
  };

  // 保存
  const handleSave = (isContinue) => {
    form.validateFields().then(async (values) => {
      setLoading(true);

      if (mobile) {
        handleSavePerimission(undefined, isContinue);
        return;
      }

      try {
        const { mobile, smsCode } = values;

        const accountParams = {
          tenantCode: tenantCode,
          terminalCode: 'empty_terminal_code',
          userName: mobile,
          smsCode: smsCode,
        };
        const { password, accountId } = await Api.register(accountParams);
        modal.success({
          title: '添加成功，请保存初始密码',
          content: (
            <div>
              <span
                className={ss.password}
                onClick={() => handleCopy(password)}
              >
                账号初始密码为{password}
              </span>
              ，请复制保存，首次登录成功需修改初始密码
            </div>
          ),
          icon: <Icon type="icon-zhengque-shixin" className={ss.icon} />,
          okText: '确认',
          onOk() {
            handleSavePerimission(accountId, isContinue);
          },
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (mobile) {
      form.setFieldValue('mobile', mobile);
    }
  }, [mobile]);

  return (
    <div className={ss.pcContent}>
      <Form form={form}>
        {activeKey === PC_TERMINAL_KEY.manage ? (
          <div className={ss.account}>
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
                  disabled={!!mobile}
                />
              </Form.Item>

              {mobile ? null : (
                <Button
                  className={ss.codeBtn}
                  onClick={sendValidateCode}
                  disabled={!!countDownTime}
                >
                  {!!countDownTime ? countDownTime + ' s' : '获取验证码'}
                </Button>
              )}
            </div>

            {mobile ? null : (
              <div className={`formGroup ${ss.verify}`}>
                <p className="formGroupTitle colon">
                  <span className="required">*</span>验证码
                </p>
                <Form.Item
                  name="smsCode"
                  rules={[{ required: true, message: '请输入验证码' }]}
                >
                  <Input placeholder="请输入" style={{ width: 216 }} />
                </Form.Item>
              </div>
            )}
          </div>
        ) : null}

        <div className="formGroup">
          <p className="formGroupTitle colon">
            <span className="required">*</span>系统权限
          </p>
          <Form.Item name="resourceIds">
            <Permissiontable
              resources={detail?.resourcesList}
              sourceIds={detail?.resourceIds}
            />
          </Form.Item>
        </div>
      </Form>
      {activeKey === PC_TERMINAL_KEY.manage ||
      (activeKey !== PC_TERMINAL_KEY.manage &&
        detail?.resourcesList?.length) ? (
        <Footer onSave={handleSave} loading={loading} setCurrent={setTab} />
      ) : null}
    </div>
  );
};

export default PCContent;
