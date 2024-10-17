import { useMemo, useState } from 'react';
import { message, Modal, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import Icon from '@/components/icon';
import imageCompression from 'browser-image-compression';

import { getBase64, uploadApi } from './api';
import ss from './index.less';

const ImageUpload = (props) => {
  const {
    id, // form.scrollToField滚动依赖于表单控件元素上绑定的 id 字段
    className = '',
    isCrop = true, // 是否裁剪
    aspect, // 裁剪比例
    width = 100, // 裁剪宽度
    height = 100, // 裁剪高度
    maxSize = 1, // 允许最大上传大小（传数字即代表Mb, 支持传递字符串: 100k|2m）
    disabled = false, // 是否禁用上传
    accept = 'image/*', // 允许上传图片类型
    fileList = [], // 上传文件列表
    showUploadList = true, // 文件列表显示
    btnText = '上传图片', // 上传按钮文案
    limit = 1, // 上传最大数量
    compress = false, // 是否压缩图片
    onChange,
    customVerify, // 自定义校验
    shape = 'rect', // 裁剪形状 'rect','round'
    listType = 'picture-card', // 上传列表样式
    previewClassName = '', // 预览弹窗样式
  } = props;

  const [previewData, setPreviewData] = useState({ image: '', visible: false });

  const maxSizeMB = useMemo(() => {
    if (typeof maxSize === 'string') {
      const num = parseInt(maxSize.slice(0, -1), 10);
      return maxSize.slice(-1) === 'k' ? num / 1024 : num;
    }
    return maxSize;
  }, [maxSize]);

  const beforeUpload = async (file) => {
    if (!file) return false;

    // 自定义校验
    if (customVerify) {
      const customVerifyResult = await customVerify(file);
      if (!customVerifyResult) {
        return false;
      }
    }

    if (isCrop || compress) {
      // 如果是裁剪或者开启了图片压缩，进行图片压缩
      const options = {
        maxSizeMB,
        useWebWorker: true,
      };

      try {
        message.loading('图片处理中...', 0);
        const blob = await imageCompression(file, options);
        const { type, name, uid } = file;
        const newFile = Object.assign(new File([blob], name, { type }), {
          uid,
        });
        return newFile;
      } catch (err) {
        console.error('压缩图片失败: ', err);
      } finally {
        message.destroy();
      }
    }

    const isOverMaxSize = file.size / (1024 * 1024) >= maxSizeMB;

    if (isOverMaxSize) {
      message.error(
        `上传图片超过${
          typeof maxSize === 'string' ? maxSize + 'b' : maxSize + 'Mb'
        }`,
      );
      return false;
    }

    return file;
  };

  const handleChange = (option) => {
    // 过滤失败
    const result = option.fileList.filter((item) => {
      if (!item.status || (item.status && item.status === 'error')) {
        return false;
      }
      return true;
    });

    if (onChange) onChange({ fileList: result });
  };

  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      const res = await uploadApi(file);
      onSuccess({
        status: 'done',
        uid: file.uid,
        filename: res.filename,
        url: res.url,
      });
    } catch (error) {
      console.log('error', error);
      onError({
        status: 'error',
        uid: file.uid,
        filename: file.name,
      });
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewData({ image: file.url || file.preview, visible: true });
  };

  const handleCancelPreview = () => {
    setPreviewData({ image: '', visible: false });
  };

  const renderButton = () => (
    <div className={ss.uploadBtn}>
      <Icon type="icon-jiahao" />
      <p className={ss.uploadBtnText}>{btnText}</p>
    </div>
  );

  const renderUpload = () => (
    <Upload
      disabled={disabled}
      accept={accept}
      listType={listType}
      fileList={fileList}
      onPreview={handlePreview}
      onChange={handleChange}
      customRequest={customRequest}
      beforeUpload={beforeUpload}
      showUploadList={showUploadList}
    >
      {fileList.length >= limit ? null : renderButton()}
    </Upload>
  );

  return (
    <div className={`${ss.imageUpload} ${className}`} id={id ?? ''}>
      {isCrop ? (
        <ImgCrop
          modalClassName={ss.imgCrop}
          modalTitle="编辑图片"
          modalOk="确定"
          modalCancel="取消"
          zoom
          rotate
          aspect={aspect || width / height}
          quality={1}
          shape={shape}
        >
          {renderUpload()}
        </ImgCrop>
      ) : (
        <>{renderUpload()}</>
      )}

      <Modal
        open={previewData.visible}
        closable={false}
        footer={null}
        onCancel={handleCancelPreview}
        className={previewClassName}
      >
        <img
          alt="预览"
          style={{ width: '100%' }}
          src={previewData.image || ''}
        />
      </Modal>
    </div>
  );
};

export default ImageUpload;
