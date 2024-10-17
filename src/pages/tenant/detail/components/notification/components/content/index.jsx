import { useState, useEffect } from 'react';
import { Button, App, Divider } from 'antd';
import Front from '../front';
import Menu from '../menu';
import SmsPlatform from '../smsplatform';
import XcxMsg from '../xcxmsg';
import YunPian from '../yunpian';
import ss from './index.less';
import * as Api from '../../api';
import { MSG_DOCKING_KEY } from '@/pages/tenant/detail/_data';
import Empty from '@/components/empty';

const Content = ({
  terminalId,
  channel,
  tenantId,
  smsPlatInfo,
  isSms,
  submitSms,
  canSearch,
  userTerminal = [],
}) => {
  const { modal } = App.useApp();
  const [menuData, setMenuData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(); // 选中的通知场景
  const [templateDetail, setTemplateDetail] = useState(); // 通知场景详情
  const [bizName, setBizName] = useState();

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (selectedTemplate) {
      const res = menuData.filter(
        (i) =>
          !!i.noticeModuleRespVoList.filter(
            (item) => item.id === selectedTemplate,
          )?.length,
      )[0];
      setBizName(res?.business);
    }
  }, [selectedTemplate, menuData]);

  // 查询模板列表
  const fetchTemplateList = async (name, id, smsPlatId) => {
    if ((isSms && !smsPlatInfo && !smsPlatId) || smsPlatId === 0) {
      return;
    }
    setTemplateDetail(null);
    try {
      const res = await Api.fetchList({
        terminalId,
        channel,
        tenantId,
        smsPlatId: smsPlatId ?? (isSms ? smsPlatInfo?.id : undefined),
        name,
        userTerminal: userTerminal.join(','),
      });
      setMenuData(res);
      const changed = res.reduce((pre, cur) => {
        const res = cur.noticeModuleRespVoList.filter((i) =>
          [2, 3].includes(i.templateStatus),
        );
        return [...pre, ...res];
      }, []);
      if (changed?.length) {
        modal.warning({
          title: '后台消息模板被修改',
          content: `第三方短信平台存在已配置的短信模板被修改的情况，影响的通知场景：${changed
            .map((i) => i.name)
            .join('、')}，以上场景将变为‘未配置’，请重新配置`,
          okText: '确定',
        });
      }
      if (res?.length) {
        if (id || smsPlatId) {
          fetchTemplateDetail(id, smsPlatId);
        } else {
          setSelectedTemplate(res[0].noticeModuleRespVoList[0].id);
          if (selectedTemplate === res[0].noticeModuleRespVoList[0].id) {
            fetchTemplateDetail(res[0].noticeModuleRespVoList[0].id);
          }
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (canSearch) {
      fetchTemplateList();
    }
  }, [canSearch]);

  // 获取模板详情
  const fetchTemplateDetail = async (id, smsPlatId) => {
    try {
      const res = await Api.fetchTemplateDetail({
        terminalId,
        channel,
        tenantId,
        smsPlatId: smsPlatId ?? (isSms ? smsPlatInfo?.id : undefined),
        id: selectedTemplate,
      });
      setTemplateDetail(res);
    } catch (error) {}
  };

  useEffect(() => {
    if (selectedTemplate) {
      fetchTemplateDetail();
    }
  }, [selectedTemplate]);

  const renderRight = () => {
    if (isSms) {
      const CONTAINER_MAP = {
        [MSG_DOCKING_KEY.third_party]: YunPian,
        [MSG_DOCKING_KEY.front_machine]: Front,
      };

      const Container = CONTAINER_MAP[smsPlatInfo.docking];
      return (
        <Container
          detail={templateDetail}
          tenantId={tenantId}
          smsPlatInfo={smsPlatInfo}
          moduleId={selectedTemplate}
          submit={(res) => fetchTemplateList(undefined, res)}
          handleOpenModal={handleOpen}
        />
      );
    } else {
      // 小程序
      return (
        <XcxMsg
          detail={templateDetail}
          tenantId={tenantId}
          channel={channel}
          moduleId={selectedTemplate}
          terminalId={terminalId}
          submit={(res) => fetchTemplateList(undefined, res)}
        />
      );
    }
  };

  const handleSmsPlatChange = async () => {
    const res = await submitSms();
    await fetchTemplateList(undefined, selectedTemplate, res?.id ?? 0);
  };

  return (
    <>
      {isSms && !smsPlatInfo?.id ? (
        <div className={ss.empty}>
          <div className={ss.emptyContent}>
            <Empty
              title={
                <div>
                  尚未配置短信平台，
                  <Button
                    type="link"
                    className={ss.linkBtn}
                    onClick={handleOpen}
                  >
                    去配置
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      ) : (
        <div className={ss.content}>
          <div className={ss.left}>
            <Menu
              data={menuData.map((i, x) => ({
                ...i,
                id: 'p' + i.businessId,
                name: i.business,
                selectable: false,
              }))}
              expandedKey={menuData.map((i) => 'p' + i.businessId)}
              selectedTemplate={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              isSwitch={
                smsPlatInfo?.contentType === 'interface_define' && isSms
              }
              submit={fetchTemplateList}
            />
          </div>
          <Divider type="vertical" className={ss.divider} />
          <div className={ss.container}>
            <div className={ss.btn}>
              <div className={ss.name}>
                {bizName} {bizName ? '-' : ''} {templateDetail?.name}
              </div>
              {isSms ? (
                <Button onClick={handleOpen} type="link" className="actionBtn">
                  配置短信平台
                </Button>
              ) : null}
            </div>
            {templateDetail ? (
              <div className={ss.right}>{renderRight()}</div>
            ) : null}
          </div>
        </div>
      )}

      <SmsPlatform
        open={open}
        onCancle={() => setOpen(false)}
        data={smsPlatInfo}
        tenantId={tenantId}
        submit={handleSmsPlatChange}
      />
    </>
  );
};

export default Content;
