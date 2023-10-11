import { IRoute } from './QuickMenu';
/**
 * 获取路由表名称
 * @param path
 * @param routes
 * @returns
 */
export const getName: (path: string, routes: IRoute[]) => string = (path, routes) => {
  for (const route of routes) {
    const itemPath = `/${route.key}`;
    if (path === itemPath && route.meta) return route.meta.title;
    if (route.children) {
      const res = getName(path, route.children);
      if (res) return res;
    }
  }
  return '';
};

/**
 * 获取路由表
 * @param path
 * @param routes
 * @returns
 */
export const getRoute: (path: string, routes: IRoute[]) => IRoute | null = (path, routes) => {
  for (const route of routes) {
    const itemPath = `/${route.key}`;
    if (path === itemPath) return route;
    if (route.children) {
      const res = getRoute(path, route.children);
      if (res) return res;
    }
  }
  return null;
}

/**
 * 获取默认路由表
 * @param routes
 * @returns
 */
export const getDefaultRoute: (routes: IRoute[]) => IRoute | null = routes => {
  for (const route of routes) {
    if (route?.meta?.isDefault) {
      return route;
    }
    if (route.children) {
      const res = getDefaultRoute(route.children);
      if (res) return res;
    }
  }
  return null;
}