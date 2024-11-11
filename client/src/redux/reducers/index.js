import { combineReducers } from "redux";
import user from "./user";
import categories from './categories'
import exercise from './exercise'

const rootReducer = combineReducers({ user, categories, exercise });

export default rootReducer;