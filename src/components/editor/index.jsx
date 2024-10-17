import { useMemo } from 'react';
import HaiciEditor from '@haici/pc-editor';

import { ossConvertUrl, ossSignUrl } from '@/services/upload';
import ss from './index.less';

const Editor = ({ disabled = false, value, onChange, style = {}, ...rest }) => {
  const uploadProps = useMemo(() => {
    const { origin } = window;
    return {
      uploadType: 'oss',
      acl: 1,
      getSignApi: `${origin}${ossSignUrl}`,
      convertUrlApi: `${origin}${ossConvertUrl}`,
    };
  }, []);

  const handleChange = (v) => {
    onChange?.(v);
  };

  return (
    <div style={style} className={ss.widget}>
      <HaiciEditor
        {...rest}
        value={value}
        onChange={handleChange}
        uploadProps={uploadProps}
        imageDefaultWidth="100%"
        imageDefaultHeight="100%"
        toolbarMode="sliding"
      />
      {disabled && <div className={ss.disabled} />}
    </div>
  );
};

export default Editor;
