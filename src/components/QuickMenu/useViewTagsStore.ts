/**
 * 快捷菜单状态管理
 * @author: yilujun@jzsz.cc
 * @date: 2023-10-10 16:08:29
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ViewTag {
  key: string;
  title: string;
}

export interface ViewTagsStore {
  state: {
    viewTags: ViewTag[];
  },
  actions: {
    addViewTags: (payload: ViewTag) => void;
    pushViewTags: (payload: ViewTag) => void;
    removeViewTags: (key: string, func: (updatedViewTags: ViewTag[]) => void) => void;
    clearViewTags: () => void;
  }
}

const useViewTagsStore = create<ViewTagsStore, [['zustand/devtools', ViewTagsStore]]>(
  devtools((set, get) => {
    return {
      state: {
        viewTags: []
      },
      actions: {
        addViewTags: (payload) => {
          set(store => ({
            state: {
              ...store.state,
              viewTags: [...store.state.viewTags, payload]
            }
          }))
        },
        pushViewTags: (payload) => {
          const target = get().state.viewTags.find((tag) => tag.key === payload.key);
          if (!target) {
            set((store) => ({
              state: {
                ...store.state,
                viewTags: [...store.state.viewTags, payload]
              }
            }));
          }
        },
        removeViewTags: (key, cb) => {
          set((store) => ({
            state: {
              ...store.state,
              viewTags: store.state.viewTags.filter((tag) => tag.key !== key)
            }
          }));
          typeof cb === 'function' && cb(get().state.viewTags);
        },
        clearViewTags: () => {
          set((store) => ({
            state: {
              ...store.state,
              viewTags: []
            }
          }));
        }
      }
    }
  })
);

export default useViewTagsStore;