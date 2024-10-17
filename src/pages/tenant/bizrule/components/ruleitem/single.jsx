import { Radio } from 'antd';
import ss from './index.less';

const Single = ({ value = [], onChange, items = [], disabled }) => {
  const handleChange = (e) => {
    const { value } = e.target;
    onChange?.(value ? [value] : undefined);
  };

  return (
    <Radio.Group onChange={handleChange} value={value[0]} disabled={disabled}>
      {items.map((i) => (
        <div className={ss.singleItem} key={i.optionKey}>
          <Radio value={i.optionKey}>{i.content}</Radio>
          {i.description ? (
            <div className={ss.tips}>{i.description}</div>
          ) : null}
        </div>
      ))}
    </Radio.Group>
  );
};

export default Single;
