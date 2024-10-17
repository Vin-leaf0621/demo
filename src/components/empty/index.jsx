import emptyImg from '@/resources/images/public/image-empty.png';
import ss from './index.less';

const Empty = ({ title }) => {
  return (
    <div className={ss.emptyBox}>
      <img src={emptyImg} className={ss.img} />
      {title}
    </div>
  );
};

export default Empty;
