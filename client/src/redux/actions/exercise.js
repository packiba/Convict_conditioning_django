import {SET_EXERCISE, SET_EXERCISE_DATA, SET_LEVEL_ACTIVE} from './types'


export const setExercise = (id, idCat) => ({
  type: SET_EXERCISE,
  payload: {id, idCat}
});

export const setExerciseData = (data) => ({
  type: SET_EXERCISE_DATA,
  payload: {data}
});

export const setLevel = id => ({
  type: SET_LEVEL_ACTIVE,
  payload: id
})
