import React, { FC, useState, useEffect, useMemo } from 'react';
import { Tabs } from '@arco-design/web-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';
import useViewTagsStore from './useViewTagsStore';
import { getRoute, getName, getDefaultRoute } from './utils';
import './QuickMenu.less';

export type RouteConfigProps = RouteObject & {
  /** 路由表唯一key, 注意: 开头不要加/ */
  key?: string;
  /**
   * 路由表相关元数据
   * title: 标题
   * isDefault: 是否为默认路由, 如果值为 True , 那么登录后默认跳转到该路由
   */
  meta?: {
    title: string;
    isDefault?: boolean;
  };
  children?: RouteConfigProps[];
};

export type NonIndexRouteObject = Omit<RouteObject, 'children'> & {
  key?: string;
  meta?: {
    title: string;
    isDefault?: boolean;
    isLeaf?: boolean;
  };
  children?: NonIndexRouteObject[];
};

export type IRoute = RouteConfigProps & NonIndexRouteObject;

export interface QuickMenuProps {
  /**
   * 路由表配置
   * 注意: 使用 react-router-dom v6 版本
   */
  routes: IRoute[];
}

const QuickMenu: FC<QuickMenuProps> = props => {
  const { routes } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const viewTags = useViewTagsStore(store => store.state.viewTags);
  const pushViewTags = useViewTagsStore(store => store.actions.pushViewTags);
  const removeViewTags = useViewTagsStore(store => store.actions.removeViewTags);
  const clearViewTags = useViewTagsStore(store => store.actions.clearViewTags);
  const [activeTab, setActiveTab] = useState('');
  const isActive = (key: string) => key === location.pathname;
  const defaultRoute = useMemo(() => {
    return getDefaultRoute(routes);
  }, [JSON.stringify(routes)]);

  useEffect(() => {
    const { pathname } = location;
    const route = getRoute(pathname, routes);
    const isDefaultRoute = route?.meta?.isDefault;
    if (route?.meta) {
      pushViewTags({
        key: `/${route.key}`,
        title: route.meta.title
      });
    }
    if (!isDefaultRoute && !viewTags.map(tag => tag.key).includes(`/${defaultRoute?.key as string}`)) {
      pushViewTags({
        key: defaultRoute?.key as string,
        title: defaultRoute?.meta?.title as string
      });
    }
    setActiveTab(pathname);
  }, [location]);

  const onTabClick = (key: string) => {
    navigate(key);
  };

  const onTabDelete = (key: string) => {
    removeViewTags(key, updatedViewTags => {
      if (isActive(key)) {
        const latestView = updatedViewTags.slice(-1)[0].key;
        if (latestView) {
          navigate(latestView);
        } else {
          navigate('/');
        }
      }
    });
  };

  return (
    <Tabs
      editable
      showAddButton={false}
      defaultActiveTab={activeTab}
      activeTab={activeTab}
      direction="horizontal"
      onClickTab={onTabClick}
      onDeleteTab={onTabDelete}
      style={{ background: '#fff' }}
      className="nav-tag-tabs"
    >
      {viewTags.map((tab, i) => (
        <Tabs.TabPane destroyOnHide closable={i > 0} key={tab.key} title={tab.title}></Tabs.TabPane>
      ))}
    </Tabs>
  );
};

export default QuickMenu;
