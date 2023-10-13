import React, { useState, useEffect } from 'react';
import type { StoryFn, Meta, StoryObj } from '@storybook/react';
import { Space, Button, Table } from '@arco-design/web-react';
import ColumnSettingDrawer from './ColumnSettingDrawer';
import type { IColumn } from './ColumnSettingDrawer';
import { ascending } from './utils';

type Story = StoryObj<typeof ColumnSettingDrawer>;

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ColumnSettingDrawer> = {
  title: 'ReactComponentLibrary/ColumnSettingDrawer',
  component: ColumnSettingDrawer
};
export default meta;

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Salary', dataIndex: 'salary' },
  { title: 'Address', dataIndex: 'address' },
  { title: 'Email', dataIndex: 'email' }
];

const initialData = [
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com'
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com'
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    salary: 22000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com'
  },
  {
    key: '4',
    name: 'Ed Hellen',
    salary: 17000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com'
  },
  {
    key: '5',
    name: 'William Smith',
    salary: 27000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  }
];

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ColumnSettingDrawer> = args => {
  const [visible, setVisible] = useState(false);
  const [cols, setCols] = useState([]);

  useEffect(() => {
    const _cols = JSON.parse(localStorage.getItem('columns') || 'null');
    setCols(_cols ? _cols.filter((col: IColumn) => col.show) : columns);
  }, [localStorage.getItem('columns')]);

  return (
    <Space direction="vertical">
      <Button type="primary" onClick={() => setVisible(!visible)}>
        Open Drawer
      </Button>
      <Table columns={cols} data={initialData} pagination={false}></Table>
      <ColumnSettingDrawer {...args} visible={visible} setVisible={() => setVisible(false)} />
    </Space>
  );
};

export const Case1: Story = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Case1.args = {
  columns: columns.map((col, index) => ({
    ...col,
    originIndex: index,
    sortIndex: index,
    show: true
  })),
  onSubmit: (newCols: IColumn[]) => {
    console.log('onSubmit: ', newCols);
    // 用户拿到配置后的表格列进行其他操作，如将状态存储到本地,重新渲染表格
    localStorage.setItem('columns', JSON.stringify(newCols.sort(ascending)));
  }
};
