export const RESETPWD_TYPE = {
  firstLogin: 'first_login', // 首次登录修改密码
  forget: 'forget', // 忘记密码
  expire: 'password_overdue', //超过30天，强制更换密码
  reset: 'reset', // 手动修改密码
  modify: 'modify', // 修改密码
};

export const SEX_MAP = {
  male: 'M',
  female: 'F',
};

// 权限资源类型
export const PERMISSION_RESOURCE_TYPE = {
  menu: 0,
  button: 1,
};

// 字典类型
export const DICT_TYPE = {
  type: 'PROFESSION-HIS',
  level: 'DOCTOR_PROFESSION_LEVEL',
  grade: 'DOCTOR_ACAD_LEVEL',
  source: 'DOCTOR_SOURCE',
  NURSE_LEVEL: 'nurse_profession_level', // 护士职称
  PHARMACIST_LEVEL: 'pharmacist_profession_level', // 药师职称
};

// 客户端类型
export const CLIENTS_MAP = {
  MANAGE: 'manage',
  DOCTOR: 'doctor',
  NURSE: 'nurse',
  PHARMACIST: 'pharmacist',
};

// 医护角色
export const STAFF_TYPE_MAP = {
  doctor: 'doctor',
  nurse: 'nurse',
  pharmacist: 'pharmacist',
};

// 医护名称
export const STAFF_NAME_MAP = {
  [STAFF_TYPE_MAP.doctor]: '医生',
  [STAFF_TYPE_MAP.nurse]: '护士',
  [STAFF_TYPE_MAP.pharmacist]: '药师',
};

// 查看详情页面类型
export const DETAIL_TYPE = {
  view: 'view', // 查看
  edit: 'edit', // 编辑
};

// 订单详情页面地址
export const BIZ_DETAIL_URL = {
  outpatient_payment: '/#/operator-his/payorder/detail',
  appointment_registration: '/#/operator-his/order/register/detail',
  further_consultation: '/#/operator-ih/order/inquiry/detail',
  first_consultation: '/#/operator-ih/order/inquiry/detail',
};

// 医院管理端域名
export const MANAGE_CLIENT_DOMAIN_MAP = {
  local: 'https://sm.med.gzhc365.com',
  dev: 'https://sm.med.gzhc365.com',
  uat: 'https://um.med.gzhc365.com',
  prod: 'https://m.haici.com',
};
