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
   * 获取 data 的方法
   */
  request: (params: {
    page: number | undefined;
    pageSize: number | undefined;
    [key: string]: any;
  }) => Promise<{ data: { list: any[]; total: number; }; success: boolean; }>
  /**
   * 是否展示分页
   * 如果设置为 True , 那么必须设置 pagination
   */
  showPagination: boolean;
  /**
   * 分页设置
   */
  pagination?: PaginationProps;
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
  const { title, conditions, searchText, resetText, rowKey, columns, leftBtns, rightBtns, showPagination, request } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState(props.data || [])
  const [pagination, setPagination] = useState<PaginationProps>(props.pagination || {
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true
  });
  const [formParams, setFormParams] = useState({});

  useEffect(() => {
    if (!request) return;
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  const fetchData = async () => {
    const { current, pageSize } = pagination;
    setLoading(true);
    try {
      const res = await request({ page: current, pageSize, ...formParams });
      setData(res.data.list);
      setPagination({
        ...pagination,
        current,
        pageSize,
        total: res.data.total
      });
      setLoading(false);
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  const renderLeftBtns = () => {
    return leftBtns?.map(btn => <Button {...btn}>{btn.label}</Button>);
  };

  const renderRightBtns = () => {
    return rightBtns?.map(btn => <Button {...btn}>{btn.label}</Button>);
  };

  const handleSearch = (params: any) => {
    if (showPagination) {
      setPagination({ ...pagination as Object, current: 1 });
    }
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
        pagination={showPagination ? pagination : false}
        columns={columns}
        data={data}
      />
    </Card>
  );
};

export default ProTable;