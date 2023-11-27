import React, { useState, useRef } from 'react';
import type { FormInstance } from '@arco-design/web-react';
import { Space, Select, Typography, Badge, Button, DatePicker, Dropdown, Menu } from '@arco-design/web-react';
import { IconDownload, IconPlus } from '@arco-design/web-react/icon';
import type { StoryFn, Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import ProTable from './ProTable';
import '@arco-design/web-react/dist/css/arco.min.css';

type Story = StoryObj<typeof ProTable>;

const { Text } = Typography;

const ContentType = ['图文', '横版短视频', '竖版短视频'];
const FilterType = ['规则筛选', '人工'];
const Status = ['未上线', '已上线'];

const generateFormModel = () => ({
  id: '',
  name: '',
  contentType: undefined,
  filterType: undefined,
  createdTime: undefined,
  status: undefined
});

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ProTable> = {
  title: 'ReactComponentLibrary/ProTable',
  component: ProTable
};
export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ProTable> = args => {
  const [manualRequest, setManualRequest] = useState(false);
  const formRef = useRef<{ form: FormInstance }>(null);
  console.log('render Template: ', manualRequest);
  return (
    <Space direction="vertical">
      <Button
        type="primary"
        onClick={() => {
          console.log('formRef: ', formRef.current?.form.getFieldsValue());
          setManualRequest(true);
        }}
      >
        Trigger Update
      </Button>
      <ProTable
        manualRequest={manualRequest}
        onLoad={resData => {
          console.log('onLoad: ', resData);
          setManualRequest(false);
        }}
        formRef={formRef}
        {...args}
      />
    </Space>
  );
};

export const StaticRender: Story = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
const callback = async (record: Record<string, any>, type: string) => {
  console.log('tableCallback: ', record, type);
};

StaticRender.args = {
  title: '查询表格',
  conditions: [
    { id: 'id', label: '集合编号' },
    {
      id: 'modifySalesman',
      label: <span style={{ marginLeft: '-12px' }}>修改业务员</span>,
      placeholder: '请输入修改业务员'
    },
    { id: 'name', label: '集合名称' },
    {
      id: 'contentType',
      label: '内容体裁',
      render: (
        <Select
          placeholder="全部"
          options={ContentType.map((item, index) => ({
            label: item,
            value: index
          }))}
          mode="multiple"
          allowClear
        />
      )
    },
    {
      id: 'filterType',
      label: '筛选方式',
      render: (
        <Select
          placeholder="全部"
          options={FilterType.map((item, index) => ({
            label: item,
            value: index
          }))}
          mode="multiple"
          allowClear
        />
      )
    },
    {
      id: 'createdTime',
      label: '创建时间',
      render: (
        <DatePicker.RangePicker
          allowClear
          style={{ width: '100%' }}
          disabledDate={date => dayjs(date).isAfter(dayjs())}
        />
      )
    },
    {
      id: 'status',
      label: '状态',
      render: (
        <Select
          placeholder="全部"
          options={Status.map((item, index) => ({
            label: item,
            value: index
          }))}
          mode="multiple"
          allowClear
        />
      )
    }
  ],
  colSpan: 6,
  limitNum: 3,
  searchText: '搜索',
  leftBtns: [
    { key: 'create', type: 'primary', label: '新建', icon: <IconPlus /> },
    { key: 'import', label: '批量导入' },
    { key: 'importExport',
      label: '导入导出',
      render: (
        <Dropdown
          droplist={
            <Menu>
              <Menu.Item key="downloadTpl">
                下载导入模板
              </Menu.Item>
              <Menu.Item key="import">
                导入
              </Menu.Item>
              <Menu.Item key="export">
                导出
              </Menu.Item>
            </Menu>
          }
        >
          <Button type="primary">
            导入导出
          </Button>
        </Dropdown>
      )
    }
  ],
  rightBtns: [{ key: 'download', label: '下载', icon: <IconDownload /> }],
  rowKey: 'id',
  columns: [
    {
      title: '集合编号',
      dataIndex: 'id',
      width: 200,
      render: value => <Text copyable>{value}</Text>
    },
    {
      title: '集合名称',
      dataIndex: 'name',
      width: 160
    },
    {
      title: '内容体裁',
      dataIndex: 'contentType',
      width: 100,
      render: value => <div className="content-type">{ContentType[value]}</div>
    },
    {
      title: '筛选方式',
      dataIndex: 'filterType',
      width: 100,
      render: value => FilterType[value]
    },
    {
      title: '内容量',
      dataIndex: 'count',
      width: 100,
      sorter: (a, b) => a.count - b.count,
      render(x) {
        return Number(x).toLocaleString();
      }
    },
    {
      title: '创建人',
      dataIndex: 'createName',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 180,
      render: x => dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => b.createdTime - a.createdTime
    },
    {
      title: '修改人',
      dataIndex: 'updateName',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'updatedTime',
      width: 180,
      render: x => dayjs().subtract(x, 'days').format('YYYY-MM-DD HH:mm:ss'),
      sorter: (a, b) => b.createdTime - a.createdTime
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: x => {
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
        <Button type="text" size="small" onClick={() => callback(record, 'view')}>
          查看
        </Button>
      )
    }
  ],
  data: [
    // { id: '40088683-4187', name: '每日推荐视频集',  contentType: 0, filterType: 0, count: '1136', createdTime: 1, status: 0 }
  ],
  scroll: { x: 1500 },
  request: async params => {
    console.log('request: ', params);
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            list: [
              {
                id: '40088683-4187',
                name: '每日推荐视频集',
                contentType: 0,
                filterType: 0,
                count: '1136',
                createdTime: 1,
                status: 0
              }
            ],
            total: 1
          }
        });
      }, 2000);
    });
  },
  initialQueryParams: generateFormModel(),
  showPagination: true,
  pagination: {
    sizeCanChange: true,
    showTotal: true,
    pageSize: 10,
    current: 1,
    pageSizeChangeResetCurrent: true
  },
  propsRowSelection: {
    type: 'checkbox',
    onChange: selectedRowKeys => {
      console.log('propsRowSelection onChange: ', selectedRowKeys);
    }
  }
};
