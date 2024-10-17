import { Cascader } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { getDept } from './api';
import { useUpdateEffect } from 'ahooks';
import { useDispatch } from '@umijs/max';

const StandardDept = React.forwardRef(
  ({ searchVal, value, onChange, ...rest }, ref) => {
    const dispatch = useDispatch();
    const [depts, setDepts] = useState([]);
    const values = value || [];
    const [searchValue, setSearchValue] = useState();
    const [open, setOpen] = useState(false);

    useUpdateEffect(() => {
      setOpen(true);
      setSearchValue(searchVal);
    }, [searchVal]);

    const fetchDepts = useCallback(async () => {
      let data = null;
      try {
        data = await getDept();
        dispatch({
          type: 'manageSubjectDepartment/save',
          payload: {
            standardDepts: data,
          },
        });
      } catch (err) {
        data = [];
      }
      setDepts(data);
    }, []);

    useEffect(() => {
      fetchDepts();
    }, []);

    const handleChange = (val) => {
      setSearchValue(null);
      onChange?.(val);
    };

    const filter = (inputValue, path) =>
      path.some(
        (option) =>
          option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
      );

    const handleSearch = (search) => {
      setSearchValue(search);
    };

    return (
      <Cascader
        ref={ref}
        fieldNames={{ label: 'name', value: 'code', children: 'subDept' }}
        value={values}
        options={depts}
        onChange={handleChange}
        placeholder="请选择"
        changeOnSelect
        showSearch={{
          filter,
        }}
        searchValue={searchValue}
        onSearch={handleSearch}
        open={open}
        onDropdownVisibleChange={(val) => setOpen(val)}
        {...rest}
      />
    );
  },
);

export default StandardDept;
