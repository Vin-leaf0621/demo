import { Button, Space } from 'antd';
import Icon from '@/components/icon';
import ss from './index.less';

const Abnormal = ({ result, onComplete, onImportAgain, onDownload }) => {
  const successCount = result?.successNumber ?? 0;
  const failCount = result?.failNumber ?? 0;

  return (
    <div className={ss.abnormal}>
      <div className={ss.abnormalResult}>
        <Icon type="icon-xinxi-shixin" className={ss.abnormalIcon} />
        <p className={ss.abnormalText}>匹配异常</p>
        <p className={ss.abnormalDesc}>
          共导入{successCount + failCount}条数据，成功导入{successCount}条，失败
          {failCount}条
        </p>
      </div>
      <div className={ss.abnormalOperation}>
        <Button className={ss.abnormalBtn} onClick={onComplete}>
          完成
        </Button>
        <Button
          className={ss.abnormalBtn}
          onClick={() => onDownload?.(result.downLoadUrl)}
        >
          下载导入失败数据
        </Button>
        <Button
          className={ss.abnormalBtn}
          type="primary"
          onClick={onImportAgain}
        >
          重新导入
        </Button>
      </div>
      <div className={ss.abnormalDetail}>
        <div className={ss.abnormalDetailTitle}>
          以下文件校验失败，请修改后重新导入：
        </div>
        <ul className={ss.abnormalDetailList}>
          {(result?.failCauseItems ?? []).map((item, index) => (
            <li key={index}>
              <Icon className={ss.abnormalDetailIcon} type="icon-cuowu" />
              <p>
                第{item.rowNum}行，{item.errorMsg}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Abnormal;
