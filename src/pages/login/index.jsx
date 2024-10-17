import banner from '@/resources/images/public/bg-login@2x.jpg';
import logo from '@/resources/images/public/image-logo@3x.png';
import ss from './index.less';
import Login from './components/login';

const Page = () => {
  return (
    <div className={ss.page}>
      <div className={ss.left}>
        <img src={banner} />
      </div>
      <div className={ss.right}>
        <div className={ss.content}>
          <div className={ss.header}>
            <img src={logo} />
            <span>海鹚智慧服务平台</span>
          </div>
          <Login />
        </div>
        <div className={ss.footer}>
          <p>
            Copyright © 2014-2023 All Rights Reserved 广州海鹚网络科技有限公司
          </p>
          <p>粤公网安备 44010602000461号</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
