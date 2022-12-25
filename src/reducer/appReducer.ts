import {Dispatch} from 'redux';
import {authAPI} from '../api/todolist-api';
import {setIsLoggedInAC} from './authReducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import axios from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type RequestStatusType = 'idle' | 'loading' | 'sucssesed' | 'failed';

const initState = {
    status: 'loading' as RequestStatusType,
    error: null as null | string,
    isInitialized: false,
    login: ''
}

const slice = createSlice({
    name: 'app',
    initialState: initState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
            {state.status = action.payload.status}
        },
        setAppErrorAC(state, action: PayloadAction<{error: null|string}>) {
            {state.error = action.payload.error}
        },
        setIsInitializedAC(state, action: PayloadAction<{value: boolean}>) {
            {state.isInitialized = action.payload.value}
        },
        getLoginNameAC(state, action: PayloadAction<{login: string}>) {
            {state.login = action.payload.login}
        }
    }
})
export const appReducer = slice.reducer;

export const {setAppStatusAC, setAppErrorAC, setIsInitializedAC, getLoginNameAC} = slice.actions;

//thunk
export const initializeAppTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))  //show preloader
        const res = await authAPI.me()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(getLoginNameAC({login: res.data.data.login}))
        } else {
            handleServerAppError(res.data, dispatch) //ошибки наши
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)  //др ошибки
        }
    } finally {
        dispatch(setIsInitializedAC({value: true}))
        dispatch(setAppStatusAC({status: 'sucssesed'}))  //remove preloader
    }
}

