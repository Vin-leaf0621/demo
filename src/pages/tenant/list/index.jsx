import { Form } from 'antd';
import { useMemo } from 'react';
import { useAntdTable } from 'ahooks';
import { merge } from 'lodash';
import { filterObj } from '@/utils/utils';
import useCacheParam from '@/hooks/useCacheParam';
import SearchBox from '@/components/searchbox';
import Table from './components/table';
import { SEARCH_DATA_LIST } from './consts';
import * as Api from './api';

const Account = () => {
  const [form] = Form.useForm();
  const { setIsCache, param: searchParam, setCacheParam } = useCacheParam();
  const {
    pageNo: searchPage = 1,
    pageSize: searchSize = 10,
    ...restSearchParam
  } = searchParam;

  const fetchList = async ({ current, pageSize }) => {
    try {
      const { ...restParams } = form.getFieldsValue();

      const params = {
        pageNo: current,
        pageSize: pageSize,
        ...filterObj(restParams),
      };

      setCacheParam({ ...params });

      const { totalCount, dataList } = await Api.fetchList(params);

      return {
        total: totalCount || 0,
        list: dataList || [],
      };
    } catch (error) {
      return {
        total: 0,
        list: [],
      };
    }
  };

  const { loading, tableProps, search } = useAntdTable(fetchList, {
    form,
    defaultParams: [
      { current: searchPage, pageSize: searchSize },
      { ...restSearchParam },
    ],
  });

  const tableRealProps = useMemo(
    () =>
      merge(tableProps, {
        pagination: {
          showQuickJumper: true,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        },
      }),
    [tableProps],
  );

  const { submit, reset } = search;

  return (
    <>
      <SearchBox
        dataList={SEARCH_DATA_LIST}
        form={form}
        submit={submit}
        reset={reset}
        loading={loading}
      />
      <Table
        tableProps={tableRealProps}
        loading={loading}
        submit={submit}
        form={form}
        setIsCache={setIsCache}
      />
    </>
  );
};

export default Account;
