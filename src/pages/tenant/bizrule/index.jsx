import { useState, useEffect, useCallback } from 'react';
import { history, useDispatch, useSelector } from '@umijs/max';
import classNames from 'classnames';
import useQuery from '@/hooks/useQuery';
import Modules from './components/moduleitem';
import ss from './index.less';
import Icon from '@/components/icon';

const BizRule = () => {
  const { id, hisId, tenantId, name, copyHisId, isEdit, bizId, isView } =
    useQuery();
  const dispatch = useDispatch();
  const { copyBusinessList } = useSelector((state) => state.tenant);
  const [unSavedList, setUnSavedList] = useState(copyBusinessList);
  const [activeKey, setActiveKey] = useState(
    copyBusinessList?.length ? copyBusinessList[0].businessId : null,
  );
  const [selectedName, setSelectedName] = useState(
    copyBusinessList?.length ? copyBusinessList[0].name : null,
  );

  const handleChange = (key, name) => {
    setSelectedName(name);
    setActiveKey(key);
  };

  const handleNext = () => {
    const newList = unSavedList.filter((i) => i.businessId !== activeKey);
    setUnSavedList(newList);
    setActiveKey(newList[0].businessId);
  };

  const handleDelete = (id) => {
    const newList = unSavedList.filter((i) => i.businessId !== id);
    setUnSavedList(newList);
    setActiveKey(newList[0]?.businessId);
    if (!newList?.length) {
      history.back();
    }
  };

  useEffect(() => {
    return () => {
      dispatch({
        type: 'tenant/save',
        payload: {
          copyBusinessList: [],
          tenantConfigTabKey: null,
          selectedHisId: null,
        },
      });
    };
  }, []);

  return (
    <div className={ss.bizRule}>
      {Array.isArray(copyBusinessList) && copyBusinessList?.length > 1 ? (
        <div className={ss.left}>
          <div className={ss.title}>待确认业务与规则</div>
          {unSavedList.map((i) => (
            <div
              key={i.businessId}
              className={classNames(
                ss.item,
                i.businessId === activeKey && ss.activeItem,
              )}
            >
              <div
                className={ss.name}
                onClick={() => handleChange(i.businessId, i.name)}
              >
                {i.name}
              </div>
              <Icon
                type="icon-shanchu"
                className={ss.icon}
                onClick={() => handleDelete(i.businessId)}
              />
            </div>
          ))}
        </div>
      ) : null}
      <div className={ss.right}>
        <Modules
          id={id || activeKey}
          hisId={hisId}
          tenantId={tenantId}
          copyHisId={copyHisId}
          isNotback={unSavedList?.length > 1}
          handleNext={handleNext}
          isEdit={isEdit}
          name={name ?? selectedName}
          bizId={bizId}
          isView={isView}
        />
      </div>
    </div>
  );
};

export default BizRule;
