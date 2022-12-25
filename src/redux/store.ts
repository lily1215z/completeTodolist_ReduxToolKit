import { combineReducers} from "redux";
import {todolistsReducer} from "../reducer/todolistReducer";
import { tasksReducer} from "../reducer/tasksReducer";
import thunk from "redux-thunk";
import {appReducer} from '../reducer/appReducer';
import {authReducer} from '../reducer/authReducer';
import {configureStore} from '@reduxjs/toolkit';

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app: appReducer,
    auth: authReducer,
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(thunk)
});

export type AppRootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch


//@ts-ignore
window.store = store