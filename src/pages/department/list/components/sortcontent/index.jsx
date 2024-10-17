import { useState, useEffect } from 'react';
import SortItem from './components/sortitem';
import ss from './index.less';
import { produce } from 'immer';
import { Button } from 'antd';
import { flattren } from './util';

const DEPT_LEVEL_INFO = [
  {
    title: '一级科室',
    value: 'firstDept',
    dataKey: 'firstDepts',
  },
  {
    title: '二级科室',
    value: 'secondDept',
    dataKey: 'secondDepts',
  },
  {
    title: '三级科室',
    value: 'thirdDept',
    dataKey: 'thirdDepts',
  },
];

const SortContent = ({ treeData, submit, setIsSort }) => {
  const [deptData, setDeptData] = useState([]);
  const [deptInfo, setDeptInfo] = useState({});

  useEffect(() => {
    setDeptData(treeData);
  }, [treeData]);

  useEffect(() => {
    if (treeData?.length) {
      const secondDepts = treeData[0]?.subBizDept ?? [];
      const thirdDepts = secondDepts[0]?.subBizDept ?? [];

      setDeptInfo((pre) => ({
        ...pre,
        firstDepts: treeData,
        firstDept: treeData[0]?.id,
        secondDepts,
        secondDept: secondDepts[0]?.id,
        thirdDepts,
        thirdDept: thirdDepts[0]?.id,
      }));
    }
  }, [treeData]);

  // 选择科室
  const handleChangeSelect = (val, id, subBizDept = []) => {
    let res = {};
    switch (val) {
      case 'firstDept':
        res = {
          secondDepts: subBizDept,
          secondDept: subBizDept[0]?.id,
          thirdDepts: subBizDept[0]?.subBizDept ?? [],
          thirdDept: (subBizDept[0]?.subBizDept ?? [])[0]?.id,
        };
        break;
      case 'secondDept':
        res = {
          thirdDepts: subBizDept,
          thirdDept: subBizDept[0]?.id,
        };
        break;
      default:
        res = {};
        break;
    }
    setDeptInfo((pre) => ({ ...pre, [val]: id, ...res }));
  };

  const handleChange = (value, key) => {
    let firstList = [],
      secondList = [],
      thirdList = [];
    switch (key) {
      case 'firstDept':
        firstList = value;
        secondList = deptInfo?.secondDepts;
        thirdList = deptInfo?.thirdDepts;
        break;
      case 'secondDept':
        firstList = produce(deptData, (state) => {
          const index = deptInfo.firstDepts.findIndex(
            (item) => item.id === deptInfo.firstDept,
          );
          state[index].subBizDept = value;
        });
        secondList = value;
        thirdList = deptInfo?.thirdDepts;
        break;
      case 'thirdDept':
        firstList = produce(deptData, (state) => {
          const firstIndex = deptInfo.firstDepts.findIndex(
            (item) => item.id === deptInfo.firstDept,
          );
          const secondIndex = deptInfo.secondDepts.findIndex(
            (item) => item.id === deptInfo.secondDept,
          );
          state[firstIndex].subBizDept[secondIndex].subBizDept = value;
        });
        secondList = produce(deptInfo.secondDepts, (state) => {
          const secondIndex = deptInfo.secondDepts.findIndex(
            (item) => item.id === deptInfo.secondDept,
          );
          state[secondIndex].subBizDept = value;
        });
        thirdList = value;
        break;
      default:
        break;
    }
    setDeptData(firstList);
    setDeptInfo((pre) => ({
      ...pre,
      firstDepts: firstList,
      secondDepts: secondList,
      thirdDepts: thirdList,
    }));
  };

  const handleSave = () => {
    const newArr = flattren(deptData);
    submit?.(newArr);
  };

  return (
    <div className={ss.sortContent}>
      <div className={ss.btns}>
        <Button type="primary" className={ss.btn} onClick={handleSave}>
          保存
        </Button>
        <Button className={ss.btn} onClick={() => setIsSort(false)}>
          取消
        </Button>
      </div>

      <div className={ss.list}>
        {DEPT_LEVEL_INFO.map((item) => (
          <SortItem
            key={item.value}
            title={item.title}
            data={deptInfo[item.dataKey]}
            activeKey={deptInfo[item.value]}
            handleChangeSelect={(id, subBizDept) =>
              handleChangeSelect(item.value, id, subBizDept)
            }
            onChange={(value) => handleChange(value, item.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default SortContent;
