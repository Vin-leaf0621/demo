/**
 * @name umi 的路由配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。
 * @param routes 配置子路由
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件。
 * @param name 配置路由的标题
 * @param icon 配置路由的图标
 * @param access 权限标识
 * @param flatMenu 隐藏自身，子项上提
 * @param layout false为不需要布局(侧边栏、顶栏等)
 * @param hideInMenu  在侧边栏菜单中隐藏
 */

/* TODO: 修改代码 */
export default [
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    icon: 'icon-shouye',
    component: '@/pages/home',
    access: 'can_access_/home',
  },
  {
    name: '登录页',
    path: '/login',
    layout: false,
    component: '@/pages/login',
  },
  {
    name: '租户管理',
    path: '/tenant',
    access: 'can_access_/operator-common/tenant',
    routes: [
      {
        name: '租户管理',
        path: '/tenant',
        component: '@/pages/tenant/list',
        access: 'can_access_/operator-common/tenant',
      },
      {
        name: '添加租户',
        path: '/tenant/add',
        component: '@/pages/tenant/detail',
        hideMenu: true,
        access: 'can_access_/operator-common/tenant/add',
      },
      {
        name: '租户详情',
        path: '/tenant/detail',
        component: '@/pages/tenant/detail',
        hideMenu: true,
        access: 'can_access_/operator-common/tenant/detail',
      },
      {
        name: '编辑租户',
        path: '/tenant/edit',
        component: '@/pages/tenant/detail',
        hideMenu: true,
        access: 'can_access_/operator-common/tenant/edit',
      },
      {
        name: '业务配置规则',
        path: '/tenant/bizrule',
        component: '@/pages/tenant/bizrule',
        hideMenu: true,
      },
    ],
  },
  {
    path: '/403',
    component: '@/pages/403',
    layout: false,
  },
  {
    path: '/404',
    component: '@/pages/404',
    layout: false,
  },
  { path: '*', redirect: '/404' },
];
