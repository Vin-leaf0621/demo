import { Button, Result } from 'antd';
import { history } from 'umi';

const NotAuthorizedPage = () => (
  <Result
    title="很抱歉，你好像没有权限访问此页面"
    status="403"
    extra={[
      <Button
        style={{ width: '110px' }}
        key="home"
        onClick={() => history.replace('/')}
      >
        返回首页
      </Button>,
    ]}
  />
);

export default NotAuthorizedPage;
