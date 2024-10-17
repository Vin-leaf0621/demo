import Icon from '@/components/icon';
import { App, Button, Checkbox, Space, Popconfirm } from 'antd';
import { useState, useEffect } from 'react';
import { history, useDispatch } from '@umijs/max';
import {
  BIZ_STATUS,
  BIZ_STATUS_MAP,
  TAB_KEY,
} from '@/pages/tenant/detail/_data';
import AddModal from '../addmodal';
import CopyModal from '../copymodal';
import Empty from '@/components/empty';
import ss from './index.less';
import * as Api from '../../api';

const Content = ({ hisId, tenantId }) => {
  const { message } = App.useApp();
  const dispatch = useDispatch();
  const [bizList, setBizList] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);
  const [checkedBiz, setCheckedBiz] = useState([]);

  // 获取业务
  const fetchBusinessList = async () => {
    try {
      const res = await Api.fetchBusinessList({
        hisId,
      });
      setBizList(res || []);
    } catch (error) {}
  };

  useEffect(() => {
    fetchBusinessList();
  }, []);

  // 选择业务
  const handleChange = (list) => {
    setCheckedBiz(list);
  };

  // 批量上线
  const handleOnline = async (businessId) => {
    if (!businessId && !checkedBiz?.length) {
      message.warning('请选择需要上线的业务');
      return;
    }

    try {
      await Api.onlineBusiness({
        hisId,
        tenantId,
        businessIds: businessId ? [businessId] : checkedBiz,
      });

      message.success('操作成功！', 1.5, () => {
        fetchBusinessList();

        if (checkedBiz?.length) {
          setCheckedBiz([]);
        }
      });
    } catch (error) {}
  };

  // 批量上线
  const handleOffline = async (businessId) => {
    if (!businessId && !checkedBiz?.length) {
      message.warning('请选择需要下线的业务');
      return;
    }

    try {
      await Api.offlineBusiness({
        hisId,
        tenantId,
        businessIds: businessId ? [businessId] : checkedBiz,
      });

      message.success('操作成功！', 1.5, () => {
        fetchBusinessList();

        if (checkedBiz?.length) {
          setCheckedBiz([]);
        }
      });
    } catch (error) {}
  };

  // 删除
  const deleteBiz = async (businessId, id) => {
    try {
      await Api.deleteBusiness({
        id,
        tenantId,
        hisId,
        businessId,
      });

      message.success('删除成功！', 1.5, () => {
        fetchBusinessList();
      });
    } catch (error) {}
  };

  // 跳转业务配置
  const handleToRule = (businessId, name, isEdit, id, isView) => {
    dispatch({
      type: 'tenant/save',
      payload: {
        tenantConfigTabKey: TAB_KEY.bizRule,
        selectedHisId: hisId,
      },
    });
    history.push(
      `/tenant/bizrule?id=${businessId}${
        id ? `&bizId=${id}` : ''
      }&name=${name}&hisId=${hisId}&tenantId=${tenantId}${
        isEdit ? '&isEdit=true' : ''
      }${isView ? '&isView=true' : ''}`,
    );
  };

  // 业务操作
  const handleClick = async (type, businessId, name, id) => {
    switch (type) {
      case '去配置':
        handleToRule(businessId, name);
        break;
      case '修改配置':
        handleToRule(businessId, name, true, id);
        break;
      case '上线':
        await handleOnline(businessId);
        break;
      case '下线':
        await handleOffline(businessId);
        break;
      case '删除':
        await deleteBiz(businessId, id);
        break;
      case '查看':
        handleToRule(businessId, name, true, id, true);
        break;
      default:
        console.log('未知操作');
    }
  };

  return (
    <div className={ss.bizContent}>
      <Space className={ss.btns}>
        <Button type="primary" onClick={() => setAddOpen(true)}>
          <Icon type="icon-jiahao" />
          添加业务
        </Button>

        <Button onClick={() => setCopyOpen(true)}>复制他院业务</Button>

        <Button onClick={() => handleOnline()}>批量上线</Button>

        <Popconfirm
          title="下线后当前医院将失去业务的相关菜单及操作权限，是否继续？"
          onConfirm={() => handleOffline()}
        >
          <Button>批量下线</Button>
        </Popconfirm>
      </Space>
      <div className={ss.tips}>
        配置后的业务需进行上线操作才会有对应的菜单及操作权限
      </div>

      {bizList.length ? (
        <Checkbox.Group onChange={handleChange} value={checkedBiz}>
          <div className={ss.bizRules}>
            {bizList.map((item) => (
              <div className={ss.bizRule} key={item.businessId}>
                <div className={ss.header}>
                  <div className={ss.headerLeft}>
                    <Checkbox value={item.businessId} />
                    <span className={ss.name}>{item.name}</span>
                  </div>
                  <div
                    className={ss.headerRight}
                    style={BIZ_STATUS[item.status].style}
                  >
                    {BIZ_STATUS[item.status].name}
                  </div>
                </div>
                <div className={ss.description}>{item?.remark}</div>
                <div className={ss.footer}>
                  {BIZ_STATUS[item.status].opts.map((i) =>
                    ['下线', '删除'].includes(i) ? (
                      <Popconfirm
                        key={i}
                        title={
                          i === '删除'
                            ? '删除后该业务的相关数据将清除，是否继续？'
                            : '下线后当前医院将失去业务的相关菜单及操作权限，是否继续？'
                        }
                        onConfirm={() =>
                          handleClick(i, item.businessId, item.name, item.id)
                        }
                      >
                        <Button type="link" className="actionBtn">
                          {i}
                        </Button>
                      </Popconfirm>
                    ) : (
                      <Button
                        type="link"
                        className="actionBtn"
                        key={i}
                        onClick={() =>
                          handleClick(i, item.businessId, item.name, item.id)
                        }
                      >
                        {i}
                      </Button>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
        </Checkbox.Group>
      ) : (
        <div className={ss.emptyContent}>
          <div className={ss.empty}>
            <Empty title="暂无业务，请在左上角选择添加或复制他院业务" />
          </div>
        </div>
      )}

      <AddModal
        visible={addOpen}
        onCancle={() => setAddOpen(false)}
        hisId={hisId}
        handleToRule={handleToRule}
        tenantId={tenantId}
        addedList={bizList.map((i) => i.businessId)}
      />

      <CopyModal
        visible={copyOpen}
        onCancle={() => setCopyOpen(false)}
        hisId={hisId}
        tenantId={tenantId}
        submit={fetchBusinessList}
        currentHisBiz={bizList}
      />
    </div>
  );
};

export default Content;
