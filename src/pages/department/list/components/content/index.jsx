import { App, Button } from 'antd';
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Access,
  history,
  useAccess,
  useDispatch,
  useSelector,
} from '@umijs/max';
import Icon from '@/components/icon';
import ImportExcelModal from '@/components/importexcelmodal';
import DeptModule from '../deptmodule';
import * as Api from '../../api';
import SyncDrawer from '../syncdrawer';
import DeptDetail from '../deptdetail';

import ss from './index.less';
import SortContent from '../sortcontent';

const DEPT_LEVEL_INFO = [
  {
    title: '一级科室',
    value: 'firstDept',
    dataKey: 'firstDepts',
  },
  {
    title: '二级科室',
    value: 'secondDept',
    dataKey: 'secondDepts',
  },
  {
    title: '三级科室',
    value: 'thirdDept',
    dataKey: 'thirdDepts',
  },
];

const DeptContent = ({ depts = [], hisId, submit }) => {
  const access = useAccess();
  const dispatch = useDispatch();
  const { message } = App.useApp();
  const { deptInfo } = useSelector((state) => state.manageSubjectDepartment);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [detailProps, setDetailProps] = useState({ open: false, detail: null });
  const [isSort, setIsSort] = useState(false);

  useEffect(() => {
    if (depts) {
      const secondDepts = depts[0]?.subBizDept ?? [];
      const thirdDepts = secondDepts[0]?.subBizDept ?? [];
      dispatch({
        type: 'manageSubjectDepartment/save',
        payload: {
          deptInfo: {
            ...deptInfo,
            firstDepts: depts,
            firstDept: depts[0]?.id,
            secondDepts,
            secondDept: secondDepts[0]?.id,
            thirdDepts,
            thirdDept: thirdDepts[0]?.id,
          },
        },
      });
    }
  }, [depts]);

  // 导入
  const handleImport = useCallback(() => {
    setIsImportModalOpen(true);
  }, []);

  const handleCancelImport = useCallback(() => {
    setIsImportModalOpen(false);
  }, []);

  const handleImportSuccess = useCallback(() => {
    setIsImportModalOpen(false);
    submit?.();
  }, [submit]);

  // 接口同步
  const handleSync = () => {
    setSyncOpen(true);
  };

  // 选择科室
  const handleChangeSelect = (val, id, subBizDept = []) => {
    let res = {};
    switch (val) {
      case 'firstDept':
        res = {
          secondDepts: subBizDept,
          secondDept: subBizDept[0]?.id,
          thirdDepts: subBizDept[0]?.subBizDept ?? [],
          thirdDept: (subBizDept[0]?.subBizDept ?? [])[0]?.id,
        };
        break;
      case 'secondDept':
        res = {
          thirdDepts: subBizDept,
          thirdDept: subBizDept[0]?.id,
        };
        break;
      default:
        res = {};
        break;
    }
    dispatch({
      type: 'manageSubjectDepartment/save',
      payload: {
        deptInfo: { ...deptInfo, [val]: id, ...res },
      },
    });
  };

  // 添加
  const handleAdd = (val) => {
    if (val === 'secondDept' && !deptInfo?.firstDept) {
      message.warning('请先添加一级科室！');
      return;
    }

    if (val === 'thirdDept' && !deptInfo?.secondDept) {
      message.warning('请先添加二级科室！');
      return;
    }

    let level = 1;
    switch (val) {
      case 'secondDept':
        level = 2;
        break;
      case 'thirdDept':
        level = 3;
        break;
      default:
        level = 1;
    }

    dispatch({
      type: 'manageSubjectDepartment/save',
      payload: {
        deptLevel: level,
        deptInfo: deptInfo,
        hisId,
      },
    });
    history.push(
      `/manage/subject/department/add?hisId=${hisId}${
        val === 'firstDept' ? '&isFirst=1' : ''
      }`,
    );
  };

  // 查看
  const handleView = async (detail, val) => {
    try {
      const res = await Api.queryDetail({
        hisId,
        deptId: detail?.id,
      });
      setDetailProps((pre) => ({
        ...pre,
        open: true,
        detail: res,
        value: val,
      }));
    } catch (error) {}
  };

  // 编辑
  const handleEdit = (item, val) => {
    let level = 1;
    switch (val) {
      case 'secondDept':
        level = 2;
        break;
      case 'thirdDept':
        level = 3;
        break;
      default:
        level = 1;
    }
    dispatch({
      type: 'manageSubjectDepartment/save',
      payload: {
        deptLevel: level,
        deptInfo: deptInfo,
        hisId,
      },
    });
    history.push(
      `/manage/subject/department/edit?hisId=${hisId}&deptId=${item.id}${
        val === 'firstDept' ? '&isFirst=1' : ''
      }`,
    );
  };

  // 删除
  const handleDelete = async (id) => {
    try {
      await Api.deleteDept({
        hisId,
        id,
      });
      message.success('删除成功！', 1.5, () => {
        submit?.();
      });
    } catch (error) {}
  };

  const handleSort = () => {
    setIsSort(true);
  };

  const handleSortSubmit = async (value) => {
    try {
      await Api.sortDept({
        hisId,
        deptSortNoInfos: value,
      });

      message.success('保存成功!', 1.5, () => {
        setIsSort(false);
        submit?.();
      });
    } catch (error) {}
  };

  return (
    <div className={ss.deptContent}>
      <div className={ss.btns}>
        {isSort ? (
          <></>
        ) : (
          <>
            <Access
              accessible={access.can_common_import_manage_subject_department}
              fallback={null}
            >
              <Button type="primary" className={ss.btn} onClick={handleImport}>
                导入科室信息
              </Button>
            </Access>
            <Access
              accessible={access.can_common_sync_manage_subject_department}
              fallback={null}
            >
              <Button className={ss.btn} onClick={handleSync}>
                <Icon type="icon-tongbu" className={ss.icon} />
                实时同步
              </Button>
            </Access>
            <Access
              accessible={access.can_common_sort_manage_subject_department}
              fallback={null}
            >
              <Button className={ss.btn} onClick={handleSort}>
                排序
              </Button>
            </Access>
          </>
        )}
      </div>

      <div className={ss.content}>
        {isSort ? (
          <SortContent
            treeData={depts}
            submit={handleSortSubmit}
            setIsSort={setIsSort}
          />
        ) : (
          DEPT_LEVEL_INFO.map((item) => (
            <DeptModule
              key={item.value}
              title={item.title}
              data={deptInfo[item.dataKey]}
              activeKey={deptInfo[item.value]}
              handleChangeSelect={(id, subBizDept) =>
                handleChangeSelect(item.value, id, subBizDept)
              }
              handleAdd={() => handleAdd(item.value)}
              handleView={(val) => handleView(val, item.value)}
              handleEdit={(val) => handleEdit(val, item.value)}
              handleDelete={handleDelete}
            />
          ))
        )}
      </div>

      <ImportExcelModal
        title="导入科室信息"
        importUrl="/api/foundation/manage/dept/import"
        templateUrl="https://publicoss.med.haici.com/299999/HUB-%E7%A7%91%E5%AE%A4%E4%BF%A1%E6%81%AF%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx"
        open={isImportModalOpen}
        onCancel={handleCancelImport}
        onComplete={handleImportSuccess}
        params={{ hisId }}
      />

      <SyncDrawer
        open={syncOpen}
        onClose={() => setSyncOpen(false)}
        depts={depts}
        hisId={hisId}
        submit={submit}
      />

      <DeptDetail
        {...detailProps}
        onClose={() => setDetailProps((pre) => ({ ...pre, open: false }))}
        handleToEdit={(val) => handleEdit(val, detailProps.value)}
      />
    </div>
  );
};

export default DeptContent;
