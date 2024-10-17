import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { DndContext } from '@dnd-kit/core';
import ss from './index.less';
import Icon from '@/components/icon';
import { CSS } from '@dnd-kit/utilities';
import { produce } from 'immer';

const DeptItem = ({ item, activeKey, handleChangeSelect, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id: item.id,
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(
      transform && {
        ...transform,
        scaleY: 1,
      },
    ),
    transition,
    ...(isDragging
      ? {
          position: 'relative',
          zIndex: 9999,
        }
      : {}),
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      className={`${ss.item} ${activeKey === item.id ? ss.activeItem : ''}`}
      key={item.id}
      onClick={() => handleChangeSelect(item.id, item.subBizDept)}
    >
      <div className={ss.name}>
        <Icon
          type="icon-tuodongpaixu"
          className={ss.icon}
          ref={setActivatorNodeRef}
          style={{
            touchAction: 'none',
            cursor: 'move',
          }}
          {...listeners}
        />

        {item.name}
      </div>
    </div>
  );
};

const SortItem = ({
  data = [],
  onChange,
  title,
  activeKey,
  handleChangeSelect,
}) => {
  const handleDragOver = (e) => {
    const { active, over } = e;
    if (!over) return;

    const activeIndex = data.findIndex((item) => item.id === active?.id);
    const overIndex = data.findIndex((item) => item.id === over?.id);

    const newData = produce(data, (state) => {
      const activeItem = state.splice(activeIndex, 1)[0];
      state.splice(overIndex, 0, activeItem);
    });
    onChange?.(newData);
  };

  return (
    <div className={ss.sortItem}>
      <div className={ss.title}>{title}</div>

      <DndContext onDragOver={handleDragOver}>
        <SortableContext items={data} strategy={horizontalListSortingStrategy}>
          {data?.length ? (
            <div className={ss.deptItems}>
              {data.map((item) => (
                <DeptItem
                  key={item.id}
                  item={item}
                  activeKey={activeKey}
                  handleChangeSelect={handleChangeSelect}
                />
              ))}
            </div>
          ) : (
            <div className={ss.empty}>暂无科室{title}</div>
          )}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default SortItem;
