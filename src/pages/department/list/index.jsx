import { useMemo, useState, useEffect, useCallback } from 'react';
import { Tabs } from 'antd';
import { useDispatch, useSelector } from '@umijs/max';
import ItemList from './components/itemlist';
import * as Api from './api';
import ss from './index.less';
import Empty from '@/components/empty';

const Department = () => {
  const dispatch = useDispatch();
  const [hospitals, setHospitals] = useState([]);
  const [activeKey, setActiveKey] = useState();
  const { hisId } = useSelector((store) => store.manageSubjectDepartment);
  const [isEmpty, setEmpty] = useState(false);

  const handleChange = (key) => {
    setActiveKey(key);
  };

  // 获取医院列表
  const fetchHospitals = useCallback(async () => {
    try {
      const res = await Api.fetchHospitals();
      setHospitals(res?.dataList);
      if (res?.dataList?.length) {
        setActiveKey(hisId || res?.dataList[0].hisId);
      }
      dispatch({
        type: 'manageSubjectDepartment/save',
        payload: {
          hisId: null,
        },
      });
      if (!res) {
        setEmpty(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [hisId]);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const items = useMemo(() => {
    return hospitals.map((item) => ({
      label: item.name,
      key: item.hisId,
      children: <ItemList hisId={activeKey} />,
    }));
  }, [activeKey]);

  return (
    <div className={ss.page}>
      {!isEmpty ? (
        hospitals?.length ? (
          hospitals?.length === 1 ? (
            <ItemList hisId={activeKey} />
          ) : (
            <Tabs
              items={items}
              tabPosition="left"
              onChange={handleChange}
              activeKey={activeKey}
              destroyInactiveTabPane
            />
          )
        ) : null
      ) : (
        <Empty title="暂无入驻医院" />
      )}
    </div>
  );
};

export default Department;
