import { Button, Popconfirm, App } from 'antd';
import { useState, useEffect } from 'react';
import Icon from '@/components/icon';
import MobileDrawer from '../mobiledrawer';
import ss from './index.less';
import * as Api from '../../api';
import { CHANNEL_TYPE, MOBILE_TERMINAL } from '@/pages/tenant/detail/_data';
import Footer from '../../../footer';

const MobileTerminal = ({ type, tenantId, setTab }) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState();
  const [terminalList, setTerminalList] = useState([]);

  const handleOpen = (id = null) => {
    setEditId(id);
    setOpen(true);
  };

  // 获取终端列表
  const fetchList = async () => {
    try {
      const res = await Api.fetchList({
        tenantId,
      });
      setTerminalList(res || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // 删除
  const handleDelete = async (id) => {
    try {
      await Api.deleteTerminal({ id });
      message.success('删除成功！', 1.5, () => {
        fetchList();
      });
    } catch (error) {}
  };

  const handleSave = (isContinue) => {
    if (isContinue) {
      setTab((pre) => pre + 1);
    } else {
      history.back();
    }
  };

  return (
    <div className={ss.mobileTerminal}>
      <p className={ss.tips}>配置前需先到对应渠道后台申请终端</p>

      <div className={ss.terminals}>
        {terminalList.map((item) => (
          <div className={ss.item} key={item.id}>
            <div className={ss.left}>
              <div className={ss.image}>
                <img src={item.url} />
              </div>
              <div className={ss.info}>
                <div className={ss.title}>{item.name}</div>
                <div className={ss.channel}>
                  渠道：{CHANNEL_TYPE[item.channel].name}
                </div>
                <div className={ss.terminal}>
                  终端类型：{MOBILE_TERMINAL[item.userTerminal]?.name}
                </div>
              </div>
            </div>
            <div className={ss.right}>
              <Button
                type="link"
                className="actionBtn"
                onClick={() => handleOpen(item.id)}
              >
                编辑
              </Button>
              <Popconfirm
                title="删除终端终端的相关配置将不可恢复，是否继续？"
                onConfirm={() => handleDelete(item.id)}
              >
                <Button type="link" className="actionBtn">
                  删除
                </Button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
      <Button className={ss.addBtn} onClick={() => handleOpen()}>
        <Icon type="icon-jiahao" style={{ marginRight: 8 }} />
        添加终端
      </Button>
      <Footer onSave={handleSave} setCurrent={setTab} />

      <MobileDrawer
        open={open}
        onClose={() => setOpen(false)}
        submit={fetchList}
        editId={editId}
        tenantId={tenantId}
      />
    </div>
  );
};

export default MobileTerminal;
