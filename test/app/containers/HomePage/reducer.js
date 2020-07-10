import produce from 'immer';
import { CHANGE_PRIORITY, DATA_LOADING, DATA_LOADING_ERROR, DATA_LOADING_SUCCESS, MODALS, CHANGE_HEIGHT_LIST } from './constants';

export const initialState = {
  list: [],
  error: false,
  loading: false,
  modals: false,
  height: '100%',
};

/* eslint-disable default-case, no-param-reassign */
const dataReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case DATA_LOADING:
        draft.loading = true
        break
      case DATA_LOADING_SUCCESS:
        draft.list = action.list.sort((a, b) => {
          return a.priority - b.priority
        })
        draft.error = false
        draft.loading = false
        break
      case DATA_LOADING_ERROR:
        draft.error = action.error
        break
      case MODALS:
        draft.modals = action.modalState
        break
      case CHANGE_PRIORITY:
        let priority = 0
        if (action.index !== 0) {
          if (action.moving) {
            priority = ((draft.list[action.index + 1].priority - draft.list[action.index].priority) / 2) + draft.list[action.index].priority
          } else {
            priority = ((draft.list[action.index].priority - draft.list[action.index - 1].priority) / 2) + draft.list[action.index - 1].priority
          }

        } else {
          priority = draft.list[action.index].priority / 2
        }

        draft.list[action.itemIndex].priority = priority

        draft.list.sort((a, b) => {
          return a.priority - b.priority
        })
        break
      case CHANGE_HEIGHT_LIST:
        draft.height = action.height - 100
        break
      default:
    }
  });

export default dataReducer;
