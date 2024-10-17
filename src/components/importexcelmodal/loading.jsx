import ss from './index.less';

const Loading = () => {
  return (
    <div className={ss.loading}>
      <div className={ss.loadingBox}>
        <div />
        <div />
        <div />
        <div />
      </div>
      <div className={ss.loadingText}>正在导入</div>
    </div>
  );
};

export default Loading;
