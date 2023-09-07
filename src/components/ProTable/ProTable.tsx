import React, { useState, useEffect } from 'react';
import { TableColumnProps, PaginationProps, ButtonProps, Card, Typography, Space, Button, Table } from '@arco-design/web-react';
import SearchForm from './SearchForm';
import './ProTable.less';

export type ConditionProps = Array<{ label: string; id: string; render?: React.ReactElement }>;

export interface ProTableProps {
  /**
   * 表格标题
   */
  title: string;
  /**
   * 查询条件
   */
  conditions: ConditionProps;
  /**
   * 查询按钮文本
   */
  searchText?: string;
  /**
   * 重置按钮文本
   */
  resetText?: string;
  /**
   * 表格行 key 的取值字段
   */
  rowKey: string;
  /**
   * 表格列
   */
  columns: TableColumnProps[];
  /**
   * 表格数据
   */
  data: Array<any>;
  /**
   * 分页设置
   */
  pagination: PaginationProps | boolean;
  /**
   * 标题栏左侧按钮组
   */
  leftBtns?: Array<ButtonProps & { key: string; label: string }>;
  /**
   * 标题栏右侧按钮组
   */
  rightBtns?: Array<ButtonProps & { key: string; label: string }>;
}

const { Title } = Typography;

const ProTable = (props: ProTableProps) => {
  const { title, conditions, searchText, resetText, rowKey, columns, data, leftBtns, rightBtns } = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationProps | boolean>(props.pagination);
  const [formParams, setFormParams] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const renderLeftBtns = () => {
    return leftBtns?.map(btn => <Button {...btn}>{btn.label}</Button>);
  };

  const renderRightBtns = () => {
    return rightBtns?.map(btn => <Button {...btn}>{btn.label}</Button>);
  };

  const handleSearch = (params: any) => {
    setPagination({ ...pagination as Object, current: 1 });
    setFormParams(params);
  }

  const onChangeTable = (pagination: PaginationProps) => {
    const { current, pageSize } = pagination;
    setPagination({
      ...pagination,
      current,
      pageSize
    })
  };

  return (
    <Card>
      <Title>{title}</Title>
      <SearchForm searchText={searchText} resetText={resetText} conditions={conditions} onSearch={handleSearch} />
      <div className="button-group">
        <Space>
          {leftBtns && leftBtns.length > 0 && renderLeftBtns()}
        </Space>
        <Space>
          {rightBtns && rightBtns.length > 0 && renderRightBtns()}
        </Space>
      </div>
      <Table
        rowKey={rowKey}
        loading={loading}
        onChange={onChangeTable}
        pagination={pagination}
        columns={columns}
        data={data}
      />
    </Card>
  );
};

export default ProTable;