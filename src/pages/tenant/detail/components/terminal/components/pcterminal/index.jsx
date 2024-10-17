import { Tabs, Button, App } from 'antd';
import { useState, useEffect } from 'react';
import {
  PC_TERMINAL,
  PC_TERMINAL_KEY,
  TAB_KEY,
} from '@/pages/tenant/detail/_data';
import PCContent from '../pccontent';
import { MANAGE_CLIENT_DOMAIN_MAP } from '@/constants/common';
import ss from './index.less';

const PCTerminal = ({ tenantId, tenantCode, mobile, setTab, submitMobile }) => {
  const { message } = App.useApp();
  const [current, setCurrent] = useState(PC_TERMINAL_KEY.manage);
  const [isEmpty, setEmpty] = useState(false);

  const handleTabChange = (key) => {
    if (!mobile) {
      message.warning('请先添加医院管理后台账号');
      return;
    }
    setCurrent(key);
  };

  const getTabItems = () => {
    return PC_TERMINAL.map((i) => ({
      ...i,
      children: (
        <PCContent
          activeKey={current}
          tenantCode={tenantCode}
          tenantId={tenantId}
          setEmpty={setEmpty}
          mobile={mobile}
          submitMobile={submitMobile}
          setTab={setTab}
        />
      ),
    }));
  };

  return isEmpty ? (
    <div className={ss.empty}>
      暂无已上线业务，请先
      <Button type="link" style={{ padding: 0 }} onClick={() => setTab(1)}>
        配置并上线业务
      </Button>
    </div>
  ) : (
    <div className={ss.pcTerminal}>
      <div className={ss.address}>
        <p>
          PC终端地址：
          {`${MANAGE_CLIENT_DOMAIN_MAP[environment]}/admin/${tenantCode}`}
        </p>
        <p>
          系统已根据入驻医院的已上线的业务生成终端及用户端菜单，可根据需要取消权限
        </p>
      </div>
      <Tabs
        activeKey={current}
        items={getTabItems()}
        destroyInactiveTabPane
        onChange={handleTabChange}
      />
    </div>
  );
};

export default PCTerminal;
