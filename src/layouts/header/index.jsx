/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { Dropdown } from 'antd';
import { history, useModel } from 'umi';
import logo from '@/resources/images/public/logo.png';
import ss from './index.less';

/* TODO: 修改代码 */
const Header = () => {
  const { initialState } = useModel('@@initialState');

  const dropItems = useMemo(() => {
    return [
      {
        key: 'logout',
        label: '退出登录',
        onClick: async () => {
          history.push('/login');
        },
      },
    ];
  }, []);

  return (
    <div className={ss.header}>
      <div className={ss.leftBox}>
        <img src={logo} className={ss.logo} />
        <p className={ss.title}>海鹚PC</p>
      </div>
      <div className={ss.rightBox}>
        <Dropdown menu={{ items: dropItems }}>
          <div className={ss.name}>{initialState?.account?.name}</div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
