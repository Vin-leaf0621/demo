import { uuid } from '@haici/utils';

// 过滤空对象
export const filterObj = (obj) => {
  const res = Object.keys(obj)
    .filter((item) => !!obj[item])
    .reduce((pre, cur) => ({ ...pre, [cur]: obj[cur] }), {});

  return res;
};

export const copyText = async (text) => {
  if (navigator.clipboard && navigator.permissions) {
    await navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement('textArea');
    textArea.value = text;
    textArea.style.width = 0;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999px';
    textArea.style.top = '10px';
    textArea.setAttribute('readonly', 'readonly');
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
};

export const download = (url, name) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const createInitImageList = (urls) => {
  if (Array.isArray(urls) && urls.length > 0) {
    return urls.map((url) => ({
      status: 'done',
      uid: uuid(),
      name: 'image.png',
      url,
    }));
  } else {
    return [];
  }
};
