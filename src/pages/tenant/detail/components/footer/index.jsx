import { useCallback } from 'react';
import { Button } from 'antd';
import { history } from '@umijs/max';
import ss from './index.less';

const Footer = ({ loading, onSave, isFirst, setCurrent, isEnd }) => {
  const handleCancel = useCallback(() => {
    history.back();
  }, []);

  const handlePreStep = () => {
    setCurrent?.((pre) => pre - 1);
  };

  return (
    <div className={ss.footer}>
      {isFirst ? (
        <Button
          type="default"
          className={ss.btn}
          onClick={handleCancel}
          disabled={loading}
        >
          取消
        </Button>
      ) : (
        <Button
          type="default"
          className={ss.btn}
          onClick={handlePreStep}
          disabled={loading}
        >
          上一步
        </Button>
      )}

      {isEnd ? (
        <Button type="primary" className={ss.btn} onClick={handleCancel}>
          完成
        </Button>
      ) : (
        <>
          <Button
            type="primary"
            className={ss.btn}
            onClick={() => onSave()}
            loading={loading}
          >
            保存并退出
          </Button>

          <Button
            type="primary"
            className={ss.btn}
            onClick={() => onSave(true)}
            loading={loading}
          >
            保存并继续
          </Button>
        </>
      )}
    </div>
  );
};

export default Footer;
