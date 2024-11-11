import {SET_CATEGORY_ACTIVE, SET_CATEGORY_LIST} from './types'


export const setCategoryActive = (id) => ({
  type: SET_CATEGORY_ACTIVE,
  payload: id
});

export const setCategoryList = (arr) => ({
  type: SET_CATEGORY_LIST,
  payload: arr
});