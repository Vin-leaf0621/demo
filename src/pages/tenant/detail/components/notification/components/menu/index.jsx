import { Input, Tree } from 'antd';
import { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useDebounceFn } from 'ahooks';
import Icon from '@/components/icon';
import ss from './index.less';

const Menu = ({
  isSwitch = false,
  data,
  selectedTemplate,
  setSelectedTemplate,
  submit,
  expandedKey = [],
}) => {
  const [expandedKeys, setExpandedKeys] = useState();

  const handleSelect = (selectedKeys) => {
    setSelectedTemplate(selectedKeys[0]);
  };

  useEffect(() => {
    setExpandedKeys(expandedKey);
  }, [expandedKey]);

  const { run } = useDebounceFn(
    (e) => {
      const { value } = e.target;
      submit(value);
    },
    { wait: 500 },
  );

  const handleExpand = (expandedKeysValue) => {
    setExpandedKeys(expandedKeysValue);
  };

  return (
    <div className={ss.menu}>
      <Input
        placeholder="请输入"
        prefix={<Icon type="icon-sousuo" className={ss.searchIcon} />}
        onChange={run}
        allowClear
      />

      {data?.length ? (
        <div className={ss.treeContent}>
          <Tree
            treeData={data}
            expandedKeys={expandedKeys}
            onExpand={handleExpand}
            fieldNames={{
              title: 'name',
              key: 'id',
              children: 'noticeModuleRespVoList',
            }}
            titleRender={(nodeData) => {
              const { name, id, noticeModuleRespVoList, isSet, frontSwitch } =
                nodeData;

              const statu = isSwitch ? frontSwitch : isSet;

              if (noticeModuleRespVoList) {
                return <span className={ss.parentNode}>{name}</span>;
              } else {
                return (
                  <div
                    className={classNames(
                      ss.treeTitle,
                      selectedTemplate === id && ss.activeTitle,
                    )}
                  >
                    <p>{name}</p>
                    <span
                      className={classNames(
                        ss.normalStatus,
                        statu ? ss.setStatus : ss.notSetStatus,
                      )}
                    >
                      {isSwitch
                        ? frontSwitch
                          ? '开启'
                          : '关闭'
                        : isSet
                        ? '已配置'
                        : '未配置'}
                    </span>
                  </div>
                );
              }
            }}
            onSelect={handleSelect}
          />
        </div>
      ) : (
        <div className={ss.empty}>无搜索结果</div>
      )}
    </div>
  );
};

export default Menu;
