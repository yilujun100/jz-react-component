import React, { useState, useRef, useMemo, useCallback } from 'react';
import { FormItemProps, FormInstance, Modal, Form, Input } from '@arco-design/web-react';

export interface ModalFormProps {
  /**
   * 弹窗标题
   */
  title: string;
  /**
   * 弹窗宽度 默认 520
   */
  width?: string | number;
  /**
   * 用于触发弹窗打开的
   */
  trigger: JSX.Element;
  /**
   * 表单项
   */
  formItems: Array<FormItemProps & { render?: JSX.Element }>;
  /**
   * 表单项标签文本宽度
   */
  labelWidth?: number;
  /**
   * 表单初始值
   */
  initialValues?: Partial<any>;
  /**
   * 接收任意值, 返回 真值 会关掉这个弹窗
   *
   * @name 表单结束后调用
   *
   * @example 结束后关闭弹窗
   * onFinish: async () => { await save(); return true }
   *
   * @example 结束后不关闭弹窗
   * onFinish: async () => { await save(); return false }
   */
  onFinish: (formData: any) => Promise<any>;
  /**
   * 弹框关闭之后的回调
   */
  afterClose?: () => void;
}

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};

const ModalForm = (props: ModalFormProps) => {
  const { title, width = 520, trigger, formItems, labelWidth = 90, initialValues, onFinish } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>(null);

  const handleOk = () => {
    formRef.current?.validate().then(async (values) => {
      const result = await onFinishHandler(values);
      return result;
    }).catch(err => {
      console.error('Error: ', err);
      setVisible(false);
    });
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const triggerDom = useMemo(() => {
    if (!trigger) return null;

    return React.cloneElement(trigger, {
      key: 'trigger',
      ...trigger.props,
      onClick: async (e: any) => {
        setVisible(!visible);
        trigger.props?.onClick?.(e);
      }
    })
  }, [trigger]);

  const onFinishHandler = useCallback(
    async (values: Record<string, any>) => {
      const response = onFinish?.(values);
      if (response instanceof Promise) {
        setConfirmLoading(true);

        response.finally(() => {
          setConfirmLoading(false);
        });
      }
      const result = await response;
      // 返回真值, 关闭弹窗
      if (result) {
        setVisible(false);
      }
      return result;
    },
    [onFinish, setVisible]
  );

  const resetFields = () => {
    formRef.current?.resetFields();
  };

  return (
    <>
      <Modal
        visible={visible}
        title={<div style={{ textAlign: 'left' }}>{title}</div>}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        style={{
          width
        }}
        afterClose={() => {
          resetFields();
          setVisible(false);
          props?.afterClose?.();
        }}
      >
        <Form
          {...formItemLayout}
          ref={formRef}
          form={form}
          labelCol={{
            style: { flexBasis: labelWidth }
          }}
          wrapperCol={{
            style: { flexBasis: `calc(100% - ${labelWidth}px)` }
          }}
          initialValues={initialValues}
        >
          {formItems.map((formItem, index) => {
            const { render, label, field, rules } = formItem;
            return (
              <FormItem key={index} label={label} field={field} rules={rules}>
                {render ? render : <Input placeholder="请输入" allowClear />}
              </FormItem>
            );
          })}
        </Form>
      </Modal>
      {triggerDom}
    </>
  );
};

export default ModalForm;