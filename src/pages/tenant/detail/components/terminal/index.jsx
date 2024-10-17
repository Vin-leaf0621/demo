import { Tabs } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import { TERMINAL_KEY, TERMINAL_TYPE } from '../../_data';
import MobileTerminal from './components/mobileterminal';
import PCTerminal from './components/pcterminal';
import ss from './index.less';
import * as Api from '../../api';

const Terminal = ({ tenantId, tenantCode, setTab }) => {
  const [activeKey, setActiveKey] = useState(TERMINAL_KEY.mobile);
  const [mobile, setMobile] = useState();

  // 获取租户账号
  const getTenantAccount = async () => {
    try {
      const { userName } = await Api.getTenantAccount({
        tenantCode,
      });
      setMobile(userName);
    } catch (error) {}
  };

  useEffect(() => {
    if (tenantCode) {
      getTenantAccount();
    }
  }, [tenantCode]);

  const items = useMemo(() => {
    const TERMINAL_MAP = {
      [TERMINAL_KEY.mobile]: MobileTerminal,
      [TERMINAL_KEY.pc]: PCTerminal,
    };
    return TERMINAL_TYPE.map((item) => {
      const Container = TERMINAL_MAP[item.key];

      return {
        ...item,
        children: (
          <Container
            type={item.key}
            tenantId={tenantId}
            tenantCode={tenantCode}
            mobile={mobile}
            setTab={setTab}
            submitMobile={getTenantAccount}
          />
        ),
      };
    });
  }, [activeKey, mobile]);

  const handleChange = (key) => {
    setActiveKey(key);
  };

  return (
    <div className={ss.terminal}>
      <Tabs
        items={items}
        tabPosition="left"
        onChange={handleChange}
        activeKey={activeKey}
        destroyInactiveTabPane
      />
    </div>
  );
};

export default Terminal;
