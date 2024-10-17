import { Button, Col, Form, Input, Row, Select, Space } from 'antd';
import ss from './index.less';

const Search = ({ form, submit, loading }) => {
  const handleSubmit = () => {
    const res = form.getFieldsValue();
    submit?.(res);
  };

  const handleReset = () => {
    form.resetFields();
    submit?.({});
  };

  return (
    <div className={ss.searchBox}>
      <div className={ss.content}>
        <Form form={form}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item name="name" label="科室名称">
                <Input placeholder="科室名称" allowClear autoComplete="off" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Space>
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  查询
                </Button>
                <Button onClick={handleReset} disabled={loading}>
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

export default Search;
