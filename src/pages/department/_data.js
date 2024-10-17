export const DEPARTMENT_STATUS_MAP = {
  on: 0, // 启用
  off: 1, // 禁用
};

export const DEPARTMENT_STATUS_OBJ = {
  [DEPARTMENT_STATUS_MAP.on]: { name: '上线', bgColor: '#3ECEB6', opt: '下线' },
  [DEPARTMENT_STATUS_MAP.off]: {
    name: '下线',
    bgColor: '#D9D9D9',
    opt: '上线',
  },
};

export const DEPARTMENT_STATUS_ARR = [
  {
    value: DEPARTMENT_STATUS_MAP.on,
    label: DEPARTMENT_STATUS_OBJ[DEPARTMENT_STATUS_MAP.on].name,
  },
  {
    value: DEPARTMENT_STATUS_MAP.off,
    label: DEPARTMENT_STATUS_OBJ[DEPARTMENT_STATUS_MAP.off].name,
  },
];

// 同步范围
export const SYNC_SCOPE = {
  ALL: 'all',
  DEPARTMENT: 'specified_dept',
};

// 同步范围 Options
export const SYNC_SCOPE_OPTIONS = [
  { label: '全部科室', value: SYNC_SCOPE.ALL },
  { label: '指定科室', value: SYNC_SCOPE.DEPARTMENT },
];
