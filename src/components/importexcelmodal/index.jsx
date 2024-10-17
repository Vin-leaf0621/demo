import { useState, useCallback, useEffect } from 'react';
import { Modal } from 'antd';
import { download } from '@/utils/utils';
import Uploader from './uploader';
import Loading from './loading';
import Success from './success';
import Fail from './fail';
import Abnormal from './abnormal';

import ss from './index.less';

// 导入状态
const IMPORT_STATUS = {
  WAIT: 'wait', // 等待导入
  IMPORTING: 'importing', // 导入中
  SUCCESS: 0, // 导入成功
  FAIL: 2, // 导入失败
  ABNORMAL: 1, // 导入异常
};

const ImportExcelModal = ({
  params = {},
  title = '数据导入',
  importUrl,
  open = false,
  onCancel,
  templateUrl,
  onComplete,
}) => {
  const [status, setStatus] = useState(IMPORT_STATUS.WAIT);
  const [result, setResult] = useState(null);

  const handleFinish = useCallback(
    async (err, res) => {
      if (err) {
        setStatus(IMPORT_STATUS.FAIL);
        setResult(null);
        return;
      }
      setStatus(res.response.status);
      setResult(res.response);
    },
    [importUrl],
  );

  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const importAgain = useCallback(() => {
    setStatus(IMPORT_STATUS.WAIT);
  }, []);

  const handleDownload = useCallback((url) => {
    download(url, '导入失败数据.xlsx');
  }, []);

  const renderContent = () => {
    const COMPONENT_MAP = {
      [IMPORT_STATUS.WAIT]: (
        <Uploader
          params={params}
          requestUrl={importUrl}
          templateUrl={templateUrl}
          onBeforeUpload={() => setStatus(IMPORT_STATUS.IMPORTING)}
          onFinish={handleFinish}
        />
      ),
      [IMPORT_STATUS.IMPORTING]: <Loading />,
      [IMPORT_STATUS.SUCCESS]: (
        <Success
          result={result}
          onComplete={handleComplete}
          onContinue={importAgain}
        />
      ),
      [IMPORT_STATUS.FAIL]: (
        <Fail
          result={result}
          onComplete={handleComplete}
          onImportAgain={importAgain}
        />
      ),
      [IMPORT_STATUS.ABNORMAL]: (
        <Abnormal
          result={result}
          onComplete={handleComplete}
          onImportAgain={importAgain}
          onDownload={handleDownload}
        />
      ),
    };
    return COMPONENT_MAP[status];
  };

  useEffect(() => {
    if (open) {
      // 打开弹窗时，重置状态
      setStatus(IMPORT_STATUS.WAIT);
      setResult(null);
    }
  }, [open]);

  return (
    <Modal
      maskClosable={false}
      title={title}
      open={open}
      footer={null}
      onCancel={() => onCancel?.()}
    >
      <div className={ss.main}>{renderContent()}</div>
    </Modal>
  );
};

export default ImportExcelModal;
