import {SET_EXERCISE, SET_EXERCISE_DATA, SET_LEVEL_ACTIVE} from '../actions/types'

const initialState = {
  isLoaded: false,
  catId: null,
  exerciseId : null,
  category: '',
  name: '',
  level1: [],
  level2: [],
  level3: [],
  description: '',
  animUri: '',
  activeLevel: 0,
};

const exercise = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXERCISE:
      return { ...state, catId:action.payload.idCat, exerciseId: action.payload.id, isLoaded: false};
    case SET_EXERCISE_DATA:
      const newState = {
        ...state,
        category: action.payload.data.category_name,
        name: action.payload.data.name,
        level1: action.payload.data.level1,
        level2: action.payload.data.level2,
        level3: action.payload.data.level3,
        description: action.payload.data.description,
        animUri: action.payload.data.anim_uri,
        isLoaded: true,
      };
      return newState;
    case SET_LEVEL_ACTIVE:
      return {...state, activeLevel: action.payload}
    default:
      return state;
  }
};

export default exercise;