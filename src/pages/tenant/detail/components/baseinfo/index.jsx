import { App, Form } from 'antd';
import { useEffect, useState } from 'react';
import { history, useDispatch } from '@umijs/max';
import BaseInfoForm from '../../../components/form/baseinfo';
import Footer from '../footer';
import ss from './index.less';
import * as Api from '../../api';
import { TAB_KEY } from '../../_data';

const BaseInfo = ({
  tenantId,
  tenantName,
  setTenantName,
  tenantStamp,
  setTab,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [initialHisList, setInitialHisList] = useState([]);
  const [delIds, setDelIds] = useState([]);

  // 获取入驻医院列表
  const fetchHisList = async (id, name, stamp) => {
    try {
      const data = await Api.fectHisList({
        tenantId: id,
        pageNo: 1,
        pageSize: 20,
      });
      setInitialHisList(data.map((i) => i.hisId));
      form.setFieldsValue({
        name: name || tenantName,
        tenantHisList: data,
        tenantStamp: stamp || tenantStamp,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchHisList(tenantId);
    }
  }, [tenantId]);

  const handleSubmit = async (isContinue) => {
    await form.validateFields().then(async (values) => {
      const { tenantHisList, name, tenantStamp } = values;

      const params = {
        name,
        tenantStamp,
        tenantHisList: tenantHisList.map((i, x) => ({
          ...i,
          idx: x + 1,
          hisName: undefined,
          principalName: undefined,
        })),
        delIds,
        id: tenantId,
      };

      try {
        if (tenantId) {
          const { name } = await Api.editTenant(params);
          message.success('保存成功！', 1.5, () => {
            setTenantName(name);
            dispatch({
              type: 'tenant/save',
              payload: {
                tenantName: name,
                tenantStamp,
              },
            });
            if (isContinue) {
              setTab((pre) => pre + 1);
            } else {
              history.back();
            }
          });
        } else {
          const { id, code } = await Api.createTenant(params);
          dispatch({
            type: 'tenant/save',
            payload: {
              tenantName: name,
              tenantStamp,
              tenantConfigTabKey: TAB_KEY.bizRule,
            },
          });
          message.success('保存成功', 1.5, () => {
            if (isContinue) {
              history.replace(`/tenant/detail?id=${id}&code=${code}`);
            } else {
              history.back();
            }
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <div className={ss.baseInfo}>
      <div className={ss.content}>
        <BaseInfoForm
          form={form}
          initialHisList={initialHisList}
          setDelIds={setDelIds}
          disable={tenantId && tenantStamp}
        />
      </div>
      <Footer isFirst onSave={handleSubmit} saveText="保存" />
    </div>
  );
};

export default BaseInfo;
