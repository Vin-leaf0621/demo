import { App, Button, Popconfirm, Tooltip, Table } from 'antd';
import { useMemo } from 'react';
import { useAccess, Access, history, useDispatch } from '@umijs/max';
import Icon from '@/components/icon';
import * as Api from '../../api';
import { DETAIL_TYPE } from '@/constants/common';
import ss from './index.less';

const Widget = ({ tableProps, loading, submit, setIsCache }) => {
  const access = useAccess();
  const dispatch = useDispatch();
  const { message } = App.useApp();

  // 删除租户
  const handleDelete = async (id, name) => {
    try {
      await Api.deleteTenant({
        id,
        name,
      });
      message.success('删除成功！', 1.5, () => {
        submit();
      });
    } catch (error) {}
  };

  const handleToAdd = () => {
    dispatch({
      type: 'tenant/save',
      payload: {
        tenantName: null,
      },
    });
    history.push('/tenant/add');
  };

  const handleEdit = (record, type) => {
    setIsCache();
    dispatch({
      type: 'tenant/save',
      payload: {
        tenantName: record.name,
        tenantStamp: record.tenantStamp,
      },
    });
    history.push(`/tenant/edit?id=${record.id}&code=${record.code}`);
  };

  const columns = useMemo(() => {
    const optAccess =
      access['can_operator-common_edit_tenant'] ||
      access['can_operator-common_delete_tenant'];
    const columnsArr = [
      {
        title: '租户名称',
        dataIndex: 'name',
      },
      {
        title: '入驻医院',
        dataIndex: 'hisDetail',
        width: '30%',
        ellipsis: {
          showTitle: false,
        },
        render: (text) => (
          <Tooltip color="rgba(0, 0, 0, 0.6)" title={text} placement="topLeft">
            {text}
          </Tooltip>
        ),
      },
      {
        title: '添加时间',
        dataIndex: 'createTime',
      },
    ];

    if (optAccess) {
      columnsArr.push({
        title: '操作',
        render: (_, record) => {
          return (
            <>
              <Access
                accessible={access['can_operator-common_detail_tenant']}
                fallback={null}
              >
                <Button
                  type="link"
                  className="actionBtn"
                  onClick={() => handleEdit(record)}
                >
                  查看
                </Button>
              </Access>

              <Access
                accessible={access['can_operator-common_edit_tenant']}
                fallback={null}
              >
                <Button
                  type="link"
                  className="actionBtn"
                  onClick={() => handleEdit(record, DETAIL_TYPE.edit)}
                >
                  编辑
                </Button>
              </Access>

              <Access
                accessible={access['can_operator-common_delete_tenant']}
                fallback={null}
              >
                <Popconfirm
                  title="删除后租户相关数据都将清除，且不可恢复，是否继续？"
                  onConfirm={() => handleDelete(record.id, record.name)}
                  placement="topRight"
                  overlayClassName="popConfirm"
                >
                  <Button type="link" className="actionBtn">
                    删除
                  </Button>
                </Popconfirm>
              </Access>
            </>
          );
        },
      });
    }
    return columnsArr;
  }, []);

  return (
    <div className="tableLayout">
      <div className={ss.btns}>
        <Access
          accessible={access['can_operator-common_add_tenant']}
          fallback={null}
        >
          <Button type="primary" className={ss.btn} onClick={handleToAdd}>
            <Icon type="icon-jiahao" />
            添加租户
          </Button>
        </Access>
      </div>

      <Table rowKey="id" {...tableProps} loading={loading} columns={columns} />
    </div>
  );
};

export default Widget;
