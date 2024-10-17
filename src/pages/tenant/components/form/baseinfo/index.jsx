import { Form, Input } from 'antd';
import HospitalBtns from '../../hospitalbtns';
import ss from './index.less';

const BaseInfoForm = ({ form, initialHisList, setDelIds, disable }) => {
  return (
    <Form form={form} className={ss.baseForm}>
      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>租户名称
        </p>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入租户名称' }]}
        >
          <Input
            showCount
            maxLength={30}
            placeholder="请输入"
            style={{ width: 440 }}
          />
        </Form.Item>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>租户标识
        </p>
        <Form.Item
          name="tenantStamp"
          rules={[{ required: true, message: '请输入租户名称' }]}
        >
          <Input
            showCount
            maxLength={30}
            placeholder="请输入"
            style={{ width: 440 }}
            disabled={disable}
          />
        </Form.Item>
      </div>

      <div className={`formGroup ${ss.tenants}`}>
        <p className="formGroupTitle colon">
          <span className="required">*</span>入驻医院
        </p>
        <Form.Item
          name="tenantHisList"
          rules={[{ required: true, message: '请添加入驻医院' }]}
        >
          <HospitalBtns initialHisList={initialHisList} setDelIds={setDelIds} />
        </Form.Item>
      </div>
    </Form>
  );
};

export default BaseInfoForm;
