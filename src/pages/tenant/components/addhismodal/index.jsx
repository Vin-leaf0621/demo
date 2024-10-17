import { Modal, Form, Input, Button } from 'antd';
import { useEffect, useState } from 'react';
import HisSearch from '../hissearch';
import ss from './index.less';
import { history } from '@umijs/max';
import AccountSearch from '../accountsearch';
import SecretKey from '../secretkey';

const AddHisModal = ({
  visible,
  onCancle,
  onSave,
  data,
  validateIsAdd,
  initialHisList,
  handleAddHis,
}) => {
  const [form] = Form.useForm();

  // 设置初始值
  useEffect(() => {
    form.setFieldsValue({
      hisValue: data?.hisId
        ? {
            hisId: data?.hisId,
            name: data?.hisName,
          }
        : undefined,
      principalId: data?.principalId
        ? {
            developerAccountId: data?.principalId,
            name: data?.principalName,
          }
        : undefined,
      frontAddress: data?.frontAddress,
      secretKey: data?.secretKey,
    });
  }, [visible]);

  // 添加入驻医院
  const handleSave = () => {
    try {
      form.validateFields().then((values) => {
        const { hisValue, principalId, ...restParams } = values;
        const params = {
          hisId: hisValue.hisId,
          hisName: hisValue.name,
          principalId: principalId.developerAccountId,
          principalName: principalId.name,
          ...restParams,
        };
        onSave?.(params);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 添加医院
  const handleToAddHis = () => {
    const value = form.getFieldsValue();
    handleAddHis(value);
  };

  return (
    <Modal
      title={data ? '编辑入驻医院' : '添加入驻医院'}
      open={visible}
      onCancel={onCancle}
      width={624}
      className={ss.modal}
      onOk={handleSave}
      destroyOnClose
    >
      <Form form={form}>
        <div className={ss.title}>入驻信息</div>

        <div className={ss.hisSearch}>
          <Form.Item
            label="入驻医院"
            name="hisValue"
            required={false}
            rules={[{ required: true, message: '请选择入驻医院' }]}
          >
            <HisSearch
              validateIsAdd={validateIsAdd}
              initialArr={
                data?.hisId
                  ? [
                      {
                        hisId: data?.hisId,
                        name: data?.hisName,
                        hisIdAndName: data?.hisId + data?.hisName,
                      },
                    ]
                  : []
              }
              initialHisList={initialHisList}
              style={{ width: 312 }}
            />
          </Form.Item>
          <p>
            新医院请先
            <Button
              type="link"
              style={{ marginLeft: 4 }}
              onClick={handleToAddHis}
            >
              添加医院
            </Button>
          </p>
        </div>

        <div className={ss.title}>前置机信息</div>

        <Form.Item
          label="开发负责人"
          name="principalId"
          required={false}
          rules={[{ required: true, message: '请选择开发负责人' }]}
        >
          <AccountSearch
            initialArr={
              data?.principalName
                ? [
                    {
                      developerAccountId: data?.principalId,
                      name: data?.principalName,
                    },
                  ]
                : []
            }
          />
        </Form.Item>

        <Form.Item
          label="前置机地址"
          name="frontAddress"
          required={false}
          rules={[
            { required: true, whitespace: true, message: '请输入前置机地址' },
            {
              type: 'string',
              max: 200,
              message: '前置机地址最多只能输入200字符',
            },
          ]}
        >
          <Input placeholder="请输入" style={{ width: 312 }} />
        </Form.Item>

        <Form.Item
          label="参数密钥"
          name="secretKey"
          required={false}
          rules={[
            { required: true, whitespace: true, message: '请输入参数密钥' },
            {
              type: 'string',
              max: 200,
              message: '参数密钥最多只能输入200字符',
            },
          ]}
        >
          <SecretKey />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddHisModal;
