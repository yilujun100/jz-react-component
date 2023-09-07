import React from 'react';
import { Form, Grid, Button, Input } from '@arco-design/web-react';
import { IconRefresh, IconSearch } from '@arco-design/web-react/icon';
import { ConditionProps } from './ProTable';

export interface SearchFormProps {
  conditions: ConditionProps;
  searchText?: string;
  resetText?: string;
  onSearch: (values: Record<string, any>) => void;
}

const { Row, Col } = Grid;
const { useForm } = Form;

const colSpan = 8;

const SearchForm = (props: SearchFormProps) => {
  const { conditions, searchText, resetText, onSearch } = props;
  const [form] = useForm();

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
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Row gutter={24}>
          {conditions.map(condition => {
            const { label, id, render } = condition;
            return (
              <Col span={colSpan}>
                <Form.Item label={label} field={id}>
                  { render ? render : (
                    <Input placeholder={`请输入${label}`} allowClear />
                  ) }
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Form>
      <div className="right-button">
        <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
          {searchText ? searchText : '查询'}
        </Button>
        <Button icon={<IconRefresh />} onClick={handleReset}>
          {resetText ? resetText : '重置'}
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;