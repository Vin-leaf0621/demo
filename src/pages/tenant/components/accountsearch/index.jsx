import { useDebounceFn } from 'ahooks';
import { Select } from 'antd';
import { uniqBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { post } from '@/utils/request';

const AccountSearch = ({ value = {}, onChange, initialArr }) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [searchStr, setSearchStr] = useState();
  const pageNumber = useRef(1);
  const isEnd = useRef(false);

  const containsNumber = (str) => {
    let reg = /\d/;
    return reg.test(str);
  };

  const fetchList = async (val) => {
    setLoading(true);
    try {
      const {
        dataList = [],
        totalCount,
        ...res
      } = await post('/api/foundation/operator/account/find-accounts', {
        pageNo: pageNumber.current,
        pageSize: 10,
        name: containsNumber(val) ? undefined : val,
        jobNum: containsNumber(val) ? val : undefined,
      });

      if (Number(totalCount) <= res.pageNo * res.pageSize || !dataList) {
        isEnd.current = true;
      } else {
        isEnd.current = false;
      }

      if (pageNumber.current === 1) {
        const lists = [...dataList, ...(initialArr ?? [])];
        const uniqList = initialArr?.length
          ? uniqBy(lists, 'developerAccountId')
          : lists;
        setList(uniqList);
      } else {
        setList((pre) => {
          const uniqList = initialArr?.length
            ? uniqBy([...pre, ...dataList], 'developerAccountId')
            : [...pre, ...dataList];
          return uniqList;
        });
      }
    } catch (error) {
      isEnd.current = true;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const { run } = useDebounceFn(
    (val) => {
      pageNumber.current = 1;
      setSearchStr(val);
      fetchList(val);
    },
    {
      wait: 500,
    },
  );

  const handleChange = (val, option) => {
    onChange?.({
      developerAccountId: option.developerAccountId,
      name: option.name,
    });
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
      value={value.developerAccountId}
      showSearch
      placeholder="请选择"
      options={list}
      onChange={handleChange}
      onSearch={run}
      filterOption={false}
      onPopupScroll={handleScroll}
      loading={loading}
      onClear={handleClear}
      style={{ width: 312 }}
      fieldNames={{
        label: 'name',
        value: 'developerAccountId',
      }}
    />
  );
};

export default AccountSearch;
