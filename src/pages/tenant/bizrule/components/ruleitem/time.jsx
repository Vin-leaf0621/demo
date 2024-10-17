import { TimePicker } from 'antd';
import dayjs from 'dayjs';

const Time = ({ value = [], onChange, items, disabled }) => {
  const handleChange = (val) => {
    console.log(val);
    onChange?.(val ? [dayjs(val, 'HH:mm:ss')] : undefined);
  };

  return (
    <TimePicker
      value={dayjs(value[0], 'HH:mm:ss')}
      defaultValue={items[0].defaultValue}
      onChange={handleChange}
      disabled={disabled}
      style={{ marginTop: 8 }}
    />
  );
};

export default Time;
