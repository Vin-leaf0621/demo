import classNames from 'classnames';
import { Form, Input, Radio, Button, Space, Select, App, Divider } from 'antd';
import { useState, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
} from '@dnd-kit/core';
import { NOTIFICATION_OBJ } from '@/pages/tenant/detail/_data';
import ss from './index.less';
import * as Api from '../../api';

const Draggable = ({ children, id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </div>
  );
};

const Droppable = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return <div ref={setNodeRef}>{children}</div>;
};

const XcxMsg = ({
  detail = {},
  tenantId,
  channel,
  terminalId,
  moduleId,
  submit,
}) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const isTurn = Form.useWatch('isTurn', form);
  const [isDragging, setIsDragging] = useState(false);
  const [activeItem, setActiveItem] = useState();
  const [msgTypeList, setMsgTypeList] = useState([]); // 消息类型
  const [msgType, setMsgType] = useState(); // 选中的消息类型
  const [msgTemplateList, setMsgTemplateList] = useState([]); // 消息模板列表
  const [msgTemplate, setMsgTemplate] = useState(); // 选中的消息模板

  useEffect(() => {
    form.setFieldsValue({
      isTurn: detail?.page ? 1 : 0,
    });
    const option = msgTemplateList.filter(
      (i) => i.templateId === detail?.templateId,
    )[0];
    setMsgTemplate(option);
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
      page: detail?.page,
    });
  }, [detail, msgTemplateList]);

  // 获取消息类型
  const fetchMsgType = async () => {
    try {
      const res = await Api.fetchMsgTypeList({
        channel,
      });
      setMsgTypeList(res);
      setMsgType(res[0]);
    } catch (error) {}
  };
  useEffect(() => {
    if (channel) {
      fetchMsgType();
    }
  }, [channel]);

  // 获取消息模板列表
  const fetchMsgTemplateList = async () => {
    try {
      const res = await Api.fetchMsgTemplateList({
        terminalId,
        channel,
        msgType: msgType.code,
      });
      setMsgTemplateList(res);
    } catch (error) {}
  };
  useEffect(() => {
    if (msgType) {
      fetchMsgTemplateList();
    }
  }, [msgType]);

  const handleDragStart = ({ active }) => {
    const { id } = active;
    const item = detail.wildcardList.filter((i) => i.field === id)[0];
    setActiveItem(item);
    setIsDragging(true);
  };

  const handleDragEnd = ({ over }) => {
    if (over) {
      const { id } = over;
      const overItemIdx = msgTemplate?.wildcardList
        .map((i) => i.field)
        .indexOf(id);

      const oldValue = form.getFieldValue([
        'dataValueMap',
        overItemIdx,
        'value',
      ]);
      form.setFieldValue(
        ['dataValueMap', overItemIdx, 'value'],
        (oldValue ?? '') + `#${activeItem.field}#`,
      );
      setIsDragging(false);
    }
  };

  const handleSelect = (val, option) => {
    setMsgTemplate(option);

    (option?.wildcardList || []).forEach((item, x) => {
      const res = detail?.templateWildcardList?.find(
        (i) => i.field === item.field,
      );
      form.setFieldValue(['dataValueMap', x, 'name'], item.fieldName);
      form.setFieldValue(
        ['dataValueMap', x, 'value'],
        detail?.templateId === val ? res?.value : undefined,
      );
    });
    form.setFieldsValue({
      isTurn: detail?.templateId === val ? (detail?.page ? 1 : 0) : 0,
      page: detail?.templateId === val ? detail?.page : undefined,
    });
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      try {
        const dataValueMap = values.dataValueMap.reduce((pre, cur) => {
          const key = msgTemplate?.wildcardList.filter(
            (i) => i.fieldName === cur.name,
          )[0].field;
          pre[key] = cur;

          return pre;
        }, {});

        const params = {
          ...values,
          dataValueMap,
          tenantId,
          terminalId,
          channel,
          moduleId,
          msgType: msgType?.code,
          templateCfgId: detail?.templateCfgId,
        };

        delete params.isTurn;

        await Api.saveConfig(params);

        message.success('保存成功！', 1.5, () => {
          submit(moduleId);
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleDeleteConfig = async () => {
    try {
      if (!detail?.templateCfgId) {
        message.warning('当前暂未配置该模板！');
        return;
      }

      await Api.deleteConfig({
        channel,
        templateCfgId: detail?.templateCfgId,
      });

      message.success('删除成功！', 1.5, () => {
        submit(moduleId);
      });
    } catch (error) {}
  };

  return (
    <>
      <div className={ss.xcxMsg}>
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
              <span className={ss.label}>消息类型:</span>
            </div>
            <div>{msgType ? msgType?.desc : '小程序订阅消息'}</div>
          </div>

          <div className={ss.item}>
            <div className={ss.title}>
              <span className={ss.required}>*</span>
              <span className={ss.label}>消息模板:</span>
            </div>
            <div>
              <Form.Item
                name="templateId"
                rules={[{ required: true, message: '请选择消息模板' }]}
              >
                <Select
                  placeholder="请选择"
                  options={msgTemplateList}
                  fieldNames={{ label: 'templateName', value: 'templateId' }}
                  style={{ width: 360 }}
                  onSelect={handleSelect}
                />
              </Form.Item>
            </div>
          </div>

          <Divider className={ss.divider} />

          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div
              className={classNames(ss.marBottom, ss.item)}
              style={{ marginBottom: 16 }}
            >
              <div>
                <span className={`${ss.label} ${ss.subTitle}`}>详细内容</span>
              </div>
            </div>

            <div className={classNames(ss.marBottom, ss.item)}>
              <div className={ss.title}>
                <span className={ss.label}>常用通配符:</span>
              </div>
              <div className={ss.wildcard}>
                <div className={ss.list}>
                  {(detail.wildcardList || []).map((i) => (
                    <Draggable key={i.field} id={i.field}>
                      <div className={ss.wildcardItem}>{i.fieldName}</div>
                    </Draggable>
                  ))}
                </div>
                <span className={ss.tips}>拖动可填充到对应位置</span>
              </div>
            </div>
            <DragOverlay>
              {isDragging ? (
                <div className={ss.wildcardItem}>{activeItem?.fieldName}</div>
              ) : null}
            </DragOverlay>

            {(msgTemplate?.wildcardList || []).map((i, x) => (
              <div className={classNames(ss.marBottom, ss.item)} key={i.field}>
                <div className={ss.title}>
                  <span className={ss.required}>*</span>
                  <Form.Item
                    name={['dataValueMap', x, 'name']}
                    initialValue={i.fieldName}
                  >
                    <span className={ss.label}>{i.fieldName}</span>
                  </Form.Item>
                </div>
                <div>
                  <Droppable id={i.field}>
                    <Form.Item
                      name={['dataValueMap', x, 'value']}
                      rules={[{ required: true, message: '请输入必填项' }]}
                    >
                      <Input placeholder="请输入" style={{ width: 285 }} />
                    </Form.Item>
                  </Droppable>
                </div>
              </div>
            ))}
          </DndContext>

          <Divider className={ss.divider} />
          <div
            className={classNames(ss.item, ss.marBottom)}
            style={{ marginTop: 24 }}
          >
            <div className={ss.title}>
              <span className={ss.required}>*</span>
              <span className={ss.label}>跳转方式:</span>
            </div>
            <div>
              <Form.Item
                name="isTurn"
                rules={[{ required: true, message: '请选择跳转方式' }]}
              >
                <Radio.Group>
                  <Radio value={0}>不跳转</Radio>
                  <Radio value={1}>跳转小程序</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          {isTurn === 1 ? (
            <div className={classNames(ss.marLeft, ss.item)}>
              <div className={ss.title}>
                <span className={ss.required}>*</span>
                <span className={ss.label}>跳转链接:</span>
              </div>
              <div>
                <Form.Item
                  name="page"
                  rules={[
                    {
                      required: true,
                      whitespace: true,
                      message: '请输入跳转链接',
                    },
                    {
                      type: 'string',
                      max: 200,
                      message: '跳转链接最多只能输入200字符',
                    },
                  ]}
                >
                  <Input placeholder="请输入" style={{ width: 285 }} />
                </Form.Item>
              </div>
            </div>
          ) : null}
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

export default XcxMsg;
