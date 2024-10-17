// 资源类型
const RESOURCE_TYPE = {
  menu: 'menu',
  button: 'button',
};

const getAccesses = (resources) => {
  const menus = [];
  const btns = [];

  function recursion(arr) {
    arr.forEach((item) => {
      const { children, ...other } = item;
      if (other.type === RESOURCE_TYPE['menu']) {
        menus.push(other);
      } else if (other.type === RESOURCE_TYPE['button']) {
        btns.push(other);
      }
      if (Array.isArray(children) && children.length > 0) {
        recursion(children);
      }
    });
  }

  recursion(resources);

  return {
    menus,
    btns,
  };
};

// src/access.js
export default function (initialState) {
  const { resources = [] } = initialState;
  const { menus, btns } = getAccesses(resources || []);

  const menuAccess = {};
  const btnAccess = {};

  // 处理菜单权限
  (menus || []).forEach((item) => {
    menuAccess[`can_access_${item.url}`] = true;
  });

  // 处理按钮权限
  (btns || []).forEach((item) => {
    btnAccess[item.url] = true;
  });

  // 复合权限
  const compositeAccess = {
    /* TODO: 测试代码 */
    'can_access_/system/setting/detail':
      btnAccess.can_view_system_setting_detail,
  };

  // 由于 layout 插件中的 access 必须为 false, 才拒绝该菜单的权限，故用 Proxy 进行代理，默认返回 false
  return new Proxy(
    {
      // role: roleIds && roleIds[0],
      ...btnAccess,
      ...menuAccess,
      ...compositeAccess,
    },
    {
      get: (obj, prop) => {
        if (process.env.NODE_ENV === 'development') {
          // 本地开发默认有全部权限
          return true;
        }
        return obj[prop] ?? false;
      },
    },
  );
}
