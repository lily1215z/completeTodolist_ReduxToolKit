import {todolistAPI, TodolistType} from '../api/todolist-api';
import {Dispatch} from 'redux';
import {RequestStatusType, setAppStatusAC} from './appReducer';
import axios from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {TodoListFilterType} from '../components/TodolistMain';
import {fetchTasksTC} from './tasksReducer';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppDispatch} from '../redux/store';

const initState: Array<TodolistDomainType> = []

const slice = createSlice({
    name: 'todos',
    initialState: initState,
    reducers: {
        removeTodoListAC(state, action: PayloadAction<{ todolistId: string }>) {
            const index = state.findIndex(i => i.id === action.payload.todolistId)
            if (index > -1) {
                state.splice(index, 1);
            }
        },
        changeTodoListTitleAC(state, action: PayloadAction<{ todolistId: string, title: string }>) {
            // const todolist = state.find(i => i.id === action.payload.todolistId);
            // if (todolist) {
            //     todolist.title = action.payload.title;
            // }  //or
            const index = state.findIndex(i => i.id === action.payload.todolistId)
            state[index].title = action.payload.title
        },
        addTodoListAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'}) //1:22
        },
        changeFilterAC(state, action: PayloadAction<{ todolistId: string, value: TodoListFilterType }>) {
            // let todolistV = state.find(i => i.id === action.payload.todolistId);
            // if (todolistV) {
            //     todolistV.filter = action.payload.value
            // }  //or
            const index = state.findIndex(i => i.id === action.payload.todolistId)
            state[index].filter = action.payload.value
        },
        setTodoAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
            return action.payload.todolists.map(i => ({...i, filter: 'all', entityStatus: 'idle'}))
        },
        disabledOneTodolistAC(state, action: PayloadAction<{ todolistId: string, status: RequestStatusType }>) {
            // state.map(i => i.id === action.payload.todolistId ? {...i, entityStatus: action.payload.status} : i)
            const index = state.findIndex(i => i.id === action.payload.todolistId)
            state[index].entityStatus = action.payload.status
        }
    }
})
export const todolistsReducer = slice.reducer;

export const {
    removeTodoListAC,
    changeTodoListTitleAC,
    addTodoListAC,
    changeFilterAC,
    setTodoAC,
    disabledOneTodolistAC
} = slice.actions;

export const getTodoTC = () => {
    return async (dispatch: AppDispatch) => {
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            const res = await todolistAPI.getTodolist()
            if (res.data) {
                dispatch(setTodoAC({todolists: res.data}))
                dispatch(setAppStatusAC({status: 'sucssesed'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
            await res.data.forEach(t => {
                dispatch(fetchTasksTC(t.id))
            })
        } catch (e) {
            if (axios.isAxiosError(e)) {
                handleServerNetworkError(e, dispatch)
            }
        }
    }
}

export const addTodoListTC = (title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        const res = await todolistAPI.createTodolist(title)
        if (res.data.resultCode === 0) {  //0 - это успех
            dispatch(addTodoListAC({todolist: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'sucssesed'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const removeTodoListTC = (todolistId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(disabledOneTodolistAC({todolistId, status: 'loading'}))
        await todolistAPI.removeTodolist(todolistId)
        dispatch(removeTodoListAC({todolistId}))
        dispatch(setAppStatusAC({status: 'sucssesed'}))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}


export const changeTodolistTitleTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(disabledOneTodolistAC({todolistId, status: 'loading'}))
        await todolistAPI.updateTodolist(todolistId, title)
        dispatch(changeTodoListTitleAC({todolistId, title}))
        dispatch(setAppStatusAC({status: 'sucssesed'}))
        dispatch(disabledOneTodolistAC({todolistId, status: 'sucssesed'}))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}
//type
export type FilterValuesType = 'all' | 'active' | 'completed';

export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}