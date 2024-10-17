import { Button, Space } from 'antd';
import Icon from '@/components/icon';

import ss from './index.less';

const Success = ({ result, onComplete, onContinue }) => {
  return (
    <div className={ss.success}>
      <div className={ss.successResult}>
        <Icon type="icon-zhengque-shixin" className={ss.successIcon} />
        <p className={ss.successText}>导入成功</p>
        <p className={ss.successDesc}>
          成功导入{result?.successNumber ?? 0}条信息
        </p>
      </div>
      <div className={ss.successOperation}>
        <Button className={ss.successBtn} onClick={onContinue}>
          继续导入
        </Button>
        <Button className={ss.successBtn} type="primary" onClick={onComplete}>
          完成
        </Button>
      </div>
    </div>
  );
};

export default Success;
