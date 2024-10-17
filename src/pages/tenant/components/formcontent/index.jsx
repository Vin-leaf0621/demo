import CitySelector from '@/components/cityselector';
import { useSelector } from '@umijs/max';
import { Form, Input, Select, Space } from 'antd';

const FormContent = ({ form }) => {
  const { level, feature, businessPattern } = useSelector(
    (store) => store.hospital,
  );

  return (
    <Form form={form}>
      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>医院名称
        </p>
        <div style={{ flex: 1 }}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: '请输入医院名称' }]}
          >
            <Input placeholder="请输入" showCount maxLength={30} />
          </Form.Item>
          <p className="tips">
            医院名称请慎重填写，建议与医院官网或卫健委名称保持一致
          </p>
        </div>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>HIS_ID
        </p>
        <Form.Item
          name="hisId"
          rules={[{ required: true, message: '请输入HIS_ID' }]}
        >
          <Input placeholder="请输入" />
        </Form.Item>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>医院属性
        </p>
        <Space>
          <Form.Item
            name="businessPattern"
            rules={[{ required: true, message: '请选择医院性质' }]}
          >
            <Select
              placeholder="医院性质"
              options={businessPattern}
              fieldNames={{
                label: 'desc',
                value: 'code',
              }}
            />
          </Form.Item>

          <Form.Item
            name="feature"
            rules={[{ required: true, message: '请选择医院类型' }]}
          >
            <Select
              placeholder="医院类型"
              options={feature}
              fieldNames={{
                label: 'desc',
                value: 'code',
              }}
            />
          </Form.Item>

          <Form.Item
            name="level"
            rules={[{ required: true, message: '请选择医院等级' }]}
          >
            <Select
              placeholder="医院等级"
              options={level}
              fieldNames={{
                label: 'desc',
                value: 'code',
              }}
            />
          </Form.Item>
        </Space>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>医院地址
        </p>
        <Form.Item
          name="city"
          rules={[{ required: true, message: '请选择医院地址' }]}
        >
          <CitySelector />
        </Form.Item>
      </div>
    </Form>
  );
};

export default FormContent;
