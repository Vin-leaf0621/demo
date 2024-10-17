import { Button, Result } from 'antd';
import { history } from 'umi';

const NoFoundPage = () => (
  <Result
    title="真不巧，网页走丢了"
    status="404"
    extra={[
      <Button
        style={{ width: '110px' }}
        key="back"
        type="primary"
        onClick={() => history.back()}
      >
        返回
      </Button>,
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

export default NoFoundPage;
