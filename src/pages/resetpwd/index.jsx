import { useCallback } from 'react';
import { RESETPWD_TYPE } from '@/constants/common';
import useQuery from '@/hooks/useQuery';
import logo from '@/resources/images/public/image-logo@3x.png';
import Forget from './components/forget';
import Reset from './components/reset';
import ss from './index.less';

const ResetPwd = () => {
  const { type = RESETPWD_TYPE.firstLogin, flowId } = useQuery();

  const renderContainer = useCallback(() => {
    const CONTAINER_MAP = {
      [RESETPWD_TYPE.forget]: Forget,
      [RESETPWD_TYPE.firstLogin]: Reset,
      [RESETPWD_TYPE.expire]: Reset,
      [RESETPWD_TYPE.reset]: Reset,
      [RESETPWD_TYPE.modify]: Reset,
    };

    const Container = CONTAINER_MAP[type];

    return <Container type={type} flowId={flowId} />;
  }, [type]);

  return (
    <div className={ss.resetPwd}>
      <div className={ss.heaedr}>
        <img className={ss.logo} src={logo} />
        <p className={ss.title}>海鹚智慧服务平台</p>
      </div>
      <div className={ss.content}>{renderContainer()}</div>
    </div>
  );
};

export default ResetPwd;
