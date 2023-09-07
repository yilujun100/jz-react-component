import React from "react";
import { Select, Typography, Badge, Button, DatePicker } from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import { StoryFn, Meta } from "@storybook/react";
import dayjs from 'dayjs';
import ProTable from "./ProTable";
import '@arco-design/web-react/dist/css/arco.min.css';

const { Text } = Typography;

const ContentType = ['图文', '横版短视频', '竖版短视频'];
const FilterType = ['规则筛选', '人工'];
const Status = ['未上线', '已上线'];

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "ReactComponentLibrary/ProTable",
  component: ProTable,
} as Meta<typeof ProTable>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ProTable> = (args) => <ProTable {...args} />;

export const StaticRender = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const callback = async (record: Record<string, any>, type: string) => {
  console.log('tableCallback: ', record, type);
};

StaticRender.args = {
  title: '查询表格',
  conditions: [
    { id: 'id', label: '集合编号' },
    { id: 'name', label: '集合名称' },
    {
      id: 'contentType',
      label: '内容体裁',
      render: <Select
        placeholder="全部"
        options={ContentType.map((item, index) => ({
          label: item,
          value: index
        }))}
        mode="multiple"
        allowClear
      />
    },
    {
      id: 'filterType',
      label: '筛选方式',
      render: <Select
        placeholder="全部"
        options={FilterType.map((item, index) => ({
          label: item,
          value: index
        }))}
        mode="multiple"
        allowClear
      />
    },
    {
      id: 'createdTime',
      label: '创建时间',
      render: <DatePicker.RangePicker
        allowClear
        style={{ width: '100%' }}
        disabledDate={date => dayjs(date).isAfter(dayjs())}
      />
    },
    {
      id: 'status',
      label: '状态',
      render: <Select
        placeholder="全部"
        options={Status.map((item, index) => ({
          label: item,
          value: index
        }))}
        mode="multiple"
        allowClear
      />
    }
  ],
  searchText: '搜索',
  leftBtns: [
    { key: 'create', type: 'primary', label: '新建', icon: <IconPlus /> },
    { key: 'import', label: '批量导入' }
  ],
  rightBtns: [
    { key: 'download', label: '下载', icon: <IconDownload /> }
  ],
  rowKey: 'id',
  columns: [
    {
      title: '集合编号',
      dataIndex: 'id',
      render: value => <Text copyable>{value}</Text>
    },
    {
      title: '集合名称',
      dataIndex: 'name'
    },
    {
      title: '内容体裁',
      dataIndex: 'contentType',
      render: value => (
        <div className="content-type">
          {ContentType[value]}
        </div>
      )
    },
    {
      title: '筛选方式',
      dataIndex: 'filterType',
      render: value => FilterType[value]
    },
    {
      title: '内容量',
      dataIndex: 'count',
      sorter: (a, b) => a.count - b.count,
      render(x) {
        return Number(x).toLocaleString();
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      render: x => dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => b.createdTime - a.createdTime
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (x) => {
        if (x === 0) {
          return <Badge status="error" text={Status[x]}></Badge>;
        }
        return <Badge status="success" text={Status[x]}></Badge>;
      }
    },
    {
      title: '操作',
      dataIndex: 'operations',
      headerCellStyle: { paddingLeft: '15px' },
      render: (_, record) => (
        <Button
          type="text"
          size="small"
          onClick={() => callback(record, 'view')}
        >
          查看
        </Button>
      )
    }
  ],
  data: [
    { id: '40088683-4187', name: '每日推荐视频集',  contentType: 0, filterType: 0, count: '1136', createdTime: 1, status: 0 }
  ],
  // pagination: false
  pagination: {
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true
  }
};