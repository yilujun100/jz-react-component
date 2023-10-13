import React from 'react';
import { Select, Typography, Button, Message } from '@arco-design/web-react';
import { IconPlus } from '@arco-design/web-react/icon';
import type { StoryFn, Meta, StoryObj } from '@storybook/react';
import ModalForm from './ModalForm';
import '@arco-design/web-react/dist/css/arco.min.css';

type Story = StoryObj<typeof ModalForm>;

const { Text } = Typography;

const ContentType = ['图文', '横版短视频', '竖版短视频'];
const FilterType = ['规则筛选', '人工'];
const Status = ['未上线', '已上线'];

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ModalForm> = {
  title: 'ReactComponentLibrary/ModalForm',
  component: ModalForm
};
export default meta;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: StoryFn<typeof ModalForm> = args => <ModalForm {...args} />;

export const StaticRender: Story = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args

const waitTime = (time: number = 100) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

StaticRender.args = {
  title: '新建表单',
  trigger: (
    <Button type="primary" icon={<IconPlus />}>
      新建表单
    </Button>
  ),
  formItems: [
    { label: '集合编号', field: 'id', rules: [{ required: true, message: '请输入集合编号' }] },
    { label: '集合名称', field: 'name', rules: [{ required: true, message: '请输入集合名称' }] },
    {
      label: '内容体裁',
      field: 'contentType',
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
      label: '筛选方式',
      field: 'filterType',
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
      label: '状态',
      field: 'status',
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
  onFinish: async values => {
    await waitTime(2000);
    console.log('onFinish: ', values);
    Message.success('提交成功');
    return true;
  },
  initialValues: {
    id: '123',
    name: 'Juzi Component',
    contentType: [0],
    filterType: [0],
    status: [0]
  }
};
