import { DATA_LOADING, DATA_LOADING_SUCCESS, DATA_LOADING_ERROR, MODALS, CHANGE_PRIORITY, CHANGE_HEIGHT_LIST } from './constants';

export function dataLoading() {
  return {
    type: DATA_LOADING,
  }
}

export function dataLoadingSuccess(list) {
  return {
    type: DATA_LOADING_SUCCESS,
    list,
  }
}

export function dataError(error) {
  return {
    type: DATA_LOADING_ERROR,
    error,
  }
}

export function modals(modalState) {
  return {
    type: MODALS,
    modalState,
  }
}

export function changePriority(index, itemIndex, moving) {
  return {
    type: CHANGE_PRIORITY,
    index,
    itemIndex,
    moving,
  }
}

export function changeHeightList(height) {
  return {
    type: CHANGE_HEIGHT_LIST,
    height,
  }
}
