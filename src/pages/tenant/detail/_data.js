export const TAB_KEY = {
  baseInfo: 'baseInfo',
  bizRule: 'bizRule',
  terminal: 'terminal',
  notification: 'notification',
};

export const TAB_ARR = [
  {
    key: TAB_KEY.baseInfo,
    label: '基本信息',
  },
  {
    key: TAB_KEY.bizRule,
    label: '业务与规则',
  },
  {
    key: TAB_KEY.terminal,
    label: '终端',
  },
  {
    key: TAB_KEY.notification,
    label: '通知',
  },
];

// 业务状态
export const BIZ_STATUS_MAP = {
  wait: 0,
  config: 1,
  online: 2,
  offline: 3,
};

export const BIZ_STATUS = {
  [BIZ_STATUS_MAP.wait]: {
    name: '待配置',
    style: {
      color: 'rgba(0, 0, 0, 0.65)',
      background: '#F9F9F9',
      border: '1px solid #F9F9F9',
    },
    opts: ['去配置'],
  },
  [BIZ_STATUS_MAP.config]: {
    name: '已配置',
    style: {
      color: '#3986FF',
      background: 'rgba(57, 134, 255, 0.10)',
    },
    opts: ['修改配置', '上线', '删除'],
  },
  [BIZ_STATUS_MAP.online]: {
    name: '已上线',
    style: {
      color: '#3ECEB6',
      background: 'rgba(62, 206, 182, 0.10)',
    },
    opts: ['查看', '下线'],
  },
  [BIZ_STATUS_MAP.offline]: {
    name: '已下线',
    style: {
      color: 'rgba(0, 0, 0, 0.25)',
      background: '#F9F9F9',
      border: '1px solid #F9F9F9',
    },
    opts: ['修改配置', '上线', '删除'],
  },
};

// 终端类型
export const TERMINAL_KEY = {
  mobile: 'mobile',
  pc: 'pc',
};

export const TERMINAL_TYPE = [
  {
    label: '移动终端',
    key: TERMINAL_KEY.mobile,
  },
  {
    label: 'PC终端',
    key: TERMINAL_KEY.pc,
  },
];

//移动终端类型
export const MOBILE_TERMINAL_KEY = {
  patient: 'customer_mobile',
  doctor: 'doctor_mobile,pharmacist_mobile,nurse_mobile',
};

export const MOBILE_TERMINAL = {
  [MOBILE_TERMINAL_KEY.patient]: {
    name: '患者终端',
  },
  [MOBILE_TERMINAL_KEY.doctor]: {
    name: '医护终端',
  },
};

export const MOBILE_TERMINAL_LIST = [
  {
    value: MOBILE_TERMINAL_KEY.patient,
    label: MOBILE_TERMINAL[MOBILE_TERMINAL_KEY.patient].name,
  },
  {
    value: MOBILE_TERMINAL_KEY.doctor,
    label: MOBILE_TERMINAL[MOBILE_TERMINAL_KEY.doctor].name,
  },
];

// 渠道类型
export const CHANNEL_KEY = {
  wxXcx: 'wx_xcx',
};

export const CHANNEL_TYPE = {
  [CHANNEL_KEY.wxXcx]: {
    name: '微信小程序',
  },
};

export const CHANNEL_LIST = [
  {
    label: CHANNEL_TYPE[CHANNEL_KEY.wxXcx].name,
    value: CHANNEL_KEY.wxXcx,
  },
];

// PC终端类型
export const PC_TERMINAL_KEY = {
  manage: 'manage_pc',
  doctor: 'doctor_pc',
  medical: 'pharmacist_pc',
  nurse: 'nurse_pc',
};

export const PC_TERMINAL = [
  {
    label: '医院管理后台',
    key: PC_TERMINAL_KEY.manage,
  },
  {
    label: '医生工作站',
    key: PC_TERMINAL_KEY.doctor,
  },
  {
    label: '药师工作站',
    key: PC_TERMINAL_KEY.medical,
  },
  {
    label: '护士工作站',
    key: PC_TERMINAL_KEY.nurse,
  },
];

// 通知对象
export const NOTIFICATION_KEY = {
  doctor: 'doctor',
  patient: 'customer',
  pharmacist: 'pharmacist',
  nurse: 'nurse',
};

export const NOTIFICATION_OBJ = {
  [NOTIFICATION_KEY.doctor]: {
    name: '医生',
  },
  [NOTIFICATION_KEY.patient]: {
    name: '患者',
  },
  [NOTIFICATION_KEY.pharmacist]: {
    name: '药师',
  },
  [NOTIFICATION_KEY.nurse]: {
    name: '护士',
  },
};

// 短信对接方式
export const MSG_DOCKING_KEY = {
  third_party: 'third_party',
  front_machine: 'front_machine',
};
