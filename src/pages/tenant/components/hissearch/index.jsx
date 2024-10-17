import { useDebounceFn } from 'ahooks';
import { Select, App } from 'antd';
import { useEffect, useRef, useState } from 'react';
import * as Api from './api';
import { uniqBy } from 'lodash';

const Widget = ({
  value,
  onChange,
  initialArr,
  validateIsAdd,
  initialHisList = [],
  ...rest
}) => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [selectVal, setSelectVal] = useState();
  const [searchStr, setSearchStr] = useState();
  const pageNumber = useRef(1);
  const isEnd = useRef(false);

  useEffect(() => {
    setSelectVal(value?.hisId);
  }, [value]);

  const fetchList = async (val) => {
    setLoading(true);
    try {
      const { dataList = [], totalCount } = await Api.fetchHis({
        pageNo: pageNumber.current,
        pageSize: 10,
        hisIdOrName: val ? val : undefined,
        hasTenant: false,
      });
      if (Number(totalCount) <= pageNumber.current * 10) {
        isEnd.current = true;
      } else {
        isEnd.current = false;
      }
      if (pageNumber.current === 1) {
        const lists = [...dataList, ...(initialArr ?? [])];
        const uniqList = initialArr?.length ? uniqBy(lists, 'hisId') : lists;
        setList(uniqList);
      } else {
        setList((pre) => {
          const uniqList = initialArr?.length
            ? uniqBy([...pre, ...dataList], 'hisId')
            : [...pre, ...dataList];
          return uniqList;
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const { run } = useDebounceFn(
    (val) => {
      setSearchStr(val);
      pageNumber.current = 1;
      fetchList(val);
    },
    {
      wait: 500,
    },
  );

  const handleChange = async (val) => {
    try {
      const isAdd = validateIsAdd(val);
      if (isAdd) {
        message.warning('该医院已入驻！');
        setSelectVal(null);
        return;
      }
      if (val && !initialHisList.includes(val)) {
        await Api.verify({
          hisId: val,
        });
      }
      const res = list.find((item) => item.hisId === val);
      await onChange?.(res);
    } catch (error) {
      setSelectVal(null);
      onChange?.(null);
    }
  };

  const handleScroll = async (e) => {
    if (isEnd.current) return;
    const { scrollTop, offsetHeight, scrollHeight } = e.target;
    if (scrollTop + offsetHeight >= scrollHeight) {
      pageNumber.current += 1;
      await fetchList(searchStr);
    }
  };

  const handleClear = () => {
    if (searchStr) {
      pageNumber.current = 1;
      setSearchStr(null);
      fetchList();
    }
  };

  return (
    <Select
      value={selectVal}
      showSearch
      allowClear
      placeholder="请输入HIS_ID或医院名称查询"
      onChange={handleChange}
      onSearch={run}
      filterOption={false}
      onPopupScroll={handleScroll}
      onClear={handleClear}
      loading={loading}
      options={list}
      fieldNames={{ label: 'hisIdAndName', value: 'hisId' }}
      {...rest}
    />
  );
};

export default Widget;
