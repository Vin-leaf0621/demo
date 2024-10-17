import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Table, Checkbox } from 'antd';
import {
  convertToChinaNum,
  formatDataSource,
  getHigherIds,
  getLowerIds,
  getResourcesInfo,
  uniqueArr,
} from './utils';

import ss from './index.less';

const Widget = (props) => {
  const { onChange, disabled, resources, sourceIds } = props;
  const resourcesIdsMap = useRef({});
  const [maxLevel, setMaxLevel] = useState(0); // 最大层级
  const [checkedIds, setCheckedIds] = useState([]); // 选中的权限id
  const [dataSource, setDataSource] = useState([]); // 权限表格数据

  useEffect(() => {
    const resourcesInfo = getResourcesInfo(resources);
    resourcesIdsMap.current = resourcesInfo.resourcesIdsMap;
    setMaxLevel(resourcesInfo.depth);
    setDataSource(formatDataSource(resources, resourcesInfo.depth));

    init();
  }, [sourceIds, resources]);

  const init = useCallback(() => {
    if (!sourceIds?.length) return;
    setCheckedIds(sourceIds);
    onChange?.([...sourceIds]);
  }, [sourceIds]);

  const onCheckChange = useCallback(
    (checked, level_data, key) => {
      const data = dataSource[key];
      const currentId = level_data.id;
      const lowerIds = getLowerIds(level_data, data);
      const higherIds = getHigherIds(level_data, resourcesIdsMap.current);
      // 之前选中的id
      const prevIds = [...checkedIds];
      // 选择状态改变必受影响的id
      let changeIds = [];
      // 当前选择的id
      let ids = [];
      // 选中
      if (checked) {
        changeIds = [...lowerIds, currentId, ...higherIds];
        ids = uniqueArr([...prevIds, ...changeIds]);
      } else {
        changeIds = [currentId, ...higherIds];
        // 清除受影响的id
        ids = prevIds.filter((id) => !changeIds.includes(id));
      }
      setCheckedIds(ids);
      onChange?.([...ids]);
    },
    [checkedIds, dataSource],
  );

  const renderLevelData = (level_data, key) => {
    const empty = <span className={ss.empty}>-</span>;
    // 数组（最后一级）
    if (Array.isArray(level_data)) {
      return level_data.length > 0 ? (
        <div>
          {level_data.map((item) => (
            <Checkbox
              key={item.id}
              checked={checkedIds.includes(item.id)}
              disabled={disabled}
              onChange={(e) => {
                onCheckChange(e.target.checked, item, key);
              }}
            >
              {item.name}
            </Checkbox>
          ))}
        </div>
      ) : (
        empty
      );
    }
    //无内容
    if (!level_data?.id) {
      return empty;
    }
    return (
      <Checkbox
        key={level_data.id}
        checked={checkedIds.includes(level_data.id)}
        disabled={disabled}
        onChange={(e) => {
          onCheckChange(e.target.checked, level_data, key);
        }}
      >
        {level_data.name}
      </Checkbox>
    );
  };

  const columns = useMemo(() => {
    const columnsArr = [];
    for (let i = 1; i <= maxLevel; i++) {
      const isLast = i === maxLevel && i !== 1;
      columnsArr.push({
        title: isLast ? '操作' : `${convertToChinaNum(i)}级菜单`,
        key: `level_${i}_data`,
        width: isLast ? 600 : 220,
        render: (_, record) => {
          const { key } = record;
          const levelData = record[`level_${i}_data`];
          return renderLevelData(levelData, key);
        },
        onCell: (record) => {
          const levelData = record[`level_${i}_data`];
          return {
            rowSpan: levelData?.rowSpan ?? 1,
          };
        },
      });
    }

    return columnsArr;
  });

  return (
    <div className={ss.widget}>
      <Table
        dataSource={dataSource}
        bordered
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default Widget;
