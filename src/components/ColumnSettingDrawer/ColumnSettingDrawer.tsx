import React, { FC, useRef } from 'react';
import { Drawer, Space, Button, Message } from '@arco-design/web-react';
import type { TableColumnProps } from '@arco-design/web-react';
import { generateSortColumnIndexMap } from './utils';
import SortTable, { ExtendedColumn } from './SortTable';

export interface IColumn extends TableColumnProps {
  /**
   * 表格列是否展示
   */
  show: boolean;
  /**
   * 初始索引位置
   */
  originIndex: number;
  /**
   * 排序之后字段索引位置
   */
  sortIndex: number;
}

export interface ColumnSettingDrawerProps {
  /**
   * 是否显示抽屉框
   */
  visible: boolean;
  /**
   * 表格列
   */
  columns: IColumn[];
  /**
   * 设置是否显示抽屉框
   */
  setVisible: () => void;
  /**
   * 配置完成(修改排序、显示/隐藏)回调
   * @param newData 配置后的数据列
   * @returns
   */
  onSubmit: (newData: IColumn[]) => void;
}

interface RefObject {
  data: ExtendedColumn[];
  triggerSortReset: () => void;
}

const ColumnSettingDrawer: FC<ColumnSettingDrawerProps> = props => {
  const sortTableRef = useRef<RefObject>(null);

  const handleSubmit = () => {
    const data = sortTableRef.current?.data;
    if (Array.isArray(data) && data.every(item => !item.show)) {
      Message.warning('请至少选择一列数据');
      return;
    }
    if (!data) return;
    const sortColumnIndexMap = generateSortColumnIndexMap(data);
    props.onSubmit(data.map(col => ({ ...col, sortIndex: sortColumnIndexMap[col.key] })));
    props.setVisible();
  };

  const handleSortReset = () => {
    sortTableRef.current?.triggerSortReset();
  };

  return (
    <Drawer
      width={300}
      title="显示/隐藏列"
      visible={props.visible}
      footer={
        <Space>
          <Button onClick={handleSortReset}>重置排序</Button>
          <Button type="primary" onClick={handleSubmit}>
            确认
          </Button>
        </Space>
      }
      onOk={props.setVisible}
      onCancel={props.setVisible}
    >
      <SortTable columns={props.columns} ref={sortTableRef} />
    </Drawer>
  );
};

export default ColumnSettingDrawer;
