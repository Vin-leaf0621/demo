import { Tabs } from 'antd';
import { history } from '@umijs/max';
import { useState, useMemo, useEffect } from 'react';
import Content from './components/content';
import ss from './index.less';
import * as Api from './api';
import Footer from '../footer';

const BizRule = ({ tenantId, selectedHisId, setTab }) => {
  const [hospitals, setHospitals] = useState([]);
  const [activeKey, setActiveKey] = useState();

  // 获取入驻医院列表
  const fetchHisList = async (id) => {
    try {
      const data = await Api.fectHisList({
        tenantId: id,
        pageNo: 1,
        pageSize: 20,
      });
      setActiveKey(selectedHisId || data[0].hisId);
      setHospitals(data || []);
    } catch (error) {
      setHospitals([]);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchHisList(tenantId);
    }
  }, [tenantId]);

  const items = useMemo(() => {
    return (hospitals || []).map((item) => ({
      label: item.hisName,
      key: item.hisId,
      children: <Content hisId={activeKey} tenantId={tenantId} />,
    }));
  }, [activeKey, hospitals, tenantId]);

  const handleChange = (key) => {
    setActiveKey(key);
  };

  const handleSave = (isContinue) => {
    if (isContinue) {
      setTab((pre) => pre + 1);
    } else {
      history.back();
    }
  };

  return (
    <div className={ss.bizRule}>
      {hospitals?.length ? (
        hospitals?.length > 1 ? (
          <Tabs
            items={items}
            tabPosition="left"
            onChange={handleChange}
            activeKey={activeKey}
            destroyInactiveTabPane
          />
        ) : (
          <Content hisId={activeKey} tenantId={tenantId} />
        )
      ) : null}

      <Footer onSave={handleSave} setCurrent={setTab} />
    </div>
  );
};

export default BizRule;
