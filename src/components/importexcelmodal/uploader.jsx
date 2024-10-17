import { useCallback } from 'react';
import { Upload } from 'antd';
import { localUpload } from '@/utils/request';
import Icon from '@/components/icon';

import ss from './index.less';

const { Dragger } = Upload;

const Uploader = ({
  templateUrl,
  requestUrl,
  params = {},
  onBeforeUpload,
  onFinish,
}) => {
  const customRequest = async ({ file, onSuccess, onError }) => {
    onBeforeUpload?.();
    try {
      const res = await localUpload(requestUrl, file, {
        data: { ...params },
      });
      onSuccess({
        status: 'done',
        uid: file.uid,
        filename: file.name,
        response: res,
      });
    } catch (error) {
      console.error(error);
      onError({
        status: 'error',
        uid: file.uid,
        filename: file.name,
      });
    }
  };

  const handleChange = useCallback(
    ({ file }) => {
      if (file.status && file.status !== 'uploading') {
        onFinish?.(file.status === 'error', file.response);
      }
    },
    [onFinish],
  );

  return (
    <div className={ss.uploader}>
      <div className={ss.uploaderTitle}>
        只支持导入使用模板编辑的信息，如没有模板，请
        <a href={templateUrl}>点击下载</a>
      </div>
      <Dragger
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        multiple={false}
        customRequest={customRequest}
        showUploadList={false}
        onChange={handleChange}
      >
        <div className={ss.uploaderDragger}>
          <Icon type="icon-shangchuan" className={ss.draggerIcon} />
          <p>点击上传或将文件拖曳到此区域</p>
        </div>
      </Dragger>
    </div>
  );
};

export default Uploader;
