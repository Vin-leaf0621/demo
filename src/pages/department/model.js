export default {
  namespace: 'manageSubjectDepartment',
  state: {
    level: [],
    businessPattern: [],
    detail: {},
    deptInfo: {},
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
  effects: {},
};
