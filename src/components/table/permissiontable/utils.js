import { PERMISSION_RESOURCE_TYPE } from '@/constants/common';
//最小层级
export const MIN_LEVEL = 1;

export const convertToChinaNum = (num) => {
  const arr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  return arr[num];
};

// 简易版（数据结构类型已知）
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

// 生成层级数据key
const generateLevelDataKey = (level) => 'level_' + level + '_data';

// 层级数据处理
const formatLevelData = (data, level, lastLevel, maxLevel) => {
  // 统计合并行（父级加1）
  for (let i = MIN_LEVEL; i <= lastLevel - 1; i++) {
    const levelDataKey = generateLevelDataKey(i);
    data[levelDataKey].rowSpan = data[levelDataKey].rowSpan || 1;
    data[levelDataKey].rowSpan += 1;
  }

  // 清理当前层级及比当前层级高的的数据
  for (let i = level; i <= maxLevel; i++) {
    const levelDataKey = generateLevelDataKey(i);
    delete data[levelDataKey];
  }
};

// 设置合并行
const setRowSpan = (data, index, arr, maxLevel) => {
  for (let i = MIN_LEVEL; i <= maxLevel; i++) {
    const levelDataKey = generateLevelDataKey(i);
    const rowSpan = data[levelDataKey]?.rowSpan;
    // 临时标识，已完成合并
    const rowSpanFinish = data[levelDataKey]?.rowSpanFinish;
    // 无需合并
    if (!rowSpan || rowSpan <= 1) {
      continue;
    }
    // 合并完成，删除标识
    if (rowSpanFinish) {
      delete data[levelDataKey].rowSpanFinish;
      continue;
    }
    // 开始合并
    data[levelDataKey].rowSpan = 0;
    for (let j = 1; j <= rowSpan - 1; j++) {
      const target = arr[index + j][levelDataKey];
      if (j === rowSpan - 1) {
        target.rowSpan = rowSpan;
        target.rowSpanFinish = true;
      } else {
        target.rowSpan = 0;
      }
    }
  }
};

const filterHideMenu = (arr) => {
  return (arr || []).filter((item) => {
    return !(item.type === PERMISSION_RESOURCE_TYPE['menu'] && item.hideInMenu);
  });
};

// 格式化合并行
const addDataSourceRowSpan = (dataSource, maxLevel) => {
  // 深度遍历行合并统计放在合并行的最后一行数据，因此先反转
  const arr = dataSource.reverse();
  arr.forEach((item, index) => {
    setRowSpan(item, index, arr, maxLevel);
  });
  return arr.reverse();
};

// 添加key(数据位置无变化，用index为key)
const addDataSourceKey = (dataSource) => {
  dataSource.forEach((item, index) => {
    item.key = index;
  });
};

//  调整按钮权限放入最后一级
const adjustButtonLevel = (dataSource, maxLevel) => {
  dataSource.forEach((item) => {
    for (let i = MIN_LEVEL; i < maxLevel; i++) {
      const levelDataKey = generateLevelDataKey(i);
      // 按钮为数组
      if (
        !Array.isArray(item[levelDataKey] || item[levelDataKey]?.length === 0)
      ) {
        continue;
      }

      const maxLevelDataKey = generateLevelDataKey(maxLevel);
      item[maxLevelDataKey] = item[levelDataKey];
      delete item[levelDataKey];
    }
  });
};

// 格式化树状数据为表格行数据（深度优先遍历）
export const formatDataSource = (resources = [], maxLevel) => {
  let currentData = {}; // 当前数据
  let lastLevel = 0; // 上一次遍历数据的层级
  const dataSource = [];
  const stack = deepCopy(filterHideMenu(resources));

  while (stack.length > 0) {
    const node = stack.shift();
    node.level = node.level || MIN_LEVEL;
    let { children, ...other } = node;
    // 过滤掉需隐藏的菜单
    children = filterHideMenu(children);

    // 深度遍历，当层级未继续变小时，意味着上一条数据已深度遍历完
    if (lastLevel >= node.level) {
      formatLevelData(currentData, node.level, lastLevel, maxLevel);
    }

    // 记录当前的层级
    lastLevel = node.level;
    // 当前层级数据
    currentData[generateLevelDataKey(node.level)] = {
      ...other,
    };
    // 添加层级
    children?.forEach((item) => {
      item.level = node.level + 1;
    });

    if (node.level === maxLevel - 1) {
      // 最大层级为数组，到最大层级的前一级（倒数第二级）就到底了，无需继续深入
      currentData[generateLevelDataKey(maxLevel)] = children || [];
      dataSource.push(deepCopy(currentData));
    } else if (children?.length > 0) {
      // 因非菜单页的权限是通过按钮权限控制,子元素存在button类型说明也到了这条数据的倒数第二级，无需继续深入
      if (
        children.some(
          (item) => item.type === PERMISSION_RESOURCE_TYPE['button'],
        )
      ) {
        currentData[generateLevelDataKey(node.level + 1)] = children;
        dataSource.push(deepCopy(currentData));
      } else {
        // 添加子节点入栈
        stack.unshift(...children);
      }
    } else if (!children || children?.length === 0) {
      // 遍历到底
      dataSource.push(deepCopy(currentData));
    }
  }

  // 添加合并
  addDataSourceRowSpan(dataSource, maxLevel);
  // 添加key
  addDataSourceKey(dataSource);
  // 调整按钮权限为最后一级
  adjustButtonLevel(dataSource, maxLevel);
  return dataSource;
};

// 获取资源信息
export const getResourcesInfo = (resources) => {
  const resourcesIdsMap = {};
  let depth = 0;
  function recursion(arr, currentDepth = 0) {
    arr?.forEach((item) => {
      let currentDepthTemp = currentDepth;
      const { children } = item;
      resourcesIdsMap[item.id] = item;
      // 仅统计菜单的层级
      if (item.type === PERMISSION_RESOURCE_TYPE.menu) {
        ++currentDepthTemp;
      }
      if (Array.isArray(children) && children.length > 0) {
        recursion(children, currentDepthTemp);
      } else {
        depth = Math.max(depth, currentDepthTemp);
      }
    });
  }

  // 操作层级放最后一级
  recursion(resources);
  depth += 1;
  return { resourcesIdsMap, depth };
};

// 获取比自身层级低（父级）的id
export const getLowerIds = (level_data, data) => {
  const { level } = level_data;
  const ids = [];
  // 添加层级较低的
  for (let i = level - 1; i >= MIN_LEVEL; i--) {
    const levelDataKey = generateLevelDataKey(i);
    const id = data[levelDataKey]?.id;
    if (id) {
      ids.push(id);
    }
  }
  return ids;
};

// 获取比自身层级高（子）的id
export const getHigherIds = (level_data, resourcesIdsMap) => {
  const { id: currentId } = level_data;
  const ids = [];
  const currentData = resourcesIdsMap[currentId];
  function recursion(arr) {
    arr.forEach((item) => {
      const { children, id } = item;
      ids.push(id);
      if (Array.isArray(children)) {
        recursion(children);
      }
    });
  }
  recursion(currentData?.children || []);
  return ids;
};

// 数组去重
export const uniqueArr = (arr) => Array.from(new Set(arr));
