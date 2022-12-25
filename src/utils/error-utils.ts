import {setAppErrorAC, setAppStatusAC} from '../reducer/appReducer';
import {ResponseType} from '../api/todolist-api';
import {Dispatch} from 'redux';

// generic function
export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
    if (data.messages.length) {
        dispatch(setAppErrorAC({error: data.messages[0]}))
    } else {
        dispatch(setAppErrorAC({error: 'Some error occurred'}))
    }
    dispatch(setAppStatusAC({status: 'failed'}))
}

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
    dispatch(setAppErrorAC({error: error.message ? error.message:  'Some error occurred'}))
    // dispatch(setAppErrorAC(error.message ? {error: error.message} : {error: 'Some error occurred'}))
    dispatch(setAppStatusAC({status: 'failed'}))
}

