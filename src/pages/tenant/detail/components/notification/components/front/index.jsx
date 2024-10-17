import { Form, Switch, Input, Space, Button, App } from 'antd';
import { useEffect, useState } from 'react';
import { NOTIFICATION_OBJ } from '@/pages/tenant/detail/_data';
import ss from './index.less';
import * as Api from '../../api';

const Front = ({ detail = {}, smsPlatInfo, moduleId, tenantId, submit }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [checked, setChecked] = useState(false);

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        const params = {
          ...values,
          tenantId,
          moduleId,
          smsPlatId: smsPlatInfo.id,
          msgType: 'front_machine',
          templateCfgId: detail?.templateCfgId,
        };

        await Api.saveConfig(params);

        message.success('保存成功！', 1.5, () => {
          submit(moduleId);
        });
      } catch (error) {}
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      content: detail?.content,
      frontSwitch: detail?.frontSwitch,
    });
    setChecked(detail?.frontSwitch ?? false);
  }, [detail]);

  const handleDeleteConfig = async () => {
    try {
      if (!detail?.templateCfgId) {
        message.warning('当前暂未配置该模板！');
        return;
      }

      await Api.deleteConfig({
        smsPlatId: smsPlatInfo?.id,
        templateCfgId: detail?.templateCfgId,
      });

      message.success('删除成功！', 1.5, () => {
        submit(moduleId);
      });
    } catch (error) {}
  };

  const handleChange = async (check) => {
    try {
      const params = {
        frontSwitch: check,
        tenantId,
        moduleId,
        smsPlatId: smsPlatInfo.id,
        msgType: 'front_machine',
        templateCfgId: detail?.templateCfgId,
      };

      await Api.saveConfig(params);

      message.success('保存成功！', 1.5, () => {
        submit(moduleId);
      });
    } catch (error) {}
  };

  return (
    <>
      <div className={ss.front}>
        <Form form={form}>
          <div className={ss.item}>
            <div className={ss.title}>
              <span className={ss.label}>通知对象:</span>
            </div>
            <div>
              {detail.target
                ?.split(',')
                .map((i) => NOTIFICATION_OBJ[i]?.name)
                .join('、')}
            </div>
          </div>

          {smsPlatInfo.contentType === 'customization' ? (
            <div className={ss.item}>
              <div className={ss.title}>
                <span className={ss.required}>*</span>
                <span className={ss.label}>短信内容:</span>
              </div>
              <div>
                <Form.Item
                  name="content"
                  rules={[{ required: true, message: '请输入短信内容' }]}
                >
                  <Input.TextArea
                    placeholder="请输入"
                    showCount
                    maxLength={100}
                    style={{ width: 398 }}
                    rows={5}
                  />
                </Form.Item>
              </div>
            </div>
          ) : (
            <>
              <div className={ss.item}>
                <div className={ss.title}>
                  <span className={ss.label}>通知场景:</span>
                </div>
                <div>{detail?.name}</div>
              </div>

              <div className={ss.item}>
                <div className={ss.title}>
                  <span className={ss.label}>是否发送短信:</span>
                </div>
                <div>
                  <Switch checked={checked} onChange={handleChange} />
                </div>
              </div>
            </>
          )}
        </Form>
      </div>
      {smsPlatInfo.contentType === 'customization' ? (
        <div className={ss.btns}>
          <Space>
            <Button type="primary" onClick={handleSave}>
              保存
            </Button>
            <Button onClick={handleDeleteConfig}>删除配置</Button>
          </Space>
        </div>
      ) : null}
    </>
  );
};

export default Front;
