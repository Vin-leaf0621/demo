import { Modal, Form, Radio, Button, Input, Select, App } from 'antd';
import { useEffect } from 'react';
import { MSG_DOCKING_KEY } from '@/pages/tenant/detail/_data';
import ss from './index.less';
import * as Api from '../../api';

const SmsPlatform = ({ open, onCancle, data = {}, tenantId, submit }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const isSet = Form.useWatch('isSet', form);
  const docking = Form.useWatch('docking', form);

  useEffect(() => {
    form.setFieldsValue({
      docking: data?.docking,
      contentType: data?.contentType,
      platCode: data.docking === docking ? data?.platCode : undefined,
      isSet: data?.id ? 1 : 0,
      apiKey: data?.apiKey,
    });
  }, [open]);

  const handleChange = (val) => {
    form.setFieldValue(
      'platCode',
      data.docking === val ? data?.platCode : undefined,
    );
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        if (values?.isSet) {
          const params = {
            ...values,
            id: data?.id,
            tenantId,
            platCode: values?.platCode ?? 'FRONT',
          };

          delete params.isSet;

          await Api.setSmsPlant(params);
        } else {
          if (data?.id) {
            await Api.deleteSmsPlat({
              smsPlatId: data?.id,
              tenantId,
            });
          }
        }

        message.success('保存成功！', 1.5, () => {
          submit();
          onCancle?.();
        });
      } catch (error) {}
    });
  };

  return (
    <Modal
      title="配置短信平台"
      className={ss.smsPlatform}
      open={open}
      onCancel={onCancle}
      width={560}
      footer={
        <Button type="primary" onClick={handleSave}>
          确定
        </Button>
      }
    >
      <Form form={form}>
        <div className={ss.item}>
          <div className={ss.title}>
            <span className={ss.label}>是否对接:</span>
          </div>
          <div>
            <Form.Item name="isSet">
              <Radio.Group>
                <Radio value={1}>是</Radio>
                <Radio value={0}>否</Radio>
              </Radio.Group>
            </Form.Item>
          </div>
        </div>

        {isSet === 1 ? (
          <>
            <div className={ss.item}>
              <div className={ss.title}>
                <span className={ss.label}>对接方式:</span>
              </div>
              <div>
                <Form.Item
                  name="docking"
                  rules={[{ required: true, message: '请选择对接方式' }]}
                >
                  <Radio.Group onChange={handleChange}>
                    <Radio value={MSG_DOCKING_KEY.front_machine}>
                      对接前置机
                    </Radio>
                    <Radio value={MSG_DOCKING_KEY.third_party}>
                      对接第三方平台
                    </Radio>
                  </Radio.Group>
                </Form.Item>
              </div>
            </div>

            {docking === MSG_DOCKING_KEY.front_machine ? (
              <div className={`${ss.item} ${ss.marLeft}`}>
                <div className={ss.title}>
                  <span className={ss.label}>短信内容:</span>
                </div>
                <div>
                  <Form.Item
                    name="contentType"
                    rules={[{ required: true, message: '请选择短信内容' }]}
                  >
                    <Radio.Group>
                      <Radio value="interface_define">接口定义</Radio>
                      <Radio value="customization">自定义</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            ) : null}
            {docking === MSG_DOCKING_KEY.third_party ? (
              <>
                <div className={ss.marLeft}>
                  <Form.Item
                    label="短信供应商"
                    name="platCode"
                    initialValue="YUNPIAN"
                    rules={[{ required: true, message: '请选择短信供应商' }]}
                  >
                    <Select
                      placeholder="请选择"
                      options={[{ label: '云片网', value: 'YUNPIAN' }]}
                    />
                  </Form.Item>
                </div>

                <div className={ss.marLeft}>
                  <Form.Item
                    label="APIKEY"
                    name="apiKey"
                    rules={[
                      {
                        required: true,
                        whitespace: true,
                        message: '请输入APIKEY',
                      },
                      {
                        type: 'string',
                        max: 200,
                        message: 'APIKEY最多可输入200个字符',
                      },
                    ]}
                  >
                    <Input placeholder="请输入" />
                  </Form.Item>
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </Form>
    </Modal>
  );
};

export default SmsPlatform;
