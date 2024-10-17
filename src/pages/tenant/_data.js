export const NAV_MAP = {
  baseInfo: 'baseInfo',
  manage: 'manage',
};

export const TENANT_HISLIST_STATUS = {
  off: 0, // 下线
  on: 1, // 上线
};

export const TENANT_HISLIST_STATUS_OBJ = {
  [TENANT_HISLIST_STATUS.on]: {
    name: '上线',
    bgColor: '#3eceb6',
    opt: '下线',
  },
  [TENANT_HISLIST_STATUS.off]: {
    name: '下线',
    bgColor: '#D9D9D9',
    opt: '上线',
  },
};
