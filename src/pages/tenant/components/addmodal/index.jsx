import { App, Button, Form, Modal } from 'antd';
import { useCallback, useState, useEffect } from 'react';
import ss from './index.less';
import FormContent from '../formcontent';
import * as Api from './api';

const AddModal = ({ open, onCancle, onSave }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  useEffect(() => {
    if (!open) {
      form.setFieldsValue({
        hisId: undefined,
        name: undefined,
        city: undefined,
        level: undefined,
        feature: undefined,
        businessPattern: undefined,
      });
    }
  }, [open]);

  const handleSubmit = useCallback(() => {
    form.validateFields().then(async (values) => {
      try {
        const { city, ...restParams } = values;
        const [provinceCode, cityCode, areaCode] = city || [];
        const params = {
          ...restParams,
          provinceCode,
          cityCode,
          areaCode,
        };
        await Api.addHis(params);
        message.success('添加成功', 1.5, () => {
          onSave(params);
        });
      } catch (error) {}
    });
  }, []);

  return (
    <Modal
      className={`${'modal'} ${ss.addModal}`}
      title="添加医院"
      width={560}
      open={open}
      closeIcon={false}
      maskClosable={false}
      footer={
        <div>
          <Button onClick={onCancle}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
        </div>
      }
    >
      <FormContent form={form} />
    </Modal>
  );
};

export default AddModal;
