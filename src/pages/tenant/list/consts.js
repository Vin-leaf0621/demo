export const SEARCH_DATA_LIST = [
  {
    type: 'input',
    name: 'name',
    label: '租户名称',
    itemProps: {
      placeholder: '请输入',
      allowClear: true,
    },
  },
  {
    type: 'searchselect',
    name: 'hisId',
    label: '入驻医院',
    itemProps: {
      fetchApi: '/api/foundation/operator/his/simple-page',
      searchName: 'hisIdOrName',
      searchParams: { hasTenant: false },
      options: {
        placeholder: '请输入HIS_ID或医院名称查询',
        allowClear: true,
        fieldNames: {
          label: 'hisIdAndName',
          value: 'hisId',
        },
      },
    },
  },
];
