import {Dispatch} from 'redux';
import {authAPI, LoginParamsType} from '../api/todolist-api';
import {setAppStatusAC} from './appReducer';
import {handleServerAppError, handleServerNetworkError} from '../utils/error-utils';
import axios from 'axios';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';


const initialState = {
    isLoggedIn: false,
}

const slice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value: boolean}>) {
             {state.isLoggedIn = action.payload.value}
        }
    }
})

export const authReducer = slice.reducer;
// const setIsLoggedInAC = slice.actions.setIsLoggedInAC;
export const {setIsLoggedInAC} = slice.actions;


//thunk
export const loginTC = (dataLoginForm: LoginParamsType) => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))  //покажет крутилку
        const res = await authAPI.login(dataLoginForm)
        if(res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: true}))
            dispatch(setAppStatusAC({status: 'sucssesed'}))  //уберет крутилку
        }
        else {
            handleServerAppError(res.data, dispatch) //ошибки наши
        }
    } catch(e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)  //др ошибки
        }
    }
}


export const logoutTC = () => async (dispatch: Dispatch) => {
    try {
        dispatch(setAppStatusAC({status: 'loading'}))  //покажет крутилку
        const res = await authAPI.logout()
        if (res.data.resultCode === 0) {
            dispatch(setIsLoggedInAC({value: false}))
            dispatch(setAppStatusAC({status: 'sucssesed'}))  //уберет крутилку
        } else {
            handleServerAppError(res.data, dispatch) //ошибки наши
        }
    } catch (e) {
        if (axios.isAxiosError(e)) {
            handleServerNetworkError(e, dispatch)  //др ошибки
        }
    }
}
