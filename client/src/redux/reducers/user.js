// user.js
import { RESET_USER, SET_USER } from '../actions/types';

const initialState = {
  name: 'чемпион',
  email: '',
  id: null,
  isLoaded: false  // Добавляем флаг загрузки
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case RESET_USER:
      return initialState;
    case SET_USER:
      return { 
        ...state, 
        name: action.payload.name, 
        email: action.payload.email, 
        id: action.payload.id,
        isLoaded: true  // Устанавливаем флаг загрузки при успешном вызове SET_USER
      };
    default:
      return state;
  }
};

export default user;
