import { Button, Space } from 'antd';
import Icon from '@/components/icon';

import ss from './index.less';

const Fail = ({ result, onComplete, onImportAgain }) => {
  return (
    <div className={ss.fail}>
      <div className={ss.failResult}>
        <Icon type="icon-cuowushixin" className={ss.failIcon} />
        <p className={ss.failText}>导入失败</p>
        <p className={ss.failDesc}>导入失败，请重新导入</p>
      </div>
      <div className={ss.failOperation}>
        <Button className={ss.failBtn} onClick={onComplete}>
          完成
        </Button>
        <Button className={ss.failBtn} type="primary" onClick={onImportAgain}>
          重新导入
        </Button>
      </div>
      {result?.failCauseItems?.length > 0 && (
        <div className={ss.failDetail}>
          <div className={ss.failDetailTitle}>
            失败原因如下，请修改后重新导入：
          </div>
          <ul className={ss.failDetailList}>
            {(result?.failCauseItems ?? []).map((item, index) => (
              <li key={index}>
                <Icon className={ss.failDetailIcon} type="icon-cuowu" />
                <p>
                  第{item.rowNum}行，{item.errorMsg}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Fail;
