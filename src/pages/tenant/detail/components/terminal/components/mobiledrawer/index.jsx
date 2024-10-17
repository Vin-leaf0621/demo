import ImageUpload from '@/components/imageupload';
import { Drawer, Form, Input, Button, Space, Radio, App, Select } from 'antd';
import { useCallback, useEffect } from 'react';
import ss from './index.less';
import * as Api from '../../api';
import {
  CHANNEL_KEY,
  CHANNEL_LIST,
  MOBILE_TERMINAL_LIST,
} from '@/pages/tenant/detail/_data';
import { createInitImageList } from '@/utils/utils';

const MobileDrawer = ({ open, onClose, submit, editId, tenantId }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  // 保存
  const handleSubmit = async () => {
    form.validateFields().then(async (values) => {
      try {
        const params = {
          ...values,
          url: values.url[0].url,
          userTerminals: values.userTerminals.split(','),
          id: editId,
          tenantId,
          channel: CHANNEL_KEY.wxXcx,
        };

        if (editId) {
          await Api.editTerminal(params);
        } else {
          await Api.addTerminal(params);
        }

        message.success('保存成功！', 1.5, () => {
          handleClose?.();
          submit();
        });
      } catch (error) {}
    });
  };

  // 关闭弹窗
  const handleClose = () => {
    form.resetFields();
    onClose?.();
  };

  // 获取终端详情
  const fetchDetail = async () => {
    try {
      const res = await Api.fetchMobileDetail({
        id: editId,
      });
      form.setFieldsValue({
        ...res,
        url: createInitImageList([res.url]),
        userTerminals: res.userTerminals.join(','),
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (editId && open) {
      fetchDetail();
    }
  }, [open]);

  const onImageChanged = useCallback(({ fileList = [] }) => {
    return fileList.map((file) => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.url : file.url,
    }));
  }, []);

  return (
    <Drawer
      title="添加终端"
      open={open}
      onClose={handleClose}
      className={ss.drawer}
      width={560}
      destroyOnClose
    >
      <div className={ss.formContent}>
        <Form form={form} layout="vertical">
          <div className={ss.item}>
            <div className={ss.title}>
              <span className={ss.required}>*</span>终端名称:
            </div>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入终端名称' }]}
            >
              <Input
                placeholder="请输入"
                maxLength={30}
                disabled={!!editId}
                style={{ width: 332 }}
              />
            </Form.Item>
          </div>

          <div className={ss.channelItem}>
            <div className={ss.title}>
              <span className={ss.required}>*</span>所属渠道:
            </div>
            <div className={ss.channelInfo}>
              <div className={ss.title}>
                <Form.Item name="channel" initialValue={CHANNEL_KEY.wxXcx}>
                  <Select options={CHANNEL_LIST} style={{ width: 332 }} />
                </Form.Item>
              </div>
              <div className={ss.wxterminal}>
                <Form.Item
                  name={['wxTerminal', 'appId']}
                  label="AppID"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入AppID',
                    },
                    {
                      type: 'string',
                      max: 64,
                      message: 'AppID最多只能输入64个字符',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入"
                    disabled={!!editId}
                    style={{ width: 388 }}
                  />
                </Form.Item>
                <Form.Item
                  name={['wxTerminal', 'appSecret']}
                  label="Secret Key"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入Secret Key',
                    },
                    {
                      type: 'string',
                      max: 64,
                      message: 'Secret Key最多只能输入64个字符',
                    },
                  ]}
                >
                  <Input
                    placeholder="请输入"
                    disabled={!!editId}
                    style={{ width: 388 }}
                  />
                </Form.Item>
                <Form.Item
                  name={['wxTerminal', 'codeSecretKey']}
                  label="小程序代码上传密钥"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入小程序代码上传密钥',
                    },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder="请输入"
                    maxLength={200}
                    disabled={!!editId}
                    style={{ width: 388 }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <div className={ss.item}>
            <div className={ss.title}>
              <span className={ss.required}>*</span>终端图标:
            </div>
            <div style={{ marginBottom: 24 }}>
              <Form.Item
                name="url"
                valuePropName="fileList"
                getValueFromEvent={onImageChanged}
                rules={[{ required: true, message: '请上传终端图标' }]}
              >
                <ImageUpload aspect={1} />
              </Form.Item>
              <p className={ss.imageUploadTips}>
                支持jpg、png等格式，尺寸比例1:1，大小1M以内
              </p>
            </div>
          </div>

          <div className={ss.item}>
            <div className={ss.title}>
              <span className={ss.required}>*</span>承载用户端:
            </div>
            <Form.Item
              name="userTerminals"
              rules={[{ required: true, message: '请选中承载用户端' }]}
            >
              <Radio.Group disabled={!!editId}>
                {MOBILE_TERMINAL_LIST.map((i) => (
                  <Radio value={i.value} key={i.value}>
                    {i.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>
          </div>
        </Form>
      </div>

      <div className={ss.footer}>
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            确定
          </Button>
        </Space>
      </div>
    </Drawer>
  );
};

export default MobileDrawer;
