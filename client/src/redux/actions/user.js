import {RESET_USER, SET_USER} from './types'


export const setUser = (userData) => ({
  type: SET_USER,
  payload: {
    name: userData.name,
    email: userData.email,
    id: userData.id  // Убедитесь, что user_id устанавливается как id
  }
});

export const resetUser = {
  type: RESET_USER,
}