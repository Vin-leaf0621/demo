import { Checkbox, Divider, Tree } from 'antd';
import { useState } from 'react';
import ss from './index.less';

const CHECK_ALL_VALUE = {
  none: 'none',
  indeterminate: 'indeterminate',
  all: 'all',
};

const DeptTree = ({ depts, value, onChange }) => {
  const [checkAll, setCheckAll] = useState(CHECK_ALL_VALUE['none']);

  const getAllIds = () => {
    let ids = [];

    function getIds(data = []) {
      data.forEach((item) => {
        ids = [...ids, item.id];

        if ((item?.subBizDept ?? []).length) {
          getIds(item?.subBizDept);
        }
      });
    }

    getIds(depts);

    return ids;
  };

  const isCheckAll = (checkList) => {
    const allData = getAllIds()
      .sort((a, b) => a - b)
      .join(',');
    const currentData = checkList.sort((a, b) => a - b).join(',');
    return allData === currentData;
  };

  const onCheck = (checkedKeys) => {
    const { checked = [] } = checkedKeys;
    onChange?.(checked);
    setCheckAll(
      checked?.length
        ? isCheckAll(checked)
          ? CHECK_ALL_VALUE['all']
          : CHECK_ALL_VALUE['indeterminate']
        : CHECK_ALL_VALUE['none'],
    );
  };

  const onCheckAll = (e) => {
    const { checked } = e.target;
    onChange?.(checked ? getAllIds() : []);
    setCheckAll(checked ? CHECK_ALL_VALUE['all'] : CHECK_ALL_VALUE['none']);
  };

  return (
    <div className={ss.deptTree}>
      <Checkbox
        checked={checkAll === CHECK_ALL_VALUE['all']}
        indeterminate={checkAll === CHECK_ALL_VALUE['indeterminate']}
        onChange={onCheckAll}
      >
        全部科室
      </Checkbox>
      <Divider />
      <Tree
        checkable
        selectable={false}
        defaultExpandAll
        treeData={depts}
        onCheck={onCheck}
        checkedKeys={value}
        fieldNames={{ title: 'name', key: 'id', children: 'subBizDept' }}
        checkStrictly
      />
    </div>
  );
};

export default DeptTree;
