import { InputNumber } from 'antd';
import ss from './index.less';

const NumberInput = ({ value = [], onChange, items, disabled }) => {
  const handleChange = (value) => {
    onChange?.(value || value === 0 ? [value] : undefined);
  };

  return (
    <div className={ss.numberInput}>
      <InputNumber
        onChange={handleChange}
        value={value[0]}
        style={{ width: 129 }}
        min={items[0].minimum}
        max={items[0].maximum}
        precision={items[0].number}
        disabled={disabled}
      />
      <span className={ss.unit}>{items[0].unit}</span>
    </div>
  );
};

export default NumberInput;
