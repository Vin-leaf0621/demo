import { Button, Popconfirm } from 'antd';
import { useDispatch } from '@umijs/max';
import { useState, useRef, useEffect } from 'react';
import { produce } from 'immer';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import classNames from 'classnames';
import Icon from '@/components/icon';
import AddModal from '../addmodal';
import AddHisModal from '../addhismodal';
import ss from './index.less';

const SortItem = ({
  item,
  index,
  disabled,
  handleOpenModal,
  handleDelete,
  style,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id: item.hisId,
    disabled,
  });

  return (
    <div
      key={item.hisId}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={classNames(ss.item, isDragging && ss.draggingItem)}
    >
      <div className={ss.name} onClick={() => handleOpenModal(item, index)}>
        {item.hisName}
      </div>
      <Popconfirm
        title="删除后各用户端将不展示该医院，是否继续？"
        onConfirm={() => handleDelete(index, item)}
      >
        <Icon type="icon-shanchu" className={ss.icon} />
      </Popconfirm>
    </div>
  );
};

const HospitalBtns = ({
  value = [],
  onChange,
  initialHisList = [],
  setDelIds,
}) => {
  const idx = useRef(null);
  const dispatch = useDispatch();
  const [activeItem, setActiveItem] = useState();
  const [modalProps, setModalProps] = useState({
    visible: false,
    data: null,
  });
  const [addHisOpen, setAddHisOpen] = useState(false);

  useEffect(() => {
    ['level', 'businessPattern', 'feature'].map((i) =>
      dispatch({
        type: 'hospital/getDict',
        payload: {
          type: i,
        },
      }),
    );
  }, []);

  const handleOpenModal = (data, x) => {
    idx.current = x;
    setModalProps((pre) => ({
      ...pre,
      visible: true,
      data,
    }));
  };

  // 添加/编辑入驻医院
  const handleSave = (val) => {
    try {
      const newVal = produce(value, (draftState) => {
        if (!isNaN(idx.current)) {
          draftState.splice(idx.current, 1, { ...value[idx.current], ...val });
        } else {
          draftState.push(val);
        }
      });

      setModalProps((pre) => ({ ...pre, visible: false }));
      onChange?.(newVal);
    } catch (error) {
      console.log(error);
    }
  };

  // 删除入驻医院
  const handleDelete = (x, item) => {
    const newVal = produce(value, (draftState) => {
      draftState.splice(x, 1);
    });
    if (initialHisList.includes(item.hisId)) {
      setDelIds((pre) => [...pre, item.id]);
    }
    onChange?.(newVal);
  };

  // 拖拽开始
  const handleDragStart = ({ active }) => {
    const item = value.find((i) => i.hisId === active.id);
    setActiveItem(item);
  };

  // 拖拽结束
  const handleDragEnd = ({ over }) => {
    const activeIndex = value.findIndex((i) => i.hisId === activeItem?.hisId);
    const overIndex = value.findIndex((i) => i.hisId === over?.id);

    onChange?.(arrayMove(value, activeIndex, overIndex));
  };

  // 验证当前医院是否已添加
  const validateIsAdd = (val) => {
    const res = value.find((i) => i.hisId === val);

    return !!res;
  };

  const handleAddHis = (datas) => {
    setModalProps((pre) => ({ ...pre, visible: false, data: datas }));
    setAddHisOpen(true);
  };

  const handleAddHisSave = (detail) => {
    setAddHisOpen(false);
    setModalProps((pre) => ({
      ...pre,
      visible: true,
      data: { ...pre.data, hisId: detail?.hisId, hisName: detail?.name },
    }));
  };

  const handleCancle = () => {
    setAddHisOpen(false);
    setModalProps((pre) => ({ ...pre, visible: true }));
  };

  return (
    <div className={ss.hospitalBtns}>
      <Button className={ss.btn} onClick={() => handleOpenModal()}>
        <Icon type="icon-jiahao" className={ss.icon} />
        选择
      </Button>
      {value?.length > 1 ? (
        <div className={ss.tips}>
          拖动可调整排序，将影响各个业务入口的医院展示顺序
        </div>
      ) : null}
      <div className={ss.btns}>
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          sensors={useSensors(
            useSensor(PointerSensor, {
              activationConstraint: {
                distance: 5, // 设置传感器，距离小于5时不响应拖拽事件，由此可响应点击事件
              },
            }),
          )}
        >
          <SortableContext
            items={value}
            strategy={horizontalListSortingStrategy}
          >
            {value.map((i, x) => (
              <SortItem
                key={i.hisId}
                item={i}
                index={x}
                disabled={value?.length < 2}
                handleDelete={handleDelete}
                handleOpenModal={handleOpenModal}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeItem?.hisId ? (
              <SortItem item={activeItem} style={{ cursor: 'move' }} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <AddHisModal
        {...modalProps}
        onCancle={() => setModalProps((pre) => ({ ...pre, visible: false }))}
        onSave={handleSave}
        validateIsAdd={validateIsAdd}
        initialHisList={initialHisList}
        handleAddHis={handleAddHis}
      />

      <AddModal
        open={addHisOpen}
        onCancle={handleCancle}
        onSave={(res) => handleAddHisSave(res)}
      />
    </div>
  );
};

export default HospitalBtns;
