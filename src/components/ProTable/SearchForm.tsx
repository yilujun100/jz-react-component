import type { ForwardRefRenderFunction } from 'react';
import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import type { FormInstance } from '@arco-design/web-react';
import { Form, Grid, Button, Input, Space, Link } from '@arco-design/web-react';
import { IconRefresh, IconSearch, IconUp, IconDown } from '@arco-design/web-react/icon';
import cls from 'classnames';
import { ConditionProps } from './ProTable';

export interface SearchFormProps {
  colSpan?: number;
  limitNum?: number;
  conditions: ConditionProps;
  searchText?: string;
  resetText?: string;
  initialValues?: Partial<any>;
  onSearch: (values: Record<string, any>) => void;
}

type SearchFormHandle = {
  form: FormInstance<any>;
};

const { Row, Col } = Grid;
const { useForm } = Form;

const SearchForm: ForwardRefRenderFunction<SearchFormHandle, SearchFormProps> = (props, ref) => {
  useImperativeHandle(ref, () => ({
    form
  }));
  const { limitNum = 3, colSpan = 6, conditions, searchText, resetText, initialValues,  onSearch } = props;
  const [form] = useForm();
  const [collapsed, setCollapsed] = useState(true);
  const showCollapseButton = useMemo(() => {
    return conditions.length > limitNum;
  }, [conditions, limitNum]);

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onSearch(values);
  };

  const handleReset = () => {
    form.resetFields();
    props.onSearch({});
  };

  return (
    <div className="search-form-wrapper">
      <Form
        form={form}
        className="search-form"
        labelAlign="left"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        initialValues={initialValues}
      >
        <Row gutter={24}>
          {conditions.map((condition, index) => {
            const { label, id, placeholder, render } = condition;
            return (
              <Col className={cls({ 'item-col-hidden': index > limitNum - 1 && collapsed })} span={colSpan} key={id}>
                <Form.Item label={label} field={id}>
                  {render ? render : <Input placeholder={placeholder ? placeholder : `请输入${label}`} allowClear />}
                </Form.Item>
              </Col>
            );
          })}
          <Col span={colSpan}>
            <Space style={{ marginBottom: '20px' }}>
              <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
                {searchText ? searchText : '查询'}
              </Button>
              <Button icon={<IconRefresh />} onClick={handleReset}>
                {resetText ? resetText : '重置'}
              </Button>
              {showCollapseButton && (
                <Link
                  hoverable={false}
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                >
                  {collapsed ? '展开' : '收起'}
                  {collapsed ? <IconDown /> : <IconUp />}
                </Link>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default forwardRef(SearchForm);
