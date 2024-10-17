import { Button } from 'antd';
import * as Api from './api';

const SecretKey = ({ value, onChange }) => {
  const handleClick = async () => {
    try {
      const res = await Api.generateSecret();
      onChange?.(res);
    } catch (error) {}
  };

  return (
    <div>
      {value ? (
        <div>
          {value}
          <Button type="link" onClick={handleClick} style={{ padding: 0 }}>
            重新生成
          </Button>
        </div>
      ) : (
        <Button
          type="link"
          onClick={handleClick}
          style={{ padding: 0, marginLeft: 8 }}
        >
          生成密钥
        </Button>
      )}
    </div>
  );
};

export default SecretKey;
