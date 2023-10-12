import React, { useState, ForwardRefRenderFunction, forwardRef, useImperativeHandle } from 'react';
import type { ReactNode } from 'react';
import { Table } from '@arco-design/web-react';
import { IconDragDotVertical } from '@arco-design/web-react/icon';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { ascending } from './utils';
import { IColumn } from './ColumnSettingDrawer';

interface IProps {
  columns: IColumn[];
}

export interface ExtendedColumn extends IColumn {
  key: number | string;
  column: ReactNode;
}

type SortTableHandle = {
  data: IColumn[];
  triggerSortReset: () => void;
};

const arrayMoveMutate = (array: Array<any>, from: number, to: number) => {
  const startIndex = to < 0 ? array.length + to : to;

  if (startIndex >= 0 && startIndex < array.length) {
    const item = array.splice(from, 1)[0];
    array.splice(startIndex, 0, item);
  }
};

const arrayMove = (array: Array<any>, from: number, to: number) => {
  array = [...array];
  arrayMoveMutate(array, from, to);
  return array;
};

const DragHandle = SortableHandle(() => (
  <IconDragDotVertical
    style={{
      cursor: 'move',
      color: '#555'
    }}
  />
));

const SortableWrapper = SortableContainer((props: any) => {
  return <tbody {...props} />;
});

const SortableItem = SortableElement((props: any) => {
  return <tr {...props} />;
});

const generateInitialData: (columns: IColumn[]) => ExtendedColumn[] = columns => {
  return columns.map(col => ({
    ...col,
    key: col.dataIndex as string,
    column: col.title
  }));
};

const SortTable: ForwardRefRenderFunction<SortTableHandle, IProps> = ({ columns }, ref) => {
  useImperativeHandle(ref, () => ({
    data,
    triggerSortReset
  }));
  const [data, setData] = useState<ExtendedColumn[]>(generateInitialData(columns));
  function onSortEnd({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) {
    if (oldIndex !== newIndex) {
      const newData = arrayMove(([] as ExtendedColumn[]).concat(data), oldIndex, newIndex).filter(el => !!el);
      console.log('New Data: ', newData);
      setData(newData);
    }
  }

  const triggerSortReset = () => {
    setData(
      generateInitialData(columns)
        .map(col => ({
          ...col,
          sortIndex: col.originIndex,
          show: true
        }))
        .sort(ascending)
    );
  };

  const DraggableContainer = (props: any) => (
    <SortableWrapper
      useDragHandle
      onSortEnd={onSortEnd}
      helperContainer={() => document.querySelector('.arco-drag-table-container table tbody')}
      updateBeforeSortStart={({ node }) => {
        const tds = node.querySelectorAll('td');
        tds.forEach(td => {
          td.style.width = td.clientWidth + 'px';
        });
      }}
      {...props}
    />
  );

  const DraggableRow = (props: any) => {
    const { record, index, ...rest } = props;
    return <SortableItem index={index} {...rest} />;
  };

  const components = {
    header: {
      operations: ({ selectionNode }: { selectionNode?: ReactNode; expandNode?: ReactNode }) => [
        {
          node: <th />,
          width: 40
        },
        {
          name: 'selectionNode',
          node: selectionNode
        }
      ]
    },
    body: {
      operations: ({ selectionNode }: { selectionNode?: ReactNode; expandNode?: ReactNode }) => [
        {
          node: (
            <td>
              <div className="arco-table-cell">
                <DragHandle />
              </div>
            </td>
          ),
          width: 40
        },
        {
          name: 'selectionNode',
          node: selectionNode
        }
      ],
      tbody: DraggableContainer,
      row: DraggableRow
    }
  };

  return (
    <Table
      className="arco-drag-table-container"
      components={components}
      columns={[
        {
          title: '列',
          dataIndex: 'column'
        }
      ]}
      data={data}
      pagination={false}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys: data.filter(col => col.show).map(col => col.key),
        onChange: selectedRowKeys => {
          const newData = data.map(item => ({
            ...item,
            show: selectedRowKeys.includes(item.key)
          }));
          setData(newData);
        },
        onSelectAll: selected => {
          setData(
            data.map(item => ({
              ...item,
              show: selected
            }))
          );
        }
      }}
    />
  );
};

export default forwardRef(SortTable);
