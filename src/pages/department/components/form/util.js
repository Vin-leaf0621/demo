export const flatArr = (array) => {
  const arr = [];

  const flat = (data = []) => {
    data.forEach((i) => {
      arr.push(i);
      if (i.subDept) {
        flat(i.subDept, arr);
      }
    });
  };

  flat(array);

  return arr;
};

export const buildTree = (array, arr) => {
  const item = array.at(0);

  if (item.parentCode === '0') {
    return array;
  }
  const parent = arr.find((i) => i.id === item.parentCode);

  if (parent) {
    return buildTree(
      [
        {
          name: parent.name,
          code: parent.code,
          parentCode: parent.parentCode,
          level: parent.level,
        },
      ].concat(array),
      arr,
    );
  }

  return array;
};
