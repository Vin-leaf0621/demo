import { useState, useMemo } from 'react';
import { Steps } from 'antd';
import { useSelector } from '@umijs/max';
import useQuery from '@/hooks/useQuery';
import BaseInfo from './components/baseinfo';
import BizRule from './components/bizrule';
import Terminal from './components/terminal';
import Notification from './components/notification';
import { TAB_ARR, TAB_KEY } from './_data';
import ss from './index.less';

const STEPS_MAP = {
  [TAB_KEY.baseInfo]: 0,
  [TAB_KEY.bizRule]: 1,
  [TAB_KEY.terminal]: 2,
  [TAB_KEY.notification]: 3,
};

const TenantDetail = () => {
  const { id, code, ...rest } = useQuery();
  const {
    tenantConfigTabKey,
    selectedHisId,
    tenantName: name,
    tenantStamp,
  } = useSelector((state) => state.tenant);
  const [current, setCurrent] = useState(
    STEPS_MAP[tenantConfigTabKey || TAB_KEY.baseInfo],
  );
  const [tenantName, setTenantName] = useState(name);

  const getItems = useMemo(() => {
    return TAB_ARR.map((item) => ({ title: item.label }));
  }, []);

  const renderContainer = () => {
    const isCreate = !id;

    const TAB_MAP = {
      0: BaseInfo,
      1: BizRule,
      2: Terminal,
      3: Notification,
    };

    const Container = TAB_MAP[current];

    return (
      <Container
        {...{
          ...rest,
          tenantId: id,
          tenantName: tenantName,
          tenantCode: code,
          isCreate,
          selectedHisId: selectedHisId,
          setTab: setCurrent,
          setTenantName: setTenantName,
          tenantStamp: tenantStamp,
        }}
      />
    );
  };

  return (
    <div className={ss.tenant}>
      <div className={ss.steps}>
        <Steps items={getItems} current={current} />
      </div>

      <div className={ss.content}>{renderContainer()}</div>
    </div>
  );
};

export default TenantDetail;
