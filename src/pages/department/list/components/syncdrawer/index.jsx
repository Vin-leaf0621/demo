import { App, Button, Drawer, Form, Radio, Space } from 'antd';
import DeptTree from '../depttree';
import { SYNC_SCOPE, SYNC_SCOPE_OPTIONS } from '../../../_data';
import SyncFieldSelectPanel from '@/pages/manage/subject/components/syncfieldselectpanel';
import ss from './index.less';
import * as Api from '../../api';

const SyncDrawer = ({ open, onClose, depts, hisId, submit }) => {
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const syncType = Form.useWatch('syncType', form);

  const handleClose = () => {
    onClose?.();
    form.resetFields();
  };

  const handleSave = () => {
    form.validateFields().then(async (values) => {
      console.log(values);

      await Api.syncDeptInfo({
        ...values,
        hisId,
      });

      message.success('同步成功！', 1.5, () => {
        handleClose?.();
        submit?.();
      });
    });
  };

  return (
    <Drawer
      width={560}
      open={open}
      onClose={handleClose}
      title="实时同步"
      className={ss.syncDrawer}
    >
      <Form form={form}>
        <Form.Item
          name="syncType"
          label="同步范围"
          rules={[{ required: true, message: '请选择同步范围' }]}
          initialValue={SYNC_SCOPE.ALL}
        >
          <Radio.Group options={SYNC_SCOPE_OPTIONS} />
        </Form.Item>

        {syncType === SYNC_SCOPE.DEPARTMENT ? (
          <>
            <Form.Item
              name="deptIds"
              label="选择科室"
              rules={[{ required: true, message: '请选择科室' }]}
            >
              <DeptTree depts={depts} />
            </Form.Item>

            <Form.Item
              name="syncInfo"
              label="同步信息"
              rules={[{ required: true, message: '请选择同步信息' }]}
            >
              <SyncFieldSelectPanel
                hisId={hisId}
                ruleKey="his_dept_sync_info"
                selectAll={true}
              />
            </Form.Item>
          </>
        ) : null}
      </Form>

      <div className={ss.footer}>
        <Button onClick={handleClose}>取消</Button>
        <Button type="primary" onClick={handleSave}>
          确定
        </Button>
      </div>
    </Drawer>
  );
};

export default SyncDrawer;
