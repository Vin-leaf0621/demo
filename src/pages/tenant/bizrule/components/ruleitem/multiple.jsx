import { Checkbox, App } from 'antd';
import ss from './index.less';

const Multiple = ({ value, onChange, items = [], disabled }) => {
  const { message } = App.useApp();
  const findChangeValue = (a, b) => {
    const newArr = [...a, ...b];
    const res = newArr.filter((i) => !(a.includes(i) && b.includes(i)));

    return res;
  };

  const handleChange = (list) => {
    const target = findChangeValue(list, value)[0];

    const targetItem = items.find((i) => i.optionKey === target);

    if (targetItem.requireFlag === 0) {
      message.warning('该选项为必选项，不可取消！', 1.5);
      return;
    }

    onChange?.(list);
  };

  return (
    <Checkbox.Group
      onChange={handleChange}
      value={value}
      className={ss.checkbox}
      disabled={disabled}
    >
      {items.map((i) => (
        <div className={ss.multipleItem} key={i.optionKey}>
          <Checkbox value={i.optionKey}>{i.content}</Checkbox>
          {i.description ? (
            <div className={ss.tips}>{i.description}</div>
          ) : null}
        </div>
      ))}
    </Checkbox.Group>
  );
};

export default Multiple;
