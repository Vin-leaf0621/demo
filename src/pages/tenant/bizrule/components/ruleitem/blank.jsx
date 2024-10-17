import { Input } from 'antd';
import ss from './index.less';

const Blank = ({ value = [], onChange, items, disabled }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange?.(value ? [value] : undefined);
  };

  return (
    <Input
      showCount
      value={value[0]}
      allowClear
      maxLength={items[0].maximum}
      className={ss.blank}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default Blank;
