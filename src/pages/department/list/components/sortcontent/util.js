export const flattren = (list = []) => {
  let res = [];

  function flat(data = []) {
    data.forEach((item, index) => {
      res.push({ id: item.id, sortNo: index });
      if (item.subBizDept) {
        flat(item.subBizDept);
      }
    });
  }

  flat(list);

  return res;
};
