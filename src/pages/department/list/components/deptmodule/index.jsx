import { Button, Popconfirm } from 'antd';
import { Access, useAccess } from '@umijs/max';
import Icon from '@/components/icon';
import ss from './index.less';

const DeptModule = ({
  title,
  data = [{}],
  activeKey,
  style,
  handleChangeSelect,
  handleAdd,
  handleView,
  handleEdit,
  handleDelete,
}) => {
  const access = useAccess();

  return (
    <div className={ss.deptModule} style={style}>
      <div className={ss.title}>
        <div>{title}</div>
        <Access
          accessible={access.can_common_add_manage_subject_department}
          fallback={null}
        >
          <Button type="link" className="actionBtn" onClick={handleAdd}>
            <Icon type="icon-jiahao" className={ss.icon} />
            添加
          </Button>
        </Access>
      </div>

      {data?.length ? (
        <div className={ss.deptItems}>
          {data.map((item) => (
            <div
              className={`${ss.item} ${
                activeKey === item.id ? ss.activeItem : ''
              }`}
              key={item.id}
              onClick={() => handleChangeSelect(item.id, item.subBizDept)}
            >
              <div className={ss.name}>{item.name}</div>
              <div className={ss.icons}>
                <Access
                  accessible={access.can_common_view_manage_subject_department}
                  fallback={null}
                >
                  <Icon
                    className={ss.icon}
                    type="icon-chakan"
                    onClick={() => handleView(item)}
                  />
                </Access>
                <Access
                  accessible={access.can_common_edit_manage_subject_department}
                  fallback={null}
                >
                  <Icon
                    className={ss.icon}
                    type="icon-bianji"
                    onClick={() => handleEdit(item)}
                  />
                </Access>
                <Access
                  accessible={
                    access.can_common_delete_manage_subject_department
                  }
                  fallback={null}
                >
                  <Popconfirm
                    onConfirm={() => handleDelete(item.id)}
                    placement="topRight"
                    title="是否确认删除该科室？"
                  >
                    <Icon className={ss.icon} type="icon-shanchu" />
                  </Popconfirm>
                </Access>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={ss.empty}>如有需要请点击右上角添加{title}</div>
      )}
    </div>
  );
};

export default DeptModule;
