import { Tabs } from 'antd';
import { useState, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import Content from './components/content';
import smsIcon from '@/resources/images/tenant/config/icon-sms@2x.png';
import ss from './index.less';
import * as Api from './api';
import { CHANNEL_TYPE, TERMINAL_KEY } from '../../_data';
import Footer from '../footer';

export const SMS_INFO = {
  name: '短信',
  id: 'sms',
  url: smsIcon,
};

const Notification = ({ tenantId, setTab }) => {
  const [terminals, setTerminals] = useState([]);
  const [activeKey, setActiveKey] = useState(SMS_INFO.id);
  const [smsPlatInfo, setSmsPlatInfo] = useState();
  const [canSearch, setCanSearch] = useState(false);

  // 获取移动终端列表
  const fetchTerminalList = async () => {
    try {
      const res = await Api.fetchTerminalList({
        client: TERMINAL_KEY.mobile,
        tenantId,
      });
      setTerminals([...(res || []), SMS_INFO]);
      if (res?.length) setActiveKey(res[0].id);
    } catch (error) {}
  };

  // 获取短信平台信息
  const fetchSmsPlant = async () => {
    try {
      const res = await Api.fetchSmsPlant({
        tenantId,
      });
      setSmsPlatInfo(res);
      return res;
    } catch (error) {
    } finally {
      setCanSearch(true);
    }
  };

  useEffect(() => {
    fetchTerminalList();
    fetchSmsPlant();
  }, []);

  const LabelNode = ({ activeKey, item }) => {
    return (
      <div
        className={classNames(
          ss.labelNode,
          activeKey === item?.id && ss.activeLableNode,
        )}
      >
        <img src={item.url} alt="" />
        <div className={ss.info}>
          <p className={ss.name}>{item.name}</p>
          <p className={ss.terminalType}>{CHANNEL_TYPE[item?.channel]?.name}</p>
        </div>
      </div>
    );
  };

  const getItems = useMemo(() => {
    return terminals.map((item) => ({
      label: <LabelNode activeKey={activeKey} item={item} />,
      key: item.id,
      children: (
        <Content
          terminalId={item.id === SMS_INFO.id ? undefined : item.id}
          channel={item.channel}
          tenantId={tenantId}
          isSms={item.id === SMS_INFO.id}
          smsPlatInfo={smsPlatInfo}
          submitSms={fetchSmsPlant}
          canSearch={canSearch}
          userTerminal={item?.userTerminal}
        />
      ),
    }));
  }, [terminals, activeKey, tenantId, smsPlatInfo, canSearch]);

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
    <div className={ss.notification}>
      <Tabs
        items={getItems}
        tabPosition="left"
        onChange={handleChange}
        activeKey={activeKey}
        destroyInactiveTabPane
      />

      <Footer onSave={handleSave} setCurrent={setTab} isEnd />
    </div>
  );
};

export default Notification;
