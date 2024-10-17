/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'umi';
import { clone } from '@haici/utils';

const cacheParam = {};
/**
 * 缓存查询参数(可用于页面切换时是否缓存查询参数)
 */
const useCacheParam = () => {
  const isCache = useRef(false);
  const location = useLocation();
  const param = useMemo(() => clone(cacheParam[location.pathname] || {}), []);

  const setIsCache = () => {
    isCache.current = true;
  };

  const getIsCache = () => {
    return isCache.current;
  };

  const setCacheParam = (params) => {
    cacheParam[location.pathname] = params;
  };

  const clearCacheParam = () => {
    cacheParam[location.pathname] = {};
  };

  useEffect(() => {
    return () => {
      if (!getIsCache()) clearCacheParam();
    };
  }, []);

  return {
    param,
    setIsCache,
    getIsCache,
    setCacheParam,
  };
};

export default useCacheParam;
