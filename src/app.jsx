import Header from '@/layouts/header';
import MenuItem from '@/layouts/menuitem';
import SubMenuItem from '@/layouts/submenuitem';
import NoAccess from '@/pages/403';
import NotFound from '@/pages/404';
import { getAccount } from '@/services/public';

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState() {
  let state = null;
  try {
    /* TODO: 修改代码 */
    state = await getAccount();
  } catch (error) {
    state = {};
  }
  return state;
}

export const layout = () => {
  return {
    title: '',
    layout: 'mix',
    contentWidth: 'Fluid',
    fixSiderbar: true,
    disableMobile: true,
    breakpoint: false,
    collapsed: false,
    menu: {
      locale: false,
    },
    splitMenus: false,
    siderWidth: 200,
    collapsedButtonRender: false,
    logo: false,
    token: {
      layout: {
        bgLayout: '#FFF',
      },
      sider: {
        colorMenuBackground: '#FFF',
      },
      header: {
        colorBgHeader: '#FFF',
        heightLayoutHeader: 48,
      },
    },
    notFound: <NotFound />,
    unAccessible: <NoAccess />,
    headerRender: (props) => {
      return <Header item={props} />;
    },
    menuItemRender: (item, dom) => {
      return <MenuItem item={item} dom={dom} />;
    },
    subMenuItemRender: (item) => {
      return <SubMenuItem item={item} />;
    },
  };
};
