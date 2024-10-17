/* TODO: 测试代码 */

const accountData = {
  account: {
    name: '管理员',
  },
  resources: [
    {
      id: '1',
      name: '首页',
      pid: null,
      type: 'menu',
      url: '/home',
      children: [],
    },
    {
      id: '2',
      name: '系统管理',
      pid: null,
      type: 'menu',
      url: '/system',
      children: [
        {
          id: '3',
          name: '系统管理',
          pid: '2',
          type: 'menu',
          url: '/system/setting',
          children: [
            {
              id: '4',
              name: '查看系统设置详情',
              pid: '3',
              type: 'button',
              url: 'can_view_system_setting_detail',
            },
          ],
        },
        {
          id: '5',
          name: '账号管理',
          pid: '2',
          type: 'menu',
          url: '/system/account',
          children: [],
        },
      ],
    },
  ],
};

export default {
  'POST /api/getAccount': (req, res) => {
    res.json({
      code: 0,
      data: accountData,
      msg: null,
    });
  },
};
