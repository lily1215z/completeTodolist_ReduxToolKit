import {addTodoListAC, disabledOneTodolistAC, removeTodoListAC, setTodoAC} from './todolistReducer';
import {Dispatch} from 'redux';
import {todolistAPI, UpdateTaskModelType} from '../api/todolist-api';
import {setAppStatusAC} from './appReducer';
import axios from 'axios';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import {TaskPriorities, TaskStatuses, TasksType, TaskType} from '../components/TodolistMain';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppRootState} from '../redux/store';

export const initState: TasksType  = {}

const slice = createSlice({
    name: 'tasks',
    initialState: initState,
    reducers: {
        removeTasksAC(state: any, action: PayloadAction<{ todolistId: string, taskId: string }>) {
            const tasks = state[action.payload.todolistId];
            const index = tasks.findIndex((i: TaskType) => i.id === action.payload.taskId)
            if (index > -1) {
                tasks.splice(index, 1)
            }
        },
        addTasksAC(state, action: PayloadAction<{ todolistId: string, task: TaskType }>) {
            state[action.payload.todolistId].unshift(action.payload.task);  //1:51
        },
        updateTaskAC(state, action: PayloadAction<{ taskId: string, model: UpdateDomainTaskModelType, todolistId: string }>) {
            const todolistTasks = state[action.payload.todolistId];   //1:51
            const index = todolistTasks.findIndex((i: TaskType) => i.id === action.payload.taskId)
            if (index > -1) {
                todolistTasks[index] = {...todolistTasks[index], ...action.payload.model}
            }
        },
        setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
            state[action.payload.todolistId] = action.payload.tasks //1:53
        }
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action)=>{
            state[action.payload.todolist.id] = [];
        });
        builder.addCase(removeTodoListAC, (state, action) => {
           delete state[action.payload.todolistId];
        });
        builder.addCase(setTodoAC, (state, action) => {
            action.payload.todolists.forEach(i => state[i.id] = [])
        })
    }
})
export const tasksReducer = slice.reducer;
export const {removeTasksAC} = slice.actions;
export const {addTasksAC} = slice.actions;
export const {updateTaskAC} = slice.actions;
export const {setTasksAC} = slice.actions;
debugger

//     (state: TasksType = initState, action: TasksActionsType): TasksType => {
//     switch (action.type) {
//         case 'REMOVE_TASK': {
//             const stateCopy = {...state}
//             stateCopy[action.todolistId] = stateCopy[action.todolistId].filter(i => i.id !== action.taskId)
//             return stateCopy
//         }
//         case 'ADD_TASK': {
//             return {
//                 ...state,
//                 [action.todolistId]: [action.task, ...state[action.todolistId]]
//             }
//         }
//         case 'ADD_TODOLIST': {
//             return {
//                 ...state,
//                 [action.todolist.id]: []
//             }
//         }
//         case 'REMOVE_TODOLIST': {
//             const copyState = {...state};
//             delete copyState[action.todoListId];
//             return copyState;
//         }
//         case 'UPDATE-TASK': {
//             let todolistTasks = state[action.todolistId];
//             let newTasksArray = todolistTasks
//                 //берем таску целиком, и потом разкукоживаем модельку в кот какие-т осв-ва надо заменить
//                 .map(t => t.id === action.taskId ? {...t, ...action.model} : t);
//
//             state[action.todolistId] = newTasksArray;
//             return ({...state});
//         }
//         case 'SET-TODOLISTS': {
//             const stateCopy = {...state}
//             //в каждом тодолисте создаем ключ и к нему присваиваем пустой массив где будут таски
//             action.todolists.forEach(i => stateCopy[i.id] = [])
//             return stateCopy
//         }
//         case 'SET-TASKS': {
//             const stateCopy = {...state}
//             stateCopy[action.todolistId] = action.tasks
//             return stateCopy
//         }
//         default:
//             return state
//     }
// };


export const fetchTasksTC = (todolistId: string) => {
    return async (dispatch: Dispatch) => {
        try {
            dispatch(setAppStatusAC({status: 'loading'}))
            const res = await todolistAPI.getTasks(todolistId)
            if (res.data.items) {
                dispatch(setTasksAC({tasks: res.data.items, todolistId}))
                dispatch(setAppStatusAC({status: 'sucssesed'}))
            } else {
                handleServerAppError(res.data.items, dispatch)
            }
        } catch (e) {
            if (axios.isAxiosError(e)) {
                handleServerNetworkError(e, dispatch)
            }
        }
    }
}

export const removeTasksTC = (todolistId: string, taskId: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(disabledOneTodolistAC({todolistId, status: 'loading'}))
        await todolistAPI.removeTask(todolistId, taskId)
        dispatch(removeTasksAC({todolistId, taskId}))
        dispatch(setAppStatusAC({status: 'sucssesed'}))
        dispatch(disabledOneTodolistAC({todolistId, status: 'sucssesed'}))
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const addTasksTC = (todolistId: string, title: string) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))
        dispatch(disabledOneTodolistAC({todolistId, status: 'loading'}))
        const res = await todolistAPI.createTask(todolistId, title)
        if (res.data.resultCode === 0) {
            dispatch(addTasksAC({todolistId, task: res.data.data.item}))
            dispatch(setAppStatusAC({status: 'sucssesed'}))
            dispatch(disabledOneTodolistAC({todolistId, status: 'sucssesed'}))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)
        }
    }
}

export const updateTaskTC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => {
    return async (dispatch: Dispatch, getState: () => AppRootState) => {
        try {
            const state = getState()
            const task = state.tasks[todolistId].find((i: TaskType) => i.id === taskId)
            if (!task) {
                console.warn('task not found in the state')
                return
            }
            const apiModel: UpdateTaskModelType = {   //это то что отправляем. и типы разные
                title: task.title,
                startDate: task.startDate,
                priority: task.priority,
                description: task.description,
                deadline: task.deadline,
                status: task.status,
                //то что прийдет с UA его и перезатри а остальные оставим как есть
                ...model
            }
            dispatch(setAppStatusAC({status: 'loading'}))
            dispatch(disabledOneTodolistAC({todolistId, status: 'loading'}))
            await todolistAPI.updateTask(todolistId, taskId, apiModel)

            dispatch(updateTaskAC({taskId, model, todolistId}))
            dispatch(disabledOneTodolistAC({todolistId, status: 'sucssesed'}))
            dispatch(setAppStatusAC({status: 'sucssesed'}))

        } catch (e) {
            if (axios.isAxiosError(e)) {
                handleServerNetworkError(e, dispatch)
            }
        }
    }
}

//type
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

