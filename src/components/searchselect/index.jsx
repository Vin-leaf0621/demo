import { useDebounceFn } from 'ahooks';
import { Select } from 'antd';
import { uniqBy } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { post } from '@/utils/request';

const SearchSelect = ({
  fetchApi,
  options = {},
  value,
  onChange,
  searchName = 'name',
  searchParams,
  initialArr, // 回显数据时，传入的初始数据数组（格式[{label, value}]）,至少包含label与value
  uniqKey = 'id',
  pageSize = 10,
  selectFirst = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const [searchStr, setSearchStr] = useState();
  const pageNumber = useRef(1);
  const isEnd = useRef(false);

  const fetchList = async (val) => {
    setLoading(true);
    try {
      const {
        dataList = [],
        totalCount,
        ...res
      } = await post(fetchApi, {
        pageNo: pageNumber.current,
        pageSize,
        [searchName]: val ? val : undefined,
        ...searchParams,
      });

      if (Number(totalCount) <= res.pageNo * res.pageSize || !dataList) {
        isEnd.current = true;
      } else {
        isEnd.current = false;
      }

      if (pageNumber.current === 1) {
        const lists = [...dataList, ...(initialArr ?? [])];
        const uniqList = initialArr?.length ? uniqBy(lists, uniqKey) : lists;
        setList(uniqList);
      } else {
        setList((pre) => {
          const uniqList = initialArr?.length
            ? uniqBy([...pre, ...dataList], uniqKey)
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

  const handleChange = (val) => {
    onChange?.(val);
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
      value={value}
      showSearch
      placeholder="请选择"
      options={list}
      onChange={handleChange}
      onSearch={run}
      filterOption={false}
      onPopupScroll={handleScroll}
      loading={loading}
      onClear={handleClear}
      {...options}
    />
  );
};

export default SearchSelect;
