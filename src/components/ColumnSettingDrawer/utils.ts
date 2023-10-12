/**
 * 列配置工具类方法
 * @author: yilujun@jzsz.cc
 * @date: 2023-10-12 16:28:09
 */
import { ExtendedColumn } from './SortTable';

type HashMap = {
  [key: string | number]: number;
}
/**
 * 生成排序列索引映射表
 */
export const generateSortColumnIndexMap = (columns: ExtendedColumn[]) => {
  const hashMap: HashMap = {};

  columns.forEach((col, index) => {
    hashMap[col.key as string] = index;
  });
  return hashMap;
};

/**
 * 升序排列
 * @param n1
 * @param n2
 * @returns
 */
export const ascending = (n1: ExtendedColumn, n2: ExtendedColumn) => n1.sortIndex - n2.sortIndex;