/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';
import { history } from 'umi';

export default function MenuItem({ item, dom }) {
  const handleClick = useCallback(async () => {
    history.push(item.path);
  }, []);

  return (
    <div
      onClick={() => {
        handleClick(item);
      }}
    >
      {dom}
    </div>
  );
}
