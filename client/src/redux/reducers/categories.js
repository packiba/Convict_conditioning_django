import {SET_CATEGORY_ACTIVE, SET_CATEGORY_LIST} from '../actions/types'

const initialState = {
  categoryList: [],
  activeCategory : [],
  activeCategoryId: 0
};

const categories = (state = initialState, action) => {
  switch (action.type) {
    case SET_CATEGORY_LIST:
      const categoriesCount = action.payload.length
      const newActiveCategory = new Array(categoriesCount).fill(false)
      newActiveCategory[state.activeCategoryId] = true
      return { ...state, categoryList: action.payload, activeCategory: newActiveCategory};
    case SET_CATEGORY_ACTIVE: {
      const newActiveCategory = new Array(state.categoryList.length).fill(false)
      newActiveCategory[action.payload] = true
      return {...state, activeCategory: newActiveCategory, activeCategoryId: action.payload}
    }
    default:
      return state;
  }
};

export default categories;