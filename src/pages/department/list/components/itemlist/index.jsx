import { useState, useEffect } from 'react';
import { Form } from 'antd';
import DeptContent from '../content';
import Search from '../search';
import * as Api from '../../api';
import ss from './index.less';

const ItemList = ({ hisId }) => {
  const [form] = Form.useForm();
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(false);

  //获取科室
  const fetchDepts = async (params = {}) => {
    setLoading(true);
    try {
      const res = await Api.fetchDepts({
        hisId,
        ...params,
      });
      setDepts(res || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepts();
  }, []);

  return (
    <div className={ss.list}>
      <Search form={form} submit={fetchDepts} loading={loading} />
      <div className={ss.table}>
        <DeptContent depts={depts} hisId={hisId} submit={fetchDepts} />
      </div>
    </div>
  );
};

export default ItemList;
