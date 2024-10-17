import { Drawer, Button, Popconfirm, Checkbox, App } from 'antd';
import { useState } from 'react';
import { history, useDispatch } from '@umijs/max';
import SearchSelect from '@/components/searchselect';
import { BIZ_STATUS_MAP, TAB_KEY } from '@/pages/tenant/detail/_data';
import ss from './index.less';
import * as Api from '../../api';

const CopyModal = ({
  visible,
  onCancle,
  hisId,
  tenantId,
  submit,
  currentHisBiz,
}) => {
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const [selectedHisId, setSelectedHisId] = useState();
  const [bizList, setBizList] = useState([]);
  const [checkedBiz, setCheckedBiz] = useState([]);
  const checkAll = bizList.length === checkedBiz.length;
  const indeterminate =
    checkedBiz.length > 0 && checkedBiz.length < bizList.length;

  // 关闭弹窗
  const handleCancle = () => {
    setSelectedHisId(null);
    setBizList([]);
    onCancle?.();
  };

  // 医院变化
  const handleHisChange = async (val) => {
    try {
      if (val) {
        const res = await Api.getOtherBusiness({
          otherHisId: val,
          hisId,
          tenantId,
        });
        // 将业务加上当前医院该业务状态
        const newArr = (res || []).map((item) => {
          const targetItem = currentHisBiz.find(
            (i) => i.businessId === item.businessId,
          );

          return {
            ...item,
            currentHisBizStatus: targetItem?.status,
          };
        });

        const uniqList = newArr.filter(
          (i) => i.currentHisBizStatus !== BIZ_STATUS_MAP.online,
        );
        setCheckedBiz([]);
        setSelectedHisId(val);
        setBizList(uniqList);
      }
    } catch (error) {}
  };

  // 全选
  const handleSelectAll = async (e) => {
    const { checked } = e.target;
    try {
      if (!bizList?.length) return;
      const allIds = bizList.map((i) => i.businessId);
      setCheckedBiz(checked ? allIds : []);
    } catch (error) {}
  };

  // 选择框变化
  const handleCheckboxChange = (list) => {
    setCheckedBiz(list);
  };

  // 去确认
  const handleToConfirm = () => {
    if (!checkedBiz?.length) {
      message.warning('请选择需要进行操作的业务！');
      return;
    }

    const copyBusinessList = bizList.filter((i) =>
      checkedBiz.includes(i.businessId),
    );

    dispatch({
      type: 'tenant/save',
      payload: {
        tenantConfigTabKey: TAB_KEY.bizRule,
        copyBusinessList,
        selectedHisId: hisId,
      },
    });

    history.push(
      `/tenant/bizrule?copyHisId=${selectedHisId}&hisId=${hisId}&tenantId=${tenantId}`,
    );
  };

  // 一键复制
  const handleCopy = async () => {
    if (!checkedBiz?.length) {
      message.warning('请选择需要进行操作的业务！');
      return;
    }

    try {
      await Api.copyBusiness({
        tenantId,
        hisId,
        otherHisId: selectedHisId,
        businessIds: checkedBiz,
      });

      message.success('复制成功！', 1.5, () => {
        handleCancle?.();
        submit();
      });
    } catch (error) {}
  };

  return (
    <Drawer
      open={visible}
      width={644}
      title={
        <div className={ss.modalTitle}>
          <p>复制其他业务</p>
          <p>复制本院已添加的业务后其业务规则将被覆盖</p>
        </div>
      }
      onClose={handleCancle}
      footer={
        <>
          <Button onClick={handleCancle}>取消</Button>
          <Button type="primary" onClick={handleToConfirm}>
            去确认
          </Button>
          {checkedBiz.filter((item) =>
            [BIZ_STATUS_MAP.config, BIZ_STATUS_MAP.offline].includes(
              bizList.find((i) => i.businessId === item)?.currentHisBizStatus,
            ),
          ).length ? (
            <Popconfirm
              title={`${bizList
                .filter(
                  (i) =>
                    checkedBiz.includes(i.businessId) &&
                    [BIZ_STATUS_MAP.config, BIZ_STATUS_MAP.offline].includes(
                      i.currentHisBizStatus,
                    ),
                )
                .map((i) => i.name)
                .join('、')}已经存在，其他业务规则将被覆盖，是否继续？`}
              onConfirm={handleCopy}
            >
              <Button type="primary">一键复制</Button>
            </Popconfirm>
          ) : (
            <Button type="primary" onClick={handleCopy}>
              一键复制
            </Button>
          )}
        </>
      }
      className={ss.modal}
    >
      <div className={ss.content}>
        <div>
          <span>选择医院：</span>
          <SearchSelect
            placeholder="请选择"
            fetchApi="/api/foundation/operator/his/simple-page"
            searchName="hisIdOrName"
            searchParams={{ hasTenant: false }}
            options={{
              style: { width: 328 },
              allowClear: true,
              fieldNames: {
                label: 'hisIdAndName',
                value: 'hisId',
              },
            }}
            value={selectedHisId}
            onChange={handleHisChange}
          />
        </div>
        <div className={ss.biz}>
          <span>选择业务：</span>
          {selectedHisId ? (
            bizList.length ? (
              <Checkbox
                indeterminate={indeterminate}
                checkAll={checkAll}
                onChange={handleSelectAll}
              >
                全选
              </Checkbox>
            ) : (
              '该医院暂无业务，请重新选择医院'
            )
          ) : (
            '请先在上方选择医院'
          )}
        </div>
        <Checkbox.Group value={checkedBiz} onChange={handleCheckboxChange}>
          <div className={ss.modalContent}>
            {bizList.map((i) => (
              <div className={ss.bizItem} key={i.businessId}>
                <div className={ss.title}>
                  <div className={ss.titLeft}>
                    <div className={ss.name}>{i.name}</div>
                    {[BIZ_STATUS_MAP.config, BIZ_STATUS_MAP.offline].includes(
                      i.currentHisBizStatus,
                    ) ? (
                      <div className={ss.titRight}>已添加</div>
                    ) : null}
                  </div>
                  <Checkbox value={i.businessId} />
                </div>
                <div className={ss.description}>{i?.remark}</div>
              </div>
            ))}
          </div>
        </Checkbox.Group>
      </div>
    </Drawer>
  );
};

export default CopyModal;
