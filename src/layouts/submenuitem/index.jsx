/* eslint-disable react-hooks/exhaustive-deps */
import Icon from '@/components/icon';

export default function SubMenuItem({ item }) {
  return (
    <>
      <Icon type={item?.icon ?? ''} />
      <span>{item?.name ?? ''}</span>
    </>
  );
}
