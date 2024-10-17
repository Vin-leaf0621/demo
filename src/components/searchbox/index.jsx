import { Button, Col, Form, Row, Space } from 'antd';
import { useMemo } from 'react';
import { RENDER_ITEM_TYPE } from './consts';
import ss from './index.less';

const SearchBox = ({ dataList = [], form, submit, reset, loading }) => {
  const renderItem = (type, itemProps = {}) => {
    const RenderItem = RENDER_ITEM_TYPE[type];
    return RenderItem ? <RenderItem {...itemProps} /> : null;
  };

  const btnsOffset = useMemo(() => {
    return (2 - (dataList.length % 3)) * 8;
  }, [dataList.length]);

  return (
    <div className={ss.searchBox}>
      <div className={ss.content}>
        <Form form={form}>
          <Row gutter={24}>
            {dataList.map((item) => {
              const {
                type,
                name,
                label,
                itemProps = {},
                customRender = null,
                formItemProps = {},
              } = item;

              return (
                <Col span={8} key={name}>
                  <Form.Item name={name} label={label} {...formItemProps}>
                    {customRender
                      ? customRender(type, itemProps)
                      : renderItem(type, itemProps)}
                  </Form.Item>
                </Col>
              );
            })}
            <Col
              span={8}
              offset={btnsOffset}
              style={{
                textAlign: dataList.length > 2 ? 'right' : 'left',
                marginBottom: 24,
              }}
            >
              <Space>
                <Button type="primary" onClick={submit} disabled={loading}>
                  查询
                </Button>
                <Button onClick={reset} disabled={loading}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default SearchBox;
