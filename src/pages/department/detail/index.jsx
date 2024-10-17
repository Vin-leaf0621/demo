import { App, Button, Form, Space } from 'antd';
import { history, useDispatch, useMatch, useSelector } from '@umijs/max';
import { useEffect } from 'react';
import Title from '@/components/title';
import useQuery from '@/hooks/useQuery';
import { buildTree, flatArr } from '../components/form/util';
import FormContent from '../components/form';
import ss from './index.less';
import * as Api from './api';

const AddDepartment = () => {
  const [form] = Form.useForm();
  const { hisId, deptId, isFirst } = useQuery();
  const { message } = App.useApp();
  const isEdit = useMatch('/manage/subject/department/edit');
  const { standardDepts, deptInfo, deptLevel } = useSelector(
    (store) => store.manageSubjectDepartment,
  );

  useEffect(() => {
    if (deptLevel && deptInfo) {
      const arr = [
        deptInfo?.firstDept,
        deptInfo?.secondDept,
        deptInfo?.thirdDept,
      ];
      const res = arr.splice(0, deptLevel - 1);
      form.setFieldsValue({
        parentId: res,
      });
    }
  }, [deptLevel, deptInfo]);

  const handleCancle = () => {
    history.back();
  };

  // 获取详情
  const queryDetail = async () => {
    try {
      const data = await Api.queryDetail({
        hisId,
        deptId,
      });

      // 根据国标code在数据源中查找，回显数据
      let arr = flatArr(standardDepts);
      const res = arr
        .filter((i) => i.code === data?.standardCode)
        .map((i) => [i])
        .map((i) => buildTree(i, arr));
      const result = res[0]?.map((i) => i.code);
      console.log(result);
      delete data.parentId;

      form.setFieldsValue({
        ...data,
        imageUrl: data?.imageUrl,
        standardCode: result,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (hisId && deptId && standardDepts?.length) {
      queryDetail();
    }
  }, [deptId, hisId, standardDepts]);

  const handleSubmit = async () => {
    form.validateFields().then(async (values) => {
      try {
        const { standardCode, imageUrl, parentId = [], ...restParams } = values;
        const params = {
          ...restParams,
          hisId,
          id: deptId,
          imageUrl: imageUrl,
          standardCode: Array.isArray(standardCode)
            ? standardCode[standardCode.length - 1]
            : standardCode,
          parentId: parentId[parentId?.length - 1] ?? '-1',
        };
        if (deptId) {
          await Api.editDept(params);
        } else {
          await Api.addDept(params);
        }
        message.success('操作成功！', 1.5, () => {
          history.back();
        });
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className={ss.addDept}>
      <Title title="科室信息" />
      <div className={ss.content}>
        <FormContent
          form={form}
          hisId={hisId}
          isEdit={isEdit}
          isFirst={isFirst}
        />
      </div>
      <div className={ss.btns}>
        <Space>
          <Button onClick={handleCancle}>取消</Button>
          <Button type="primary" onClick={handleSubmit}>
            保存
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default AddDepartment;
