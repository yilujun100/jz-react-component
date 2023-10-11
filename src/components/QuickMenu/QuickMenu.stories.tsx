import React from 'react';
import { MemoryRouter as Router, useNavigate } from 'react-router-dom';
import { StoryFn, Meta } from '@storybook/react';
import { Layout, Menu } from '@arco-design/web-react';
import QuickMenu from './QuickMenu';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'ReactComponentLibrary/QuickMenu',
  component: QuickMenu
} as Meta<typeof QuickMenu>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const Sider = Layout.Sider;

const SiderMenu = () => {
  const navigate = useNavigate();
  const onClickMenuItem = (key: string) => {
    navigate(`/${key}`);
  };
  return (
    <Menu
      style={{ width: 200, height: '100%' }}
      hasCollapseButton
      defaultOpenKeys={['dashboard']}
      defaultSelectedKeys={['dashboard/workplace']}
      onClickMenuItem={onClickMenuItem}
    >
      <SubMenu key="dashboard" title="仪表盘">
        <MenuItem key="dashboard/workplace">工作台</MenuItem>
        <MenuItem key="dashboard/monitor">实时监控</MenuItem>
      </SubMenu>
      <SubMenu key="list" title="列表页">
        <MenuItem key="list/search-table">查询表格</MenuItem>
      </SubMenu>
    </Menu>
  );
};
const Template: StoryFn<typeof QuickMenu> = args => (
  <Router initialEntries={['/dashboard/workplace']}>
    <Layout>
      <Sider>
        <SiderMenu />
      </Sider>
      <Layout>
        <QuickMenu {...args} />
      </Layout>
    </Layout>
  </Router>
);

export const Case1 = Template.bind({});

// More on args: https://storybook.js.org/docs/react/writing-stories/args

Case1.args = {
  routes: [
    {
      key: 'dashboard',
      path: 'dashboard',
      meta: {
        title: '仪表盘'
      },
      children: [
        {
          key: 'dashboard/workplace',
          path: 'workplace',
          meta: {
            title: '工作台',
            isDefault: true
          }
        },
        {
          key: 'dashboard/monitor',
          path: 'monitor',
          meta: {
            title: '实时监控'
          }
        }
      ]
    },
    {
      key: 'list',
      path: 'list',
      meta: {
        title: '列表页'
      },
      children: [
        {
          key: 'list/search-table',
          path: 'search-table',
          meta: {
            title: '查询表格'
          }
        }
      ]
    }
  ]
};
