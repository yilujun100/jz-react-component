import type { ReactNode, RefObject } from 'react';
import React, { useState, useEffect } from 'react';
import type { FormInstance, TableRowSelectionProps } from '@arco-design/web-react';
import {
  TableColumnProps,
  PaginationProps,
  ButtonProps,
  Card,
  Typography,
  Space,
  Button,
  Table,
  Tooltip,
  Message
} from '@arco-design/web-react';
import { isEqual } from 'lodash';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import SearchForm from './SearchForm';
import './ProTable.less';

export type ConditionProps = Array<{
  label: string | ReactNode;
  id: string;
  placeholder?: string;
  render?: React.ReactElement;
}>;
export interface ProTableProps {
  /**
   * 表格标题
   */
  title?: string;
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
   * 默认查询参数
   */
  initialQueryParams?: { [key: string]: any };
  /**
   * 获取查询表单的 form 实例
   */
  formRef?: RefObject<{ form: FormInstance }>;
  /**
   * 表格行 key 的取值字段
   */
  rowKey: string;
  /**
   * 表格列
   */
  columns: TableColumnProps[];
  /**
   * 设置 x 轴或 y 轴的滚动
   */
  scroll?: {
    x?: number | string | boolean;
    y?: number | string | boolean;
  };
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
  }) => Promise<{ data: { list: any[]; total: number }; success: boolean }>;
  /**
   * 是否手动触发请求
   */
  manualRequest?: boolean;
  /**
   * 数据加载完成之后触发
   * @returns
   */
  onLoad?: (responseData: any) => void;
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
   * 分页、排序、筛选时的回调
   */
  onChange?: (pagination: PaginationProps) => void;
  /**
   * 标题栏左侧按钮组
   */
  leftBtns?: Array<ButtonProps & { key: string; label: string; render?: React.ReactElement; show?: boolean; }>;
  /**
   * 标题栏右侧按钮组
   */
  rightBtns?: Array<ButtonProps & { key: string; label: string }>;
  /**
   * 筛选栏列数, 默认 4 列
   */
  colSpan?: number;
  /**
   * 筛选栏展示列数量, 默认 3 列, 剩余列隐藏
   */
  limitNum?: number;
  /**
   * 表格行是否可选
   */
  propsRowSelection?: TableRowSelectionProps;
}

const { Title, Text } = Typography;

const ProTable = (props: ProTableProps) => {
  const {
    title,
    conditions,
    searchText,
    resetText,
    rowKey,
    columns,
    scroll,
    leftBtns,
    rightBtns,
    showPagination,
    request,
    manualRequest,
    onLoad,
    onChange,
    initialQueryParams,
    colSpan,
    limitNum,
    formRef,
    propsRowSelection
  } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState(props.data || []);
  const [pagination, setPagination] = useState<PaginationProps>(
    props.pagination || {
      sizeCanChange: true,
      showTotal: true,
      pageSize: 10,
      current: 1,
      pageSizeChangeResetCurrent: true
    }
  );
  const [formParams, setFormParams] = useState(initialQueryParams || {});
  /** 单选多选相关逻辑 */
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[] | undefined>(
    propsRowSelection ? propsRowSelection?.selectedRowKeys || [] : undefined
  );

  useEffect(() => {
    if (!request) return;
    fetchData();
  }, [pagination.current, pagination.pageSize, JSON.stringify(formParams)]);

  useEffect(() => {
    // 手动模式触发更新
    if (manualRequest) {
      refresh();
    }
  }, [manualRequest]);

  const fetchData = async () => {
    const { current, pageSize } = pagination;
    setLoading(true);
    try {
      const res = await request({ ...formParams, page: current, pageSize });
      // 如果失败了, 直接返回, 不走剩下的逻辑
      if (res.success === false) return [];
      setData(res.data.list);
      setPagination({
        ...pagination,
        current,
        pageSize,
        total: res.data.total
      });
      onLoad?.(res.data);
    } catch (err) {
      console.error('Error: ', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchData();
  };

  const renderLeftBtns = () => {
    return leftBtns?.filter(btn => btn?.show).map(btn => (btn.render ? btn.render : <Button {...btn}>{btn.label}</Button>));
  };

  const renderRightBtns = () => {
    return rightBtns?.map(btn => <Button {...btn}>{btn.label}</Button>);
  };

  const handleSearch = (params: any) => {
    if (showPagination) {
      setPagination({ ...(pagination as Object), current: 1 });
    }
    setFormParams(params);
    if (isEqual(params, formParams)) {
      fetchData();
    }
  };

  const onChangeTable = (pagination: PaginationProps) => {
    const { current, pageSize } = pagination;
    setPagination({
      ...pagination,
      current,
      pageSize
    });
    onChange && onChange(pagination);
  };

  const rowSelection: TableRowSelectionProps = {
    selectedRowKeys,
    ...propsRowSelection,
    onChange: (selectedRowKeys, selectedRows) => {
      if (propsRowSelection && propsRowSelection.onChange) {
        propsRowSelection.onChange(selectedRowKeys, selectedRows);
      }
      setSelectedRowKeys(selectedRowKeys);
    }
  };

  // console.log('render ProTable: ', manualRequest);

  return (
    <Card>
      {title && <Title heading={6}>{title}</Title>}
      <SearchForm
        colSpan={colSpan}
        limitNum={limitNum}
        searchText={searchText}
        resetText={resetText}
        conditions={conditions}
        onSearch={handleSearch}
        ref={formRef!}
        initialValues={initialQueryParams}
      />
      <div className="button-group">
        <Space>{leftBtns && leftBtns.length > 0 && renderLeftBtns()}</Space>
        <Space>{rightBtns && rightBtns.length > 0 && renderRightBtns()}</Space>
      </div>
      <Table
        rowKey={rowKey}
        loading={loading}
        onChange={onChangeTable}
        pagination={showPagination ? pagination : false}
        columns={columns.map(col => {
          if (col.ellipsis) {
            return {
              ...col,
              render: col.render ? col.render : value => (
                <Tooltip content={value} position="tl" trigger="hover">
                  <CopyToClipboard
                    text={value}
                    onCopy={() => {
                      Message.success('复制成功');
                    }}
                  >
                    <Text
                      style={{ width: '100%', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                      {value}
                    </Text>
                  </CopyToClipboard>
                </Tooltip>
              )
            }
          }
          return col;
        })}
        data={data}
        scroll={scroll || { x: false, y: false }}
        rowSelection={propsRowSelection ? rowSelection : undefined}
      />
    </Card>
  );
};

export default ProTable;
