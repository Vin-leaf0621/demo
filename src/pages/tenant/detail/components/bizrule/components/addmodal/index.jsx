import { Drawer, Checkbox, Button, Input, App } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { useDebounceFn } from 'ahooks';
import { history, useDispatch } from '@umijs/max';
import { TAB_KEY } from '@/pages/tenant/detail/_data';
import Icon from '@/components/icon';
import Empty from '@/components/empty';
import ss from './index.less';
import * as Api from '../../api';

const AddModal = ({ visible, onCancle, tenantId, addedList, hisId }) => {
  const [bizList, setBizList] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [searchVal, setSearchVal] = useState();
  const pageNumber = useRef(1);
  const isEnd = useRef(false);
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const checkAll = bizList.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < bizList.length;

  // 获取可配置业务
  const fetchBusiness = async () => {
    try {
      const {
        dataList = [],
        totalCount,
        ...res
      } = await Api.fetchBusiness({
        pageNo: pageNumber.current,
        pageSize: 30,
        status: 1, // 已上架
        name: searchVal,
      });

      if (Number(totalCount) <= res.pageNo * res.pageSize || !dataList) {
        isEnd.current = true;
      } else {
        isEnd.current = false;
      }

      const uniqList = dataList.filter((i) => !addedList.includes(i.id));

      if (pageNumber.current === 1) {
        setBizList(uniqList);
      } else {
        setBizList((pre) => [...pre, ...uniqList]);
      }
    } catch (error) {
      isEnd.current = true;
    }
  };

  useEffect(() => {
    if (visible) {
      fetchBusiness();
    }
  }, [visible, searchVal]);

  // 添加
  const handleToAdd = () => {
    if (!checkedList?.length) {
      message.warning('请选择需要添加的业务');
      return;
    }
    dispatch({
      type: 'tenant/save',
      payload: {
        tenantConfigTabKey: TAB_KEY.bizRule,
        copyBusinessList: checkedList,
      },
    });

    history.push(`/tenant/bizrule?hisId=${hisId}&tenantId=${tenantId}`);
  };

  const { run: handleScroll } = useDebounceFn(
    async (e) => {
      if (isEnd.current || !visible) return;
      const { scrollTop, offsetHeight, scrollHeight } = e.target;
      if (scrollTop + offsetHeight + 4 >= scrollHeight) {
        pageNumber.current += 1;
        await fetchBusiness();
      }
    },
    { wait: 100 },
  );

  const { run } = useDebounceFn(
    (e) => {
      const { value } = e.target;
      pageNumber.current = 1;
      setSearchVal(value);
    },
    { wait: 500 },
  );

  const handleCancle = () => {
    pageNumber.current = 1;
    isEnd.current = false;
    onCancle?.();
    setBizList([]);
    setCheckedList([]);
    setSearchVal(undefined);
  };

  const handleCheckChange = (item, checked) => {
    if (checked) {
      setCheckedList((pre) => [...pre, { ...item, businessId: item.id }]);
    } else {
      setCheckedList((pre) => pre.filter((i) => i.id !== item.id));
    }
  };

  const onCheckAllChange = (e) => {
    setCheckedList(
      e.target.checked ? bizList.map((i) => ({ ...i, businessId: i.id })) : [],
    );
  };

  return (
    <Drawer
      open={visible}
      width={645}
      title={
        <div className={ss.modalTitle}>
          <p>添加业务</p>
          <p>选择添加业务，将进入业务规则配置页面</p>
        </div>
      }
      onClose={handleCancle}
      footer={
        <div className={ss.footer}>
          <Button onClick={handleCancle}>取消</Button>
          <Button type="primary" onClick={handleToAdd}>
            确定
          </Button>
        </div>
      }
      className={ss.drawer}
      destroyOnClose
    >
      <div className={ss.content} onScroll={handleScroll}>
        <div className={ss.searchContent}>
          <Input
            prefix={<Icon type="icon-sousuo" className={ss.searchIcon} />}
            placeholder="请输入业务名称"
            style={{ width: 328 }}
            onChange={run}
          />
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选
          </Checkbox>
        </div>
        <div className={ss.modalContent}>
          {bizList?.length ? (
            bizList.map((item) => (
              <div
                className={ss.bizItem}
                key={item.id}
                onClick={() =>
                  handleCheckChange(
                    item,
                    !checkedList.map((i) => i.id).includes(item.id),
                  )
                }
              >
                <div className={ss.title}>
                  <div className={ss.name}>
                    <div className={ss.text}>{item.name}</div>
                    {/* <div className={ss.required}>必选</div> */}
                  </div>
                  <Checkbox
                    value={item.id}
                    checked={checkedList.map((i) => i.id).includes(item.id)}
                  />
                </div>
                <div className={ss.description}>{item?.remark}</div>
              </div>
            ))
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <div style={{ width: 500, height: 500 }}>
                <Empty title="暂无数据" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default AddModal;
