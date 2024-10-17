import { useMemo, useState, useEffect } from 'react';
import { Cascader, Form, Input } from 'antd';
import { useSelector } from '@umijs/max';
import Editor from '@/components/editor';
import DeptIconUpload from '@/components/upload/depticonupload';
import StandardDept from '../standarddept';
import { buildTree, flatArr } from './util';
import ss from './index.less';
import * as Api from './api';

const FormContent = ({ form, hisId, isEdit, isFirst = false }) => {
  const { standardDepts = [], detail } = useSelector(
    (store) => store.manageSubjectDepartment,
  );
  const [recommendDept, setRecommendDept] = useState([]); // 推荐的国标科室（根据名称做匹配查找）
  const standarCode = Form.useWatch('standardCode', form);
  const [deptTree, setDeptTree] = useState([]);

  const layout = useMemo(() => {
    return {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    };
  }, []);

  const handleOnBlur = (e) => {
    const { value } = e.target;
    if (value) {
      let arr = flatArr(standardDepts);

      const temp = arr
        .filter((i) => i.name.includes(value))
        .map((i) => [i])
        .slice(0, 5)
        .map((i) => buildTree(i, arr));
      setRecommendDept(temp);
    }
  };

  const handleRecommend = (item) => {
    const arr = item.map((item) => item.code);
    form.setFieldsValue({
      standardCode: arr,
    });
  };

  // 获取科室树
  const queryDeptTree = async () => {
    try {
      const res = await Api.fetchDepts({
        hisId,
      });
      setDeptTree(res);
    } catch (error) {}
  };
  useEffect(() => {
    if (hisId) {
      queryDeptTree();
    }
  }, [hisId]);

  return (
    <Form {...layout} form={form} className={ss.formContent}>
      {isFirst ? null : (
        <div className="formGroup">
          <p className="formGroupTitle colon">上级科室</p>
          <Form.Item name="parentId">
            <Cascader
              options={deptTree}
              fieldNames={{
                label: 'name',
                value: 'id',
                children: 'subBizDept',
              }}
              style={{ width: 328 }}
              placeholder="请选择"
              changeOnSelect
              disabled
            />
          </Form.Item>
        </div>
      )}

      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>科室编码
        </p>
        <Form.Item
          name="code"
          rules={[{ required: true, message: '请输入科室编码' }]}
        >
          <Input
            placeholder="请输入"
            style={{ width: 216 }}
            disabled={isEdit}
          />
        </Form.Item>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>科室名称
        </p>
        <Form.Item
          name="name"
          rules={[{ required: true, message: '请输入科室名称' }]}
        >
          <Input
            placeholder="请输入"
            style={{ width: 328 }}
            onBlur={handleOnBlur}
          />
        </Form.Item>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">关联国标</p>
        <div className={ss.standrandDept}>
          <Form.Item name="standardCode">
            <StandardDept style={{ width: 328 }} />
          </Form.Item>
          {recommendDept?.length ? (
            <div className={ss.recommand}>
              <p className={ss.title}>推荐国标(点击可直接填入):</p>
              {recommendDept.map((item) => {
                const target = item[item.length - 1];
                return (
                  <div
                    className={`${ss.deptItem} ${
                      Array.isArray(standarCode) &&
                      target.code === standarCode[standarCode?.length - 1]
                        ? ss.active
                        : ''
                    }`}
                    key={target.code}
                    onClick={() => handleRecommend(item)}
                  >
                    {target.name}({target.level}级科室)
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">科室地址</p>
        <Form.Item name="address">
          <Input placeholder="请输入" style={{ width: 328 }} />
        </Form.Item>
      </div>

      <div className="formGroup">
        <p className="formGroupTitle colon">
          <span className="required">*</span>咨询电话
        </p>
        <Form.Item
          name="tel"
          rules={[
            { required: true, message: '请输入咨询电话' },
            { pattern: /^[0-9-]{11,12}$/, message: '请输入正确的电话' },
          ]}
        >
          <Input placeholder="请输入" style={{ width: 328 }} maxLength={13} />
        </Form.Item>
      </div>

      <div className="formGroup" style={{ alignItems: 'flex-start' }}>
        <p className="formGroupTitle colon">科室图标</p>
        <Form.Item name="imageUrl">
          <DeptIconUpload />
        </Form.Item>
      </div>

      <div className="formGroup" style={{ alignItems: 'flex-start' }}>
        <p className="formGroupTitle colon">科室介绍</p>
        <Form.Item name="summary">
          <Editor
            placeholder="正文内容"
            height="300px"
            style={{ width: 800 }}
          />
        </Form.Item>
      </div>
    </Form>
  );
};

export default FormContent;
