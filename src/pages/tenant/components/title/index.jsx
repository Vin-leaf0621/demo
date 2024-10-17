import { Divider } from 'antd';
import ss from './index.less';

const Title = ({ title, style }) => {
  return (
    <div className={ss.title} style={style}>
      <Divider>{title}</Divider>
    </div>
  );
};

export default Title;
