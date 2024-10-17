import { Cascader } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { getProvinceCity } from './api';

const CitySelector = React.forwardRef(
  ({ value, onChange, deepLength = 3, ...rest }, ref) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const values = value || [];

    const fetchCities = useCallback(async () => {
      let data = null;
      try {
        data = await getProvinceCity({
          parentCode: 0,
        });
      } catch (err) {
        data = [];
      }
      const res = data.map((item) => ({ ...item, isLeaf: false }));
      setProvinces(res);
    }, []);

    useEffect(() => {
      fetchCities();
    }, []);

    const handleChange = (val) => {
      onChange?.(val);
    };

    const fetchChild = async (selectedOptions) => {
      try {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        const { code } = selectedOptions[selectedOptions.length - 1];
        const data = await getProvinceCity({
          parentCode: code,
        });
        targetOption.loading = false;
        if (data?.length > 0) {
          targetOption.children = data.map((item) => ({
            ...item,
            isLeaf: !(selectedOptions?.length < deepLength - 1),
          }));
          setProvinces([...provinces]);
        } else {
          // 如果没有子节点，就设置为叶子节点，并且自动选中该节点
          targetOption.isLeaf = true;
          setProvinces([...provinces]);
          setDropdownVisible(false);
          onChange?.(selectedOptions.map((item) => item.code));
        }
      } catch (error) {}
    };

    return (
      <Cascader
        ref={ref}
        placeholder="请选择"
        {...rest}
        open={dropdownVisible}
        fieldNames={{ label: 'name', value: 'code' }}
        value={values}
        options={provinces}
        onChange={handleChange}
        onDropdownVisibleChange={setDropdownVisible}
        loadData={fetchChild}
      />
    );
  },
);

export default CitySelector;
