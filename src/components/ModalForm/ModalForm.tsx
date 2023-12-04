import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FormItemProps, FormInstance, Grid, Modal, Form, Input } from '@arco-design/web-react';

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
  trigger?: JSX.Element;
  /**
   * 是否打开[受控]
   */
  open?: boolean;
  /**
   * visible 改变时触发
   * @param open
   * @returns
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * 表单项
   */
  formItems: Array<FormItemProps & { render?: JSX.Element }>;
  /**
   * 表单列
   */
  formCols?: number;
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
  const {
    title,
    width = 520,
    trigger,
    open: propsOpen,
    formItems,
    formCols,
    labelWidth = 90,
    initialValues,
    onFinish,
    onOpenChange
  } = props;
  const [open, setOpen] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const formRef = useRef<FormInstance>(null);

  useEffect(() => {
    if (propsOpen) {
      setOpen(true);
    }
  }, [propsOpen]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [open]);

  const handleOk = () => {
    formRef.current
      ?.validate()
      .then(async values => {
        const result = await onFinishHandler(values);
        return result;
      })
      .catch(err => {
        console.error('Error: ', err);
      });
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const triggerDom = useMemo(() => {
    if (!trigger) return null;

    return React.cloneElement(trigger, {
      key: 'trigger',
      ...trigger.props,
      onClick: async (e: any) => {
        setOpen(!open);
        trigger.props?.onClick?.(e);
      }
    });
  }, [trigger, open, setOpen]);

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
        setOpen(false);
      }
      return result;
    },
    [onFinish, setOpen]
  );

  const resetFields = () => {
    formRef.current?.resetFields();
  };

  const contentRender: () => any = () => {
    if (formCols && formCols > 1) {
      const _span = 24 / formCols;
      const _rows = Math.ceil(formItems.length / formCols);
      const arrayChunk = (arr: Array<any>, n: number) => {
        const array = arr.slice();
        const chunks = [];
        while (array.length) chunks.push(array.splice(0, n));
        return chunks;
      };
      return arrayChunk([...Array(formItems.length).keys()], formCols).map((row, i) => (
        <Grid.Row key={i} gutter={12}>
          {row.map(colIdx => {
            const { render, label, field, rules } = formItems[colIdx];
            return (
              <Grid.Col key={colIdx} span={_span}>
                <FormItem label={label} field={field} rules={rules}>
                  {render ? render : <Input placeholder="请输入" allowClear />}
                </FormItem>
              </Grid.Col>
            );
          })}
        </Grid.Row>
      ));
    }
    return formItems.map((formItem, index) => {
      const { render, label, field, rules } = formItem;
      return (
        <FormItem key={index} label={label} field={field} rules={rules}>
          {render ? render : <Input placeholder="请输入" allowClear />}
        </FormItem>
      );
    });
  };

  return (
    <>
      <Modal
        visible={open}
        title={<div style={{ textAlign: 'left' }}>{title}</div>}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={confirmLoading}
        style={{
          width
        }}
        afterClose={() => {
          resetFields();
          setOpen(false);
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
          {contentRender()}
        </Form>
      </Modal>
      {triggerDom}
    </>
  );
};

export default ModalForm;
