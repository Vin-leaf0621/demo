import { Form, Button, App } from 'antd';
import { history } from '@umijs/max';
import { useCallback, useState, useEffect, useRef } from 'react';
import ImageUpload from '@/components/imageupload';
import Title from '@/pages/tenant/components/title';
import { createInitImageList } from '@/utils/utils';
import Single from '../ruleitem/single';
import Multiple from '../ruleitem/multiple';
import Blank from '../ruleitem/blank';
import NumberInput from '../ruleitem/number';
import { ANSWER_TYPE, data } from '../../_data';
import Time from '../ruleitem/time';
import ss from '../../index.less';
import * as Api from '../../api';

const Modules = ({
  id,
  hisId,
  tenantId,
  copyHisId,
  isNotback = false,
  handleNext,
  isEdit = false,
  name,
  bizId,
  isView = false,
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [rules, setRules] = useState([]);
  const [formValue, setFormValue] = useState({}); // 展示的题目的表单值
  const [loading, setLoading] = useState(false);
  let sortNum = 1;
  const allInitValue = useRef(); // 保存所以表单的值（当前）

  // 获取规则配置详情
  const getProfile = async (requiredOptions) => {
    try {
      const res = await Api.getProfile({
        hisId: copyHisId ?? hisId,
        businessId: id,
      });
      const answers = (res || []).reduce((pre, cur) => {
        const options =
          cur.defineItems[0].type === ANSWER_TYPE.picture
            ? createInitImageList(cur.defineItems.map((i) => i.value))
            : cur.defineItems.map((i) => i.value);

        pre[cur.ruleKey] = [
          ...new Set([...options, ...(requiredOptions[cur.ruleKey] ?? [])]),
        ];

        return pre;
      }, {});

      return answers;
    } catch (error) {
      console.log(error, 'err');
    }
  };

  const getInitalValue = (rule) => {
    const { ruleDetails } = rule;
    let initialValue;
    switch (rule.subType) {
      case ANSWER_TYPE.single:
        initialValue = ruleDetails
          .filter((i) => i.choiceFlag === 0)
          .map((i) => i.optionKey);
        break;
      case ANSWER_TYPE.multiple:
        initialValue = ruleDetails
          .filter((i) => i.choiceFlag === 0)
          .map((i) => i.optionKey);
        break;
      case ANSWER_TYPE.number:
        initialValue = ruleDetails[0].defaultValue
          ? [ruleDetails[0].defaultValue]
          : undefined;
        break;
      default:
        initialValue = undefined;
    }
    return initialValue;
  };

  // 判断是否不展示
  const judgeIsNotShow = (ruleRelate, targetValue = []) => {
    const optionKey = ruleRelate.optionKey.split(',');
    const relateKey = optionKey.filter((i) => targetValue.includes(i));
    if (Number(ruleRelate?.type) === 1) {
      return !relateKey.length;
    } else {
      return !(relateKey.length === optionKey?.length);
    }
  };

  // 获取必选项
  const getRequired = (res) => {
    let requiredOptions = {},
      initalOptions = {};

    res.forEach((item) => {
      item.rules.forEach((i) => {
        const init = getInitalValue(i);
        initalOptions[i.ruleKey] = init;
        if ([ANSWER_TYPE.multiple, ANSWER_TYPE.single].includes(i.subType)) {
          const { ruleDetails } = i;
          const choiceOpts = ruleDetails.filter((itm) => itm.choiceFlag === 0);
          if (choiceOpts?.length) {
            const requiredOpts = choiceOpts
              .filter((i) => i.requireFlag === 0)
              .map((i) => i.optionKey);

            if (requiredOpts?.length) {
              requiredOptions[i.ruleKey] = requiredOpts;
            }
          }
        }
      });
    });

    return { requiredOptions, initalOptions };
  };

  const getFormValue = (res = {}, curValue) => {
    let initalVal = {};
    res.forEach((item) => {
      const result = (item.rules || []).reduce((preVal, curVal) => {
        const init = curValue[curVal.ruleKey];

        if (curVal.ruleRelate) {
          const isRelative = judgeIsNotShow(
            curVal.ruleRelate,
            { ...initalVal, ...preVal }[curVal.ruleRelate.ruleKey],
          );
          // 如果依赖的题目的选中值不为依赖项，不返回值，可确保后续依赖该题目的题目不显示
          if (isRelative) {
            return preVal;
          }
        }

        return { ...preVal, [curVal.ruleKey]: init };
      }, {});

      initalVal = { ...initalVal, ...result };
    });

    return initalVal;
  };

  // 获取规则详情
  const getBizRule = async () => {
    try {
      const res = await Api.getBizRule({
        businessId: id,
      });
      setRules(res || []);
      const { requiredOptions, initalOptions } = getRequired(res || []);

      const val = await getProfile(requiredOptions);

      const formVal = getFormValue(res, { ...initalOptions, ...val });

      allInitValue.current = formVal;
      form.setFieldsValue(formVal);
      setFormValue(formVal);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getBizRule();
    }
  }, [id]);

  // 保存
  const handleSave = async (isOnline) => {
    form.validateFields().then(async (values) => {
      setLoading(true);
      try {
        let ruleDefines = [];
        Object.keys(values).forEach((key) => {
          if (values[key] && values[key]?.length) {
            ruleDefines.push({
              ruleKey: key,
              ruleDefineValues: values[key][0]?.url
                ? values[key].map((i) => i.url)
                : values[key],
            });
          }
        });

        const params = {
          hisId,
          businessId: id,
          tenantId,
          ruleDefines,
          id: bizId,
        };

        if (isOnline) {
          await Api.saveOnline(params);
        } else {
          await Api.save(params);
        }

        message.success('保存成功！', 1.5, () => {
          if (isNotback) {
            handleNext?.();
          } else {
            history.back();
          }
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    });
  };

  const handleValueChange = (changeValues) => {
    const formVal = getFormValue(rules, {
      ...allInitValue.current,
      ...changeValues,
    });
    allInitValue.current = { ...allInitValue.current, ...changeValues };
    setFormValue(formVal);
  };

  const handleCancle = () => {
    history.back();
  };

  const onImageChanged = useCallback(({ fileList = [] }) => {
    return fileList.map((file) => ({
      status: file.status,
      uid: file.uid,
      url: file.response ? file.response.url : file.url,
    }));
  }, []);

  const renderItem = (rule = {}) => {
    const { ruleDetails = [], ruleRelate } = rule;
    const CONTAINER_MAP = {
      [ANSWER_TYPE.single]: Single,
      [ANSWER_TYPE.multiple]: Multiple,
      [ANSWER_TYPE.text]: Blank,
      [ANSWER_TYPE.number]: NumberInput,
      [ANSWER_TYPE.picture]: ImageUpload,
      [ANSWER_TYPE.time]: Time,
    };
    const Container = CONTAINER_MAP[rule.subType || ANSWER_TYPE.single];
    //关联题目时判断是否应该展示
    if (ruleRelate?.ruleKey) {
      const targetKeyValue = formValue[ruleRelate.ruleKey];
      const isNotShow = judgeIsNotShow(
        ruleRelate,
        Array.isArray(targetKeyValue) ? targetKeyValue : [targetKeyValue],
      );
      if (isNotShow) return null;
    }

    const isImageUpload = rule.subType === ANSWER_TYPE.picture;

    // 默认值
    let initialValue;
    switch (rule.subType) {
      case ANSWER_TYPE.single:
        initialValue = ruleDetails
          .filter((i) => i.choiceFlag === 0)
          .map((i) => i.optionKey);
        break;
      case ANSWER_TYPE.multiple:
        initialValue = ruleDetails
          .filter((i) => i.choiceFlag === 0)
          .map((i) => i.optionKey);
        break;
      case ANSWER_TYPE.number:
        initialValue = ruleDetails[0].defaultValue
          ? [ruleDetails[0].defaultValue]
          : undefined;
        break;
      default:
        initialValue = undefined;
    }

    const imageProps = ruleDetails[0] || {};

    return (
      <div className={ss.ruleItem}>
        <div className={ss.title}>
          {rule.requireFlag === 0 ? (
            <span className={ss.required}>*</span>
          ) : null}
          {sortNum++}、{rule.name}
        </div>
        {rule.description ? (
          <div className={ss.tips}>{rule.description}</div>
        ) : null}
        <div className={ss.ruleDetails}>
          <Form.Item
            shouldUpdate
            name={rule.ruleKey}
            rules={[
              {
                required: !rule.requireFlag,
                message: '此题为必填题，请填写后保存',
              },
            ]}
            initialValue={initialValue}
            {...(isImageUpload
              ? {
                  valuePropName: 'fileList',
                  getValueFromEvent: onImageChanged,
                }
              : {})}
          >
            <Container
              items={ruleDetails}
              disabled={(isEdit && rule.editFlag === 1) || isView}
              {...(isImageUpload
                ? {
                    className: ss.imageUpload,
                    limit: imageProps.number,
                    accept: imageProps.content,
                    maxSize:
                      imageProps.unit === 'M'
                        ? Number(imageProps.maximum)
                        : imageProps.maximum + imageProps.unit.slice(0, 1),
                    isCrop: !!imageProps.ratio,
                    width: imageProps.ratio
                      ? Number(imageProps.ratio.split(':')[0])
                      : undefined,
                    height: imageProps.ratio
                      ? Number(imageProps.ratio.split(':')[1])
                      : undefined,
                  }
                : {})}
            />
          </Form.Item>
          {isImageUpload ? (
            <p className={ss.imageUploadTip}>
              格式为:
              {imageProps.content}，
              {imageProps.ratio
                ? `图片比例：${imageProps.ratio.split(':')[0]}:${
                    imageProps.ratio.split(':')[1]
                  }，`
                : ''}
              大小不超过
              {imageProps.maximum}
              {imageProps.unit}，最多
              {imageProps.number}张
            </p>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div className={ss.rulesContent}>
      <p>{name ? `${name}规则配置` : '业务规则配置'}</p>
      <Form form={form} onValuesChange={handleValueChange}>
        <div className={ss.moduleList}>
          {rules?.length ? (
            rules.map((item, index) => (
              <div className={ss.moduleItem} key={index}>
                {item.name ? (
                  <Title title={item.name} style={{ marginBottom: 24 }} />
                ) : null}
                {item.rules.map((i) => (
                  <div key={i.ruleKey}>{renderItem(i)}</div>
                ))}
              </div>
            ))
          ) : (
            <div className={ss.empty}>暂无规则配置</div>
          )}
        </div>
      </Form>
      {isView ? null : (
        <div className={ss.footer}>
          <Button
            type="default"
            className={ss.btn}
            onClick={handleCancle}
            loading={loading}
          >
            取消
          </Button>

          <Button
            type="primary"
            className={ss.btn}
            onClick={() => handleSave()}
            loading={loading}
          >
            {isEdit ? '修改' : '添加'}
          </Button>

          <Button
            type="primary"
            className={ss.btn}
            onClick={() => handleSave(true)}
            loading={loading}
          >
            {isEdit ? '修改' : '添加'}并上线
          </Button>
        </div>
      )}
    </div>
  );
};

export default Modules;
