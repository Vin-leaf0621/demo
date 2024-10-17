import { Form, Select, Input, Space, Button, App } from 'antd';
import { useEffect, useState } from 'react';
import classNames from 'classnames';
import { MSG_DOCKING_KEY, NOTIFICATION_OBJ } from '@/pages/tenant/detail/_data';
import ss from './index.less';
import * as Api from '../../api';

const YunPian = ({ detail = {}, smsPlatInfo, moduleId, tenantId, submit }) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [msgTemplateList, setMsgTemplateList] = useState([]); // 消息模板列表
  const [selectedMsgTemplate, setSelectedMsgTemplate] = useState(); // 当前选中的短信模板

  // 获取消息模板列表
  const fetchMsgTemplateList = async () => {
    try {
      const res = await Api.fetchMsgTemplateList({
        smsPlatId: smsPlatInfo.id,
      });
      setMsgTemplateList(res);
    } catch (error) {}
  };

  useEffect(() => {
    if (smsPlatInfo.id) {
      fetchMsgTemplateList();
    }
  }, [smsPlatInfo]);

  // 短信模板选中变化
  const handleSelect = (value, option) => {
    setSelectedMsgTemplate(option);
    (option?.wildcardList || []).forEach((item, x) => {
      const res = detail?.templateWildcardList?.find(
        (i) => i.field === item.field,
      );
      form.setFieldValue(['dataValueMap', x, 'name'], item.fieldName);
      form.setFieldValue(
        ['dataValueMap', x, 'value'],
        detail?.templateId === value ? res?.value : undefined,
      );
    });
    form.setFieldsValue({
      content: option?.content,
    });
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        const params = {
          ...values,
          dataValueMap: values.dataValueMap?.reduce((pre, cur) => {
            pre[cur.name] = cur;

            return pre;
          }, {}),
          tenantId,
          smsPlatId: smsPlatInfo?.id,
          moduleId,
          templateCfgId: detail?.templateCfgId,
          msgType: 'sms',
        };

        await Api.saveConfig(params);

        message.success('保存成功！', 1.5, () => {
          submit(moduleId);
        });
      } catch (error) {}
    });
  };

  // 数据回显
  useEffect(() => {
    const option = msgTemplateList.filter(
      (i) => i.templateId === detail?.templateId,
    )[0];
    setSelectedMsgTemplate(option);
    form.setFieldsValue({
      templateId: detail?.templateId,
      content: detail?.content,
      dataValueMap: option
        ? (option.wildcardList || []).map((item) => {
            const res = detail?.templateWildcardList.find(
              (i) => i.field === item.field,
            );

            return {
              name: res?.fieldName,
              value: res?.value,
            };
          })
        : undefined,
    });
  }, [detail, msgTemplateList]);

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

  return (
    <>
      <div className={ss.yunPian}>
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

          <div className={ss.item}>
            <div className={ss.title}>
              <span className={ss.required}>*</span>
              <span className={ss.label}>短信模板:</span>
            </div>
            <div>
              <Form.Item
                name="templateId"
                rules={[{ required: true, message: '请选择短信模板' }]}
              >
                <Select
                  placeholder="请选择"
                  options={msgTemplateList}
                  fieldNames={{
                    label: 'templateIdAndContent',
                    value: 'templateId',
                  }}
                  style={{ width: 398 }}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.templateIdAndContent ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onSelect={handleSelect}
                />
              </Form.Item>
            </div>
          </div>

          <div className={ss.item}>
            <div className={ss.title}>
              <span className={ss.required}>*</span>
              <span className={ss.label}>短信内容:</span>
            </div>
            <div>
              <Form.Item name="content">
                <Input.TextArea
                  placeholder="请输入"
                  showCount
                  maxLength={100}
                  style={{ width: 398 }}
                  rows={5}
                  disabled
                />
              </Form.Item>
            </div>
          </div>

          {(selectedMsgTemplate?.wildcardList || []).map((i, x) => (
            <div className={classNames(ss.item)} key={i.field}>
              <div className={ss.title}>
                <span className={ss.required}>*</span>
                <Form.Item
                  name={['dataValueMap', x, 'name']}
                  initialValue={i.fieldName}
                >
                  <span className={ss.label}>{i.fieldName}:</span>
                </Form.Item>
              </div>
              <div>
                <Form.Item
                  name={['dataValueMap', x, 'value']}
                  rules={[{ required: true, message: '请选择通配符' }]}
                >
                  <Select
                    placeholder="请选择通配符"
                    options={detail?.wildcardList || []}
                    style={{ width: 324 }}
                    fieldNames={{ label: 'fieldName', value: 'field' }}
                  />
                </Form.Item>
              </div>
            </div>
          ))}
        </Form>
      </div>
      <div className={ss.btns}>
        <Space>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
          <Button onClick={handleDeleteConfig}>删除配置</Button>
        </Space>
      </div>
    </>
  );
};

export default YunPian;
